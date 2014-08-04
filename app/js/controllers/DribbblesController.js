'use strict';

// declare controller to myApp
myApp.controller('DribbblesController',function($scope, $http, $routeParams, $location){

  Graphy.startLoading(120);
  // Get it's content
  $http.jsonp('http://api.dribbble.com/players/kirualex/shots?callback=JSON_CALLBACK')
  .success(function(data) {
    $scope.dribbbles = data['shots'];
    Graphy.stopLoading();
  })
  .error(function(data, status, headers, config) {
    console.log(data);
    Graphy.stopLoading();
  });

});




