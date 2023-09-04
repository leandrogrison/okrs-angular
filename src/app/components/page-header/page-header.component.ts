import { Component, Input, Output, EventEmitter, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  titlePage: string = '';
  smallScreen: boolean = document.body.clientWidth < 960;

  @Input() buttonIcon!: string;
  @Input() buttonText!: string;
  @Output() buttonAction = new EventEmitter();

  constructor(router: Router, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.titlePage = router.config.filter(r => r.path === router.url.substring(1))[0].data!['title'];
      }
    });
  }

  windowResize = () => {};

  ngOnInit(): void {
    this.windowResize = this.renderer.listen(window, 'resize', () => {
      this.smallScreen = document.body.clientWidth < 960;
    });
  }

  ngOnDestroy() {
    this.windowResize();
  }

}
