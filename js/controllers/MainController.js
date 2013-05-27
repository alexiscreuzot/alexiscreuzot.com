'use strict';

// declare controller to myApp
myApp.controller('MainController',function($scope, $http, $routeParams){

    // Libs
    $scope.lab_data =
    [{
        name:"Libraries",
        content:
        [{
            name:"KALayoutHelper",
            url:"http://kirualex.github.io/KALayoutHelper",
            description:"A work in progress aiming to add a layout mecanism (similar to android) to views in iOS"
        },{
            name:"KASlideShow",
            url:"http://kirualex.github.io/KASlideShow",
            description:"Light slideshow library for iOS "
        },{
            name:"KANibHelper",
            url:"http://kirualex.github.io/KANibHelper",
            description:"Ease up iOS Nib management and improve app maintanability"
        }]
    },{
        name:"Projects",
        content:
        [{
            name:"ColourLove",
            url:"http://kirualex.github.io/ColourLove",
            description:"This project only purpose is to provide brief, clean and readable code in a dummy application. It is heavily library based and MVC oriented and shows mecanisms like downloading, storing and displaying data from a webservice."
        }]
    }];

    // Scribbles
    $scope.scribbles =
    [{
        id:0,
        title: "Test de titre",
        date: "13 Apr"
    },{
        id:1,
        title: "Test de titre",
        date: "22 May"
    },{
        id:2,
        title: "Test de titre",
        date: "24 May"
    }];

    // TODO
    // Scribble detail
    if($routeParams.scribbleId){
        $scope.scribble = $scope.scribbles[$routeParams.scribbleId];

        $http.get('scribbles/'+$routeParams.scribbleId+'.md').success(function(data) {
          //$scope.scribble.content = data;
          var dataToParse = {text:data};
          $http.post('https://api.github.com/markdown', angular.toJson(dataToParse)).success(function(parsedData) {
              $scope.scribble.content = parsedData;
          });
      });
    }
    
    


    // Ready
    $scope.htmlReady();
});