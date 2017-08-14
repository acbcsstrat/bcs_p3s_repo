var app = angular.module('myApp', ['ui.router', 'chart.js', 'ngIdle', 'ui.bootstrap', 'ngCart', 'ngCookies', 'ngAnimate']);

app.run(['Idle', function(Idle) {

	Idle.watch();

}]);



