'use strict';

// declare controller to myApp
myApp.controller('LabController',function($scope, $http, $routeParams){

    // Libs
    $scope.lab_data =
    [{
        name:"Mobile Apps",
        content:
        [{
            name:"Nice Weather 2",
            url:"http://alexiscreuzot.com/apps/nice-weather-2",
            image:"http://i.imgur.com/kUR1VZL.png",
            description:"Nice Weather app sequel, with its all new killer design !"
        },{
            name:"Nice Weather",
            url:"http://alexiscreuzot.com/apps/nice-weather",
            image:"http://i.imgur.com/sNrBKKL.png",
            description:"A clean and simple Weather App."
        },{
            name:"Reddito",
            url:"http://alexiscreuzot.com/apps/reddito",
            image:"http://i.imgur.com/PzI3QWY.png",
            description:"Get your daily dose of fun with Reddito. Browse, save and share Reddit images like never before !"
        },{
            name:"7 minutes Workout",
            url:"http://alexiscreuzot.com/apps/7-minutes-workout",
            image:"http://i.imgur.com/xNXPvj6.png",
            description:"The perfect assistant to get in shape using the scientific 7-minute Workout, directly on your iPhone"
        }]
    },{
        name:"Web",
        content:
        [{
            name:"grinderlabs.com",
            url:"http://grinderlabs.com/",
            description:"A serverless website made for a good friend & colegue, Jérémy Paul. Images and videos are fetched directly from Flickr and Vimeo API using JQuery."
        },{
            name:"dploy",
            url:"http://alexiscreuzot.com/lab/dploy",
            description:"Front-end of a website that never saw the light of day... for now !"
        }]
    },{
        name:"Libraries",
        content:
        [{
            name:"KAProgressLabel",
            url:"http://alexiscreuzot.com/KAProgressLabel/",
            description:"Minimal iOS circular progress library"
        },{
            name:"KAStatusBar",
            url:"http://alexiscreuzot.com/KAStatusBar/",
            description:"iOS status bar notification/alert library"
        },{
            name:"KALayoutHelper",
            url:"http://alexiscreuzot.com/KALayoutHelper",
            description:"A work in progress aiming to add a layout mechanism (similar to android) to views in iOS"
        },{
            name:"KASlideShow",
            url:"http://alexiscreuzot.com/KASlideShow",
            description:"Simple slideshow library for iOS "
        },{
            name:"KANibHelper",
            url:"http://alexiscreuzot.com/KANibHelper",
            description:"Ease up iOS Nib management and improve app maintanability"
        }]
    },{
        name:"Open Source projects",
        content:
        [{
            name:"SprityBird",
            url:"https://github.com/kirualex/SprityBird",
            description:" Small clone of Flappy Bird for iOS using SpriteKit framework. It can be used as a base for many types of scrolling games with some imagination."
        },{
            name:"RESideMenu",
            url:"https://github.com/romaonthego/RESideMenu",
            description:"An open source iOS project on which I heavily contributed. This project aim to provide a new menu style based on a designer idea."
        },{
            name:"ColourLove",
            url:"http://alexiscreuzot.com/ColourLove",
            description:"This project only purpose is to provide brief, clean and readable code in a dummy application. It is heavily library based and MVC oriented and shows mecanisms like downloading, storing and displaying data from a webservice."
        }]
    },{
        name:"Funny stuff",
        content:
        [{
            name:"The Screaming Sheep",
            url:"http://alexiscreuzot.com/lab/sheep",
            description:"Everyone should make the sheep scream once in a while. At work. Speakers on."
        },{
            name:"Dear Sister",
            url:"http://alexiscreuzot.com/lab/dearsister",
            description:"Based on a skit by the lonely island. Don't ask."
        }]
    }];

    // Ready
    $scope.htmlReady();
});
