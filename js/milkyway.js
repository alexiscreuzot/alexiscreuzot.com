
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
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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

    /* Audio */
    this.playAudio = function (force) {
        var audio = this.audio;

        if (force) {
            this.audioStopped = false;
        }

        if (audio && !this.audioStopped) {
            this.audio.play();
            $(audio).stop().animate({volume: 0.3});
        }
    };

    this.pauseAudio = function (force) {
        var audio = this.audio;

        if (force) {
            this.audioStopped = true;
        }

        if (audio) {
            $(audio).stop().animate({volume: 0}, function () {
                audio.pause();
            });
        }
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

        this.stars = [];
        for (var i = 0; i < num; i++) {
            var star = {};
            star.color = [255, 255, 255];
            star.angle = Math.ceil(Math.random() * 360);
            star.opacity = this.random(0.15, 0.85);
            star.width = this.randomDistribution(3, 2, 2, 2, 2, 1);
            star.length = star.width / 2000;
            star.trailLength = 0;
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

            var opacityOffset = -Math.min(star.trailLength, 0.6);

            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(' + star.color[0] + ',' + star.color[1] + ',' + star.color[2] + ',' + Math.max(star.opacity + opacityOffset, 0.1) + ')';
            this.ctx.lineCap = "round";
            this.ctx.lineWidth = star.width;
            this.ctx.arc(this.centerX, this.centerY, star.radius, star.angleRadStart, star.angleRadEnd, false);
            this.ctx.stroke();

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

        var fps = 351;
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
        this.playAudio();
    };

    this.pauseAnimate = function () {
        this.paused = true;
        if (this.freezed) {
            $(this.canvas).animate({opacity: 0.2});
        } else {
            $(this.canvas).animate({opacity: 0.5});
        }
        this.pauseAudio();
    };

    var self = this;

    window.onresize = function () {
        self.init();
    };

    this.init();
}