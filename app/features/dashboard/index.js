
import './_dashboard.scss';

import angular from 'angular';

import DashboardService from './dashboard.serv.js';

import DashboardController from './dashboard.controller';

import routing  from './dashboard.routes';
console.log('index.js')
export default angular.module('ppApp.dashboard', [DashboardService])
	.config(routing)
  	.controller('DashboardController', DashboardController)
  	.name;

// dashboardCtrl.$inject = ['$scope','$state', 'patentIds', '$timeout', '$rootScope', 'patentPhasesService', '$transitions', 'dashboardService', '$transitions'];

// function dashboardCtrl ($scope, $state, patentIds, $timeout, $rootScope, patentPhasesService, $transitions, dashboardService, $transitions) {
