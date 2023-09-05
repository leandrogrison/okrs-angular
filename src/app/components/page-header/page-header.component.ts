import { Component, Input, Output, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  titlePage: string = '';

  @Input() buttonIcon!: string;
  @Input() buttonText!: string;
  @Output() buttonAction = new EventEmitter();

  constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.titlePage = router.config.filter(r => r.path === router.url.substring(1))[0].data!['title'];
      }
    });
  }

}
