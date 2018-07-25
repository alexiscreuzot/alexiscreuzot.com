
function cbMilyWay(options) {

    this.init = function () {

        this.freezed = false;
        this.speedOffset = 0;

        this.canvas = document.getElementById(options.id);
        if (!this.canvas) {
            return false;
        }
        this.ctx = this.canvas.getContext('2d');

        this.stars = [];
        var ratio = window.devicePixelRatio || 1;
        var width = window.innerWidth * ratio;
        var height = window.innerHeight * ratio;

        this. canvas.width = width;
        this.canvas.height = height;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;

        this.audio = options.soundId ? document.getElementById(options.soundId) : null;
        this.populateSky();
    };
    /* Helpers */
    this.random = function (min, max, precision) {
        return parseFloat(Math.min(min + (Math.random() * (max - min)), max).toFixed(precision || 4));
    };

    this.randomInt = function (min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    };

    this.randomDistribution = function () {
        return arguments[Math.floor(Math.random() * arguments.length)];
    };

    this.toRad = function (deg) {
        return deg * (Math.PI / 180);
    };

    /* Register canvas handlers */
    this.registerHandler = function (container) {
        var self = this;

        container = container ? document.querySelector(container) : this;
        container.addEventListener('mousemove', function (e) {

            var fromCenterX = Math.abs(self.centerX - e.clientX);
            var fromCenterY = Math.abs(self.centerY - e.clientY);
            var fromCenter = Math.max(fromCenterX, fromCenterY);
            var toCenterX = Math.abs(self.centerX - fromCenterX);
            var toCenterY = Math.abs(self.centerY - fromCenterY);
            var toCenter = Math.min(toCenterX, toCenterY);
            if (fromCenter < 150) {
                self.freezed = true;
                self.speedOffset = Math.min(0.2, toCenter / 13000);
            } else {
                self.freezed = false;
                self.speedOffset = Math.min(0.2, toCenter / 5000);
            }

        });
    };
    this.populateSky = function () {
        var maxRadius = Math.round(Math.sqrt(Math.pow(this.centerY, 2) + Math.pow(this.centerX, 2)));
        var num = Math.floor(this.canvas.width * options.popularity);

        var colors = [ 
            [252, 90, 14],
            [185, 84, 235],
            [120, 218, 252],
            [255, 255, 255]]

        this.stars = [];
        for (var i = 0; i < num; i++) {
            var star = {};

            var ind = this.randomInt(0, 2);
            star.color = colors[ind];

            star.angle = Math.ceil(Math.random() * 360);
            star.opacity = this.random(0.2, 0.7);
            star.width = this.randomDistribution(3, 2, 2, 2, 2, 1) + 5;
            star.length = star.width / 20; 
            star.trailLength = 10;
            star.radius = this.randomDistribution(
                this.randomInt(0, maxRadius),
                this.randomInt(25, maxRadius),
                this.randomInt(45, maxRadius),
                this.randomInt(50, maxRadius)
                );
            star.speed = Math.abs((30 / star.radius + Math.random()) / 10);
            this.stars.push(star);
        }
    };

    this.clearCtx = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.drawStars = function () {

        this.clearCtx();

        for (var i = 0; i < this.stars.length; i++) {

            var star = this.stars[i];

            star.angleRad = this.toRad(star.angle);
            star.angleRadEnd = star.angleRad + star.length;
            star.angleRadStart = star.angleRadStart ? star.angleRadStart : star.angleRad;
            if (this.freezed) {
                if (star.trailLength > options.maxTrailLength) {
                    star.angleRadStart = star.angleRadEnd - star.trailLength;
                }
            } else {
                star.angleRadStart = Math.min(star.angleRadStart + (options.freezedRollupSpeed + (star.trailLength / 30)), star.angleRad);
            }  
            star.trailLength = (star.angleRadEnd - star.angleRadStart);
 
            var opacityOffset = -Math.min(star.trailLength, 0.15);
            var ratio = window.devicePixelRatio || 1;

            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(' + star.color[0] + ',' + star.color[1] + ',' + star.color[2] + ',' + Math.max(star.opacity + opacityOffset, 0.1) + ')';
            this.ctx.lineWidth = 12 * ratio;
            this.ctx.lineCap = "round";
            this.ctx.arc(this.centerX, this.centerY, star.radius*ratio, star.angleRadEnd, star.angleRadEnd + 0.001, false);
            this.ctx.stroke(); 
            this.ctx.closePath();  
            this.ctx.beginPath();
            this.ctx.lineWidth = 2 * ratio;
            this.ctx.arc(this.centerX, this.centerY, star.radius*ratio, star.angleRadStart, star.angleRadEnd, false);
            this.ctx.stroke(); 
            this.ctx.closePath(); 

            star.angle += Math.max(star.speed + this.speedOffset, options.speedMin);
            if (star.angle == 360) {
                star.angle = 0;
            }
        }
    };

    this.paused = false;
    this.animated = false;

    this.animateSky = function () {

        var self = this;

        var fps = 60;
        var now; 
        var then = Date.now();
        var interval = 1000 / fps;
        var delta;

        function draw() {

            requestAnimationFrame(draw);

            now = Date.now();
            delta = now - then;

            if (delta > interval) {

                then = now - (delta % interval);

                if (!self.paused) {
                    self.drawStars();
                }
            }
        }

        draw();

    };

    this.playAnimate = function () {
        this.paused = false;
        this.speedOffset = 0;
        this.freezed = false;

        if (!this.animated) {
            this.animateSky();
            this.animated = true;
        }

        $(this.canvas).animate({opacity: 1});
    };

    this.pauseAnimate = function () {
        this.paused = true;
        if (this.freezed) {
            $(this.canvas).animate({opacity: 0.2});
        } else {
            $(this.canvas).animate({opacity: 0.5});
        }
    };

    var self = this;

    window.onresize = function () {
        self.init();
    };

    this.init();
}