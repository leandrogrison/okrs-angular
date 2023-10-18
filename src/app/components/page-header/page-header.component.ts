import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  titlePage: string = '';

  @Input() buttonIcon!: string;
  @Input() buttonText!: string;
  @Output() buttonAction = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit(): void {
    const rootLogged = this.router.config.filter(route => route.path === '')[0].children!;
    const currentRoute = rootLogged.filter(route => route.path === this.router.url.substring(1))[0];

    this.titlePage = currentRoute.data!['title'];
  }

}
