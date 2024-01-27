import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteInfo } from './horizontal-sidebar.metadata';
import { HorizontalSidebarService } from './horizontal-sidebar.service';


@Component({
  selector: 'app-horizontal-sidebar',
  templateUrl: './horizontal-sidebar.component.html'
})
export class HorizontalSidebarComponent {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[] = [];
  path = '';

  constructor(private menuServise: HorizontalSidebarService, private router: Router) {
    this.menuServise.items.subscribe(menuItems => {
      this.sidebarnavItems = menuItems;
  
      // Active menu
      const activeMenu = this.sidebarnavItems.find(m => m.submenu.find(s => s.path === this.router.url));
      if (activeMenu) {
        this.path = activeMenu.title;
        this.addExpandClass(this.path);
      }
    });
  }

  addExpandClass(elemento: any) {
    if (elemento === this.showMenu) {
      this.showMenu = elemento;
    } 
  }

  addActiveClass(elementa: any) {
    if (elementa === this.showSubMenu) {
      this.showSubMenu = elementa;
    } 
    
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
