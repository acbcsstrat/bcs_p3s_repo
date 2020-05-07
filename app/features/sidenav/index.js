import angular from 'angular';


import SidenavService from './services/sidenav.service';

import MenuToggle from './directives/menu-toggle.directive';
import MenuLink from './directives/menu-link.directive';

import sidenav from './components/sidenav.component';

import ppIcon from './ppIcon.png';
import avatarDefault from './avatarDefault.png';


export default angular.module('ppApp.sidenav', [SidenavService, sidenav, MenuToggle,  MenuLink]) //import dashboard view controllers
  	.name;
