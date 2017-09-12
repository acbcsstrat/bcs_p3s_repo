var app = angular.module('myApp', ['ui.router', 'chart.js', 'ngIdle', 'ngAnimate', 'ui.bootstrap', 'ngCart', 'ngCookies']);

app.run(['Idle', function(Idle) {

	Idle.watch();

}]);



