
import './_dashboard.scss';

import angular from 'angular';

import DashboardService from './dasshboard.serv.js';

import DashboardController from './dashboard.controller';

export default angular.module('ppApp.home', [DashboardService])
  .controller('DashboardController', DashboardController)
  .name;

// dashboardCtrl.$inject = ['$scope','$state', 'patentIds', '$timeout', '$rootScope', 'patentPhasesService', '$transitions', 'dashboardService', '$transitions'];

// function dashboardCtrl ($scope, $state, patentIds, $timeout, $rootScope, patentPhasesService, $transitions, dashboardService, $transitions) {
