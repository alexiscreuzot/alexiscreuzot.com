'use strict';

// declare controller to myApp
myApp.controller('LabController',function($scope, $http, $routeParams){

    // Libs
    $scope.lab_data =
    [{
        name:"Mobile Apps",
        content:
        [{
            name:"Qolor",
            url:"https://itunes.apple.com/fr/app/id973492333",
            image:"http://i.imgur.com/5xpXBqi.png",
            description:"Wonder what color is your friend's dress? What shade of green is your neighbor's grass? There's an app for that."
        },{
            name:"Winkli",
            url:"https://itunes.apple.com/fr/app/id913588239",
            image:"http://i.imgur.com/7GS8spQ.png",
            description:"Discover who you'll bump into at your next Facebook event"
        },{
            name:"Nice Weather 2",
            url:"https://itunes.apple.com/fr/app/id729430189",
            image:"http://i.imgur.com/kUR1VZL.png",
            description:"Nice Weather app sequel, with its all new killer design !"
        },{
            name:"Nice Weather",
            url:"https://itunes.apple.com/fr/app/id709290908",
            image:"http://i.imgur.com/sNrBKKL.png",
            description:"A clean and simple Weather App."
        },{
            name:"Reddito",
            url:"https://itunes.apple.com/fr/app/id674736514",
            image:"http://i.imgur.com/PzI3QWY.png",
            description:"Get your daily dose of fun with Reddito. Browse, save and share Reddit images like never before !"
        },{
            name:"7 minutes Workout",
            url:"https://itunes.apple.com/fr/app/id650627810",
            image:"http://i.imgur.com/xNXPvj6.png",
            description:"The perfect assistant to get in shape using the scientific 7-minute Workout, directly on your iPhone"
        }]
    },{
        name:"Web",
        content:
        [{
            name:"Qolor",
            url:"http://monoqle.fr/qolor",
            description:"Qolor app product page"
        },{
            name:"Monoqle",
            url:"http://monoqle.fr/",
            description:"Website for the company I cofounded"
        },{
            name:"Wink.li",
            url:"http://wink.li/",
            description:"Product page for the Winkli iPhone App"
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
            url:"http://github.com/kirualex/KAProgressLabel/",
            description:"Minimal iOS circular progress library"
        },{
            name:"KAStatusBar",
            url:"http://github.com/kirualex/KAStatusBar/",
            description:"iOS status bar notification/alert library"
        },{
            name:"KALayoutHelper",
            url:"http://github.com/kirualex/KALayoutHelper",
            description:"A work in progress aiming to add a layout mechanism (similar to android) to views in iOS"
        },{
            name:"KASlideShow",
            url:"http://github.com/kirualex/KASlideShow",
            description:"Simple slideshow library for iOS "
        },{
            name:"KANibHelper",
            url:"http://github.com/kirualex/KANibHelper",
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
            url:"http://github.com/kirualex/ColourLove",
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
