import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, Renderer2 } from '@angular/core';

import { Objective } from 'src/app/Objective';

import { ExpandAllService } from 'src/app/services/expand-all.service';

import { QuarterPipe } from 'src/app/pipes/quarter.pipe';

@Component({
  selector: 'app-objective-map',
  templateUrl: './objective-map.component.html',
  styleUrls: ['./objective-map.component.scss']
})
export class ObjectiveMapComponent implements OnInit {

  @Input() objectives!: Objective[];
  @Input() objectivesInBackground!: Objective[];
  @Output() updateObjectives = new EventEmitter();

  @ViewChild('mapContainer') map!: ElementRef;
  @ViewChild('mapRoot') mapRoot!: ElementRef;
  @ViewChild('mapHeader') mapHeader!: ElementRef;
  @ViewChildren('mapFirstLevel', {read: ElementRef}) mapFirstLevel!: QueryList<ElementRef>;

  zoomFactor: number = 1;
  translateX: number = 0;
  marginBottomMap!: number;
  isMoving: boolean = false;
  controlPressed: boolean = false;
  marginMap: number = 24;
  clientXOld: number = 0;
  clientYOld: number = 0;
  diffBetweenPointsOld = { x: 0, y: 0 };
  isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  constructor(private renderer: Renderer2, private expandAllService: ExpandAllService, private quarterPipe: QuarterPipe) {}

  @HostListener('touchstart', ['$event'])
  zoomMobileStart(event: any) {
    if (event.touches.length < 2) return;

    this.diffBetweenPointsOld = this.getDiffBetweenPoints(event);
  }

  @HostListener('touchmove', ['$event'])
  zoomMobile(event: any) {
    if (event.touches.length < 2) return;

    const diffBetweenPoints = this.getDiffBetweenPoints(event);

    if (diffBetweenPoints.x > this.diffBetweenPointsOld.x || diffBetweenPoints.y > this.diffBetweenPointsOld.y) {
      this.zoomIn();
      this.diffBetweenPointsOld = diffBetweenPoints;
    }
    if (diffBetweenPoints.x < this.diffBetweenPointsOld.x || diffBetweenPoints.y < this.diffBetweenPointsOld.y) {
      this.zoomOut();
      this.diffBetweenPointsOld = diffBetweenPoints;
    }

  }

  @HostListener('mousewheel', ['$event'])
  zoomScroll(event: any) {

    if (!this.controlPressed) return;

    event.preventDefault();
    if (event.wheelDeltaY > 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  @HostListener('document:keydown.control', ['$event'])
  setKeyControlPressed(event: any) {
    this.controlPressed = true;
  }

  @HostListener('document:keyup.control', ['$event'])
  setKeyControlUnpressed(event: any) {
    this.controlPressed = false;
  }

  listenerDrawer = () => {};

  ngOnInit(): void {
    this.listenerDrawer = this.renderer.listen(document.getElementsByClassName('mat-drawer-content')[0], 'scroll', () => {
      if (this.mapRoot.nativeElement.isConnected) {
        this.setPositionHeaderMap();
      }
    });
  }

  ngOnDestroy() {
    this.listenerDrawer();
  }

  getDiffBetweenPoints(event: any) {
    const factorZoom = 50;
    const diffX = Math.floor((Math.abs(event.touches[1].screenX - event.touches[0].screenX)) / factorZoom);
    const diffY = Math.floor((Math.abs(event.touches[1].screenY - event.touches[0].screenY)) / factorZoom);

    return { x: diffX, y: diffY };
  }

  trackByObjective(index: number, item: Objective): any {
    return item.id;
  }

  setPositionHeaderMap() {
    const positionTopMap = parseInt(this.mapRoot.nativeElement.getBoundingClientRect().top);
    const positionLeftMap = parseInt(this.mapRoot.nativeElement.getBoundingClientRect().left);
    const positionRightMap = parseInt(this.mapRoot.nativeElement.getBoundingClientRect().right);
    const widthWindow = window.innerWidth;

    if (positionTopMap < 0) {
      this.mapHeader.nativeElement.style.position = 'fixed';
      this.mapHeader.nativeElement.style.left = positionLeftMap + 'px';
      this.mapHeader.nativeElement.style.right = widthWindow - positionRightMap + 'px';
    } else {
      this.mapHeader.nativeElement.style.position = 'absolute';
      this.mapHeader.nativeElement.style.left = '0px';
      this.mapHeader.nativeElement.style.right = '0px';
    }
  }

  zoomOut() {
    this.zoomFactor = this.zoomFactor >= .2 ? this.zoomFactor - .1 : .1;
    this.getMarginByZoom();
    setTimeout(() => {
      this.verifyCenterOfMap();
    }, 200);
  }

  zoomIn() {
    this.zoomFactor = this.zoomFactor + .1;
    this.getMarginByZoom();
  }

  zoomDefault() {
    this.zoomFactor = 1;
    this.getMarginByZoom();
    this.verifyCenterOfMap();
  }

  zoomFit() {
    const widthMapRoot = this.mapRoot.nativeElement.offsetWidth;
    const heightMap = this.map.nativeElement.offsetHeight;
    const heightArea = window.innerHeight - this.map.nativeElement.getBoundingClientRect().top;
    const gapBetweenObjectives = 32;
    const maxZoomFactor = 3;
    let widthMap = 0;

    this.mapFirstLevel.map(obj => {
      widthMap += obj.nativeElement.offsetWidth + gapBetweenObjectives;
    })

    const percentToAdjustWidth = Math.floor(widthMapRoot / widthMap * 10) / 10;
    const percentToAdjustHeight = Math.floor(heightArea / heightMap * 10) / 10;
    const percentToAdjustZoom = Math.min(percentToAdjustWidth, percentToAdjustHeight);

    this.zoomFactor = percentToAdjustZoom > maxZoomFactor ? maxZoomFactor : percentToAdjustZoom;
    this.getMarginByZoom();
    setTimeout(() => {
      this.verifyCenterOfMap();
    }, 200);
  }


  verifyCenterOfMap(){
    const mapPositionLeft = this.mapFirstLevel.first.nativeElement.getBoundingClientRect().left;
    const mapPositionRight = this.mapFirstLevel.last.nativeElement.getBoundingClientRect().right;

    const mapRootPositionLeft = this.mapRoot.nativeElement.getBoundingClientRect().left;
    const mapRootPositionRight = this.mapRoot.nativeElement.getBoundingClientRect().right;

    const widthMap = mapPositionRight - mapPositionLeft;
    const widthMapRoot = mapRootPositionRight - mapRootPositionLeft;

    if (widthMap <= widthMapRoot) this.translateX = 0;
  }

  getMarginByZoom() {
    const heightDefault = this.map.nativeElement.clientHeight;
    const heightWithZoom = heightDefault * this.zoomFactor;
    const diffHeight = (heightDefault - heightWithZoom) * (this.zoomFactor === 1 ? 1 : -1);

    this.marginBottomMap = diffHeight;
  }

  setMouseMoving(isMoving: boolean, event?: any) {
    this.isMoving = isMoving;
    if (event) {
      this.clientXOld = event.touches[0].screenX;
      this.clientYOld = event.touches[0].screenY;
    }
  }

  moveMap(event: any) {
    if (!this.isMoving) return;

    const mapPositionLeft = this.mapFirstLevel.first.nativeElement.getBoundingClientRect().left;
    const mapPositionRight = this.mapFirstLevel.last.nativeElement.getBoundingClientRect().right;

    const mapRootPositionLeft = this.mapRoot.nativeElement.getBoundingClientRect().left + this.marginMap;
    const mapRootPositionRight = this.mapRoot.nativeElement.getBoundingClientRect().right - this.marginMap;

    let positionX = event.movementX;
    let positionY = event.movementY;

    if (this.isMobile) {
      positionX = event.touches[0].screenX - this.clientXOld
      positionY = event.touches[0].screenY - this.clientYOld
      this.clientXOld = event.touches[0].screenX;
      this.clientYOld = event.touches[0].screenY;
    }

    if (
      (mapPositionRight >= mapRootPositionRight && positionX < 0) ||
      (mapPositionLeft <= mapRootPositionLeft && positionX > 0)
    ) {
      this.translateX = this.translateX + (positionX / this.zoomFactor);
    }

    if (!this.isMobile) {
      document.getElementsByClassName('mat-drawer-content')[0].scrollBy(0, -event.movementY);
    } else {
      document.getElementsByClassName('mat-drawer-content')[0].scrollBy(0, -positionY);
    }

  }

  expandAll(action: boolean) {
    this.expandAllService.expandAll(action);

    setTimeout(() => {
      this.verifyCenterOfMap();
    }, 200);
  }

  handleUpdateObjectives(objective: Objective) {
    this.updateObjectives.emit(objective);
  }
}
