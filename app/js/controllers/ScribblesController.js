'use strict';

// declare controller to myApp
myApp.controller('ScribblesController',function($scope, $http, $routeParams, $location){

    // Init error page
    var error_page;
    $http.get('app/partials/error.html').success(function(data) {
        error_page = data;
    });

    // Scribbles
    $scope.years=[
    {
        year: 2013,
        scribbles: [
            /*{
                id: 0,
                title: "KALayoutHelper library",
                date: "13 Apr",
                published: true
            },
            {
                id: 1,
                title: "KASlideShow library",
                date: "22 May",
                published: true
            },
            {
                id: 2,
                title: "KANibHelper library",
                date: "24 May",
                published: true
            },
            */{
                id: 3,
                title: "ColourLove Project, DRY KISS anyone?",
                date: "27 May",
                published: true
            },
            {
                id: 4,
                title: "Building the 7 Minute Workout App",
                date: "6 Jun",
                published: true
            },
            {
                id: 5,
                title: "Circular progress with KAProgressLabel",
                date: "12 Jun",
                published: true
            },
            {
                id: 6,
                title: "You are the only one seeing this page",
                date: "25 Jun",
                published: true
            },
            {
                id: 7,
                title: "Choosing how to build a personal website",
                date: "3 Jul",
                published: true
            },
            {
                id: 8,
                title: "A first iOS project Post Mortem",
                date: "12 Aug",
                published: true
            },
            {
                id: 9,
                title: "On Soylent, and why engineers should not stick to their code",
                date: "15 Aug",
                published: true
            },
            {
                id: 10,
                title: "Rien à Craindre",
                date: "21 Aug",
                published: true
            },
            {
                id: 11,
                title: "Creating a reusable Settings component for iOS",
                date: "16 Sept",
                published: true
            },
            {
                id: 12,
                title: "Managing data on iOS : Active Record to the rescue",
                date: "23 Sept",
                published: true
            },
            {
                id: 13,
                title: "La métaphysique des bulles",
                date: "17 Nov",
                published: true
            }
        ]
    },
    {
        year: 2014,
        scribbles: [
            {
                id: 14,
                title: "7 tips to launch a successful app",
                date: "2 Jan",
                published: true
            },{
                id: 15,
                title: "WowApp : Learn to Make an App in 3 Minutes",
                date: "31 Jan",
                published: true
            }
        ]
    }];


    var shareButtons = function(loc, title){
        var windowFeatures = 'height=450, width=550, top='+($(window).height()/2 - 225)+', left='+$(window).width()/2
        +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0';

            // Twitter
            $('a.tweet').click(function(e){
              window.open('http://twitter.com/share?url=' + escape(loc)+'&text='+encodeURI('"'+title+'" by @kirualex'), 'tweetsharer', windowFeatures);
          });

            // Fb
            $('a.facebook').click(function(e){
                window.open('http://facebook.com/sharer.php?u='+ escape(loc), 'fbsharer', windowFeatures);
            });
        };


    // Scribble detail
    if($routeParams.slug){
        Graphy.startLoading(120);
       
        // Find scribble
        for(var i=0;i<$scope.years.length;i++){
            var year = $scope.years[i];
            for(var j=0;j<year.scribbles.length;j++){
               var scrib = year.scribbles[j];
               if($scope.slug(scrib.title) == $routeParams.slug || scrib.id == $routeParams.slug ){
                    $scope.scribble = scrib;
               }
            }
        }

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
    }

    // Ready
    $scope.htmlReady();
});
