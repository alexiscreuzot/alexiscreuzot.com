'use strict';

// declare controller to myApp
myApp.controller('DribbbleController',function($scope, $http, $routeParams, $location){


        // Get it's content
        $http.get('app/scribbles/'+$scope.scribble.id+'.md').success(function(data) {
          var dataToParse = {text:data};

          // Parse it with github markdown service
          $http({method: 'POST', url: 'https://api.github.com/markdown', data:angular.toJson(dataToParse), timeout:10*1000}).
          success(function(parsedData, status, headers, config) {

            // Inject share buttons
            shareButtons($location.absUrl(),$scope.scribble.title);

            // Inject scribble content
            $scope.scribble.content = parsedData;
            $('.article').addClass('trigger'); // anim
            Graphy.stopLoading();
        }).
          error(function(data, status, headers, config) {
            $scope.scribble.content = error_page;
            $('.article-footer').hide();
            $('.article').addClass('trigger'); // anim
            Graphy.stopLoading();
        });
      });
        

    // Ready
    $scope.htmlReady();
});
