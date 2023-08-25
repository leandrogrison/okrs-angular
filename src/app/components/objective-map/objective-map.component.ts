import { Component, Input, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, Renderer2 } from '@angular/core';

import { Objective } from 'src/app/Objective';

@Component({
  selector: 'app-objective-map',
  templateUrl: './objective-map.component.html',
  styleUrls: ['./objective-map.component.scss']
})
export class ObjectiveMapComponent implements OnInit {

  @Input() objectives!: Objective[];

  @ViewChild('mapContainer') map!: ElementRef;
  @ViewChild('mapRoot') mapRoot!: ElementRef;
  @ViewChild('mapHeader') mapHeader!: ElementRef;
  @ViewChildren('mapFirstLevel', {read: ElementRef}) mapFirstLevel!: QueryList<ElementRef>;

  zoomFactor: number = 1;
  translateX: number = 0;
  marginBottomMap!: number;
  isMoving: boolean = false;
  controlPressed: boolean = false;

  constructor(private renderer: Renderer2) {}

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
    let widthMap = 0;

    this.mapFirstLevel.map(obj => {
      widthMap += obj.nativeElement.offsetWidth + 32; // 32 corresponde ao gap entre os objetivos
    })

    const percentToAdjustWidth = Math.floor(widthMapRoot / widthMap * 10) / 10;
    const percentToAdjustHeight = Math.floor(heightArea / heightMap * 10) / 10;
    const percentToAdjustZoom = Math.min(percentToAdjustWidth, percentToAdjustHeight);

    this.zoomFactor = percentToAdjustZoom > 3 ? 3 : percentToAdjustZoom; // 3 é o fator máximo de zoom
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

  setMouseMoving(isMoving: boolean) {
    this.isMoving = isMoving;
  }

  moveMap(event: any) {
    if (!this.isMoving) return;

    const mapPositionLeft = this.mapFirstLevel.first.nativeElement.getBoundingClientRect().left;
    const mapPositionRight = this.mapFirstLevel.last.nativeElement.getBoundingClientRect().right;

    const mapRootPositionLeft = this.mapRoot.nativeElement.getBoundingClientRect().left;
    const mapRootPositionRight = this.mapRoot.nativeElement.getBoundingClientRect().right;

    if (
      (mapPositionRight >= mapRootPositionRight && event.movementX < 0) ||
      (mapPositionLeft <= mapRootPositionLeft && event.movementX > 0)
    ) {
      this.translateX = this.translateX + (event.movementX / this.zoomFactor);
    }

    document.getElementsByClassName('mat-drawer-content')[0].scrollBy(0, -event.movementY);

  }


}
