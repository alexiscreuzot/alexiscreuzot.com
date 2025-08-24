
$(document).ready(function() {

	// Enhanced Neutron Particle System - Built from scratch
	var NeutronParticleSystem = function(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.particles = [];
		this.isRunning = false;
		this.lastSpawnTime = 0;
		this.spawnInterval = 40; // Faster spawn rate for more particles
		this.time = 0;
		
		// Enhanced Configuration for vapor chamber behavior
		this.maxParticles = 60; // More particles
		this.particleLifetime = {min: 8000, max: 15000}; // Longer lifetime for better trails
		this.trailLength = 200; // Longer trails for more visibility
		this.friction = 0.998; // Very light friction for more chaotic movement
		this.chaosIntensity = 0.05; // Random force intensity
		
		this.init();
	};
	
	NeutronParticleSystem.prototype.init = function() {
		this.resize();
		
		// Handle window resize
		var self = this;
		window.addEventListener('resize', function() {
			self.resize();
		});
	};
	
	NeutronParticleSystem.prototype.resize = function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		
		// Enable anti-aliasing and smooth rendering
		this.ctx.imageSmoothingEnabled = true;
		this.ctx.imageSmoothingQuality = 'high';
		
		// Additional canvas smoothing properties for better anti-aliasing
		if (this.ctx.webkitImageSmoothingEnabled !== undefined) {
			this.ctx.webkitImageSmoothingEnabled = true;
		}
		if (this.ctx.mozImageSmoothingEnabled !== undefined) {
			this.ctx.mozImageSmoothingEnabled = true;
		}
		if (this.ctx.msImageSmoothingEnabled !== undefined) {
			this.ctx.msImageSmoothingEnabled = true;
		}
		
		// Enable sub-pixel rendering for smoother lines
		this.ctx.translate(0.5, 0.5);
	};
	
	NeutronParticleSystem.prototype.spawnParticle = function() {
		if (this.particles.length >= this.maxParticles) return;
		
		// Random spawn locations with edge bias for vapor chamber effect
		var spawnX = Math.random() * this.canvas.width;
		var spawnY = Math.random() * this.canvas.height;
		
		// More chaotic initial velocities for vapor chamber behavior
		var angle = Math.random() * Math.PI * 2;
		var speed = Math.random() * 10 + 4; // Faster speed between 4-14
		
		var particle = {
			x: spawnX,
			y: spawnY,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			ax: 0, // Acceleration
			ay: 0,
			life: 0,
			maxLife: Math.random() * (this.particleLifetime.max - this.particleLifetime.min) + this.particleLifetime.min,
			trail: [],
			size: Math.random() * 1 + 0.8, // Smaller particles: 0.8-1.8
			baseSize: Math.random() * 1 + 0.8,
			color: this.getRandomColor(),
			originalColor: this.getRandomColor(),
			mass: Math.random() * 0.5 + 0.5, // Mass for physics
			energy: Math.random() * 0.5 + 0.5, // Energy level affects behavior
			phase: Math.random() * Math.PI * 2, // For chaotic movements
			glowIntensity: Math.random() * 0.5 + 0.5,
			chaosTimer: 0, // Timer for random direction changes
			lastChaosChange: 0
		};
		
		// Set color variation based on energy for visual variety
		if (particle.energy > 0.7) {
			particle.color = particle.originalColor = 'rgba(252, 90, 149, 0.8)'; // High energy - pink
		} else if (particle.energy > 0.4) {
			particle.color = particle.originalColor = 'rgba(120, 218, 252, 0.8)'; // Medium energy - blue
		} else {
			particle.color = particle.originalColor = 'rgba(185, 84, 235, 0.8)'; // Low energy - purple
		}
		
		this.particles.push(particle);
	};
	
	NeutronParticleSystem.prototype.getRandomColor = function() {
		var colors = [
			'rgba(252, 90, 149, 0.8)',   // Pink from gradient ($FC5A95)
			'rgba(185, 84, 235, 0.8)',   // Purple from gradient ($B954EB)
			'rgba(120, 218, 252, 0.8)',  // Blue from gradient ($78DAFC)
			'rgba(88, 186, 252, 0.8)',   // Highlight blue ($58BAFC)
			'rgba(243, 243, 254, 0.6)',  // Base font color ($F3F3FE)
			'rgba(255, 255, 255, 0.7)'   // White
		];
		return colors[Math.floor(Math.random() * colors.length)];
	};
	
	NeutronParticleSystem.prototype.updateParticle = function(particle, deltaTime) {
		var dt = deltaTime / 16.67; // Normalize to 60fps
		this.time += dt * 0.01;
		
		// Reset acceleration
		particle.ax = 0;
		particle.ay = 0;
		
		// Vapor chamber behavior - random chaotic forces
		particle.chaosTimer += dt;
		
		// Frequent random direction changes for chaotic vapor-like movement
		if (particle.chaosTimer - particle.lastChaosChange > 20 + Math.random() * 40) {
			// Apply random impulse forces
			var randomAngle = Math.random() * Math.PI * 2;
			var randomForce = this.chaosIntensity * (0.5 + Math.random() * 1.5);
			
			particle.ax += Math.cos(randomAngle) * randomForce;
			particle.ay += Math.sin(randomAngle) * randomForce;
			
			particle.lastChaosChange = particle.chaosTimer;
		}
		
		// Continuous small random perturbations (Brownian motion-like)
		particle.ax += (Math.random() - 0.5) * this.chaosIntensity * 0.3;
		particle.ay += (Math.random() - 0.5) * this.chaosIntensity * 0.3;
		
		// Add wave-like motion for more interesting trajectories
		particle.phase += dt * 0.02;
		particle.ax += Math.sin(particle.phase * particle.energy) * this.chaosIntensity * 0.5;
		particle.ay += Math.cos(particle.phase * particle.energy * 0.7) * this.chaosIntensity * 0.5;
		
		// Update velocity with acceleration
		particle.vx += particle.ax * dt;
		particle.vy += particle.ay * dt;
		
		// Apply very light friction to maintain movement
		particle.vx *= this.friction;
		particle.vy *= this.friction;
		
		// Ensure minimum velocity for continuous chaotic movement
		var vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
		if (vel < 1.0) { // Higher minimum velocity
			var randomAngle = Math.random() * Math.PI * 2;
			particle.vx += Math.cos(randomAngle) * 1.0;
			particle.vy += Math.sin(randomAngle) * 1.0;
		}
		
		// Limit maximum velocity for visual stability
		var maxVel = 12; // Higher maximum velocity
		if (vel > maxVel) {
			particle.vx = (particle.vx / vel) * maxVel;
			particle.vy = (particle.vy / vel) * maxVel;
		}
		
		// Update position
		particle.x += particle.vx * dt;
		particle.y += particle.vy * dt;
		
		// Vapor chamber edge behavior - particles bounce chaotically
		var damping = 0.6 + Math.random() * 0.3; // Random energy loss on bounce
		var margin = particle.size;
		
		if (particle.x < margin) {
			particle.x = margin;
			particle.vx = Math.abs(particle.vx) * damping;
			// Add random chaos on bounce
			particle.vy += (Math.random() - 0.5) * 2;
		} else if (particle.x > this.canvas.width - margin) {
			particle.x = this.canvas.width - margin;
			particle.vx = -Math.abs(particle.vx) * damping;
			particle.vy += (Math.random() - 0.5) * 2;
		}
		
		if (particle.y < margin) {
			particle.y = margin;
			particle.vy = Math.abs(particle.vy) * damping;
			particle.vx += (Math.random() - 0.5) * 2;
		} else if (particle.y > this.canvas.height - margin) {
			particle.y = this.canvas.height - margin;
			particle.vy = -Math.abs(particle.vy) * damping;
			particle.vx += (Math.random() - 0.5) * 2;
		}
		
		// Update particle size with subtle breathing effect
		particle.size = particle.baseSize + Math.sin(this.time + particle.phase) * 0.3;
		
		// Add to trail with consistent data
		particle.trail.push({
			x: particle.x, 
			y: particle.y, 
			timestamp: Date.now(),
			velocity: Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy),
			life: particle.life // Add life for consistent fading
		});
		
		// Maintain trail length
		if (particle.trail.length > this.trailLength) {
			particle.trail.shift();
		}
		
		// Update life
		particle.life += deltaTime;
	};
	
	NeutronParticleSystem.prototype.drawParticle = function(particle) {
		var currentTime = Date.now();
		var lifeProgress = particle.life / particle.maxLife;
		
		// Draw enhanced trail with velocity-based width - Fixed flickering
		if (particle.trail.length > 2) {
			this.ctx.beginPath();
			
			for (var i = particle.trail.length - 1; i > 0; i--) {
				var current = particle.trail[i];
				var previous = particle.trail[i - 1];
				
				// Calculate trail position from head (1.0) to tail (0.0)
				var trailPosition = i / (particle.trail.length - 1);
				
				// Smooth, consistent opacity calculation
				var baseAlpha = trailPosition * (1 - lifeProgress * 0.3);
				var alpha = Math.max(0, Math.min(1, baseAlpha * 0.9)); // Clamped and consistent
				
				if (alpha > 0.02) {
					// Consistent trail width calculation
					var baseWidth = (current.velocity / 12) * particle.size * 0.8;
					var width = baseWidth * trailPosition;
					
					// Draw individual trail segment
					this.ctx.beginPath();
					this.ctx.moveTo(previous.x, previous.y);
					this.ctx.lineTo(current.x, current.y);
					
					var trailColor = particle.originalColor.replace(/[\d.]+\)$/, alpha + ')');
					this.ctx.strokeStyle = trailColor;
					this.ctx.lineWidth = Math.max(0.4, width);
					this.ctx.lineCap = 'round';
					this.ctx.lineJoin = 'round';
					this.ctx.stroke();
				}
			}
		}
		
		// Draw particle glow effect - Enhanced for more visibility
		var glowSize = particle.size * (2.0 + particle.glowIntensity); // Larger glow for more visibility
		var glowAlpha = (1 - lifeProgress) * 0.5 * particle.glowIntensity; // Higher glow alpha
		
		if (glowAlpha > 0.03) { // Lower threshold for more visible glow
			var glowGradient = this.ctx.createRadialGradient(
				particle.x, particle.y, 0,
				particle.x, particle.y, glowSize
			);
			var glowColor = particle.color.replace(/[\d.]+\)$/, glowAlpha + ')');
			glowGradient.addColorStop(0, glowColor);
			glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
			
			this.ctx.beginPath();
			this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
			this.ctx.fillStyle = glowGradient;
			this.ctx.fill();
		}
		
		// Draw main particle with enhanced appearance and anti-aliasing
		this.ctx.beginPath();
		this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
		
		// Create radial gradient for depth
		var particleGradient = this.ctx.createRadialGradient(
			particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, 0,
			particle.x, particle.y, particle.size
		);
		
		var centerColor = particle.color.replace(/[\d.]+\)$/, '1.0)');
		var edgeColor = particle.color.replace(/[\d.]+\)$/, '0.7)');
		particleGradient.addColorStop(0, centerColor);
		particleGradient.addColorStop(1, edgeColor);
		
		this.ctx.fillStyle = particleGradient;
		this.ctx.fill();
		
		// Add subtle particle border for definition with anti-aliasing
		this.ctx.beginPath();
		this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
		this.ctx.strokeStyle = particle.color.replace(/[\d.]+\)$/, '0.8)');
		this.ctx.lineWidth = 0.3; // Thinner border for smaller particles
		this.ctx.stroke();
	};
	
	NeutronParticleSystem.prototype.update = function(deltaTime) {
		// Adaptive spawning based on current particle count
		var spawnRate = this.spawnInterval * (1 + (this.particles.length / this.maxParticles));
		
		if (Date.now() - this.lastSpawnTime > spawnRate) {
			this.spawnParticle();
			this.lastSpawnTime = Date.now();
		}
		
		// Update particles with improved lifecycle management
		for (var i = this.particles.length - 1; i >= 0; i--) {
			var particle = this.particles[i];
			this.updateParticle(particle, deltaTime);
			
			// Remove particles that have exceeded their lifetime
			if (particle.life >= particle.maxLife) {
				this.particles.splice(i, 1);
			}
		}
	};
	
	NeutronParticleSystem.prototype.draw = function() {
		// Clear canvas with transparent background
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		// Enable high-quality anti-aliasing
		this.ctx.imageSmoothingEnabled = true;
		this.ctx.imageSmoothingQuality = 'high';
		
		// Use consistent blending for all particles to prevent flickering
		this.ctx.globalCompositeOperation = 'source-over';
		
		// Draw all particles in a consistent order
		for (var i = 0; i < this.particles.length; i++) {
			this.drawParticle(this.particles[i]);
		}
	};
	
	NeutronParticleSystem.prototype.animate = function() {
		if (this.isRunning) return;
		
		this.isRunning = true;
		var lastTime = Date.now();
		
		var animate = function() {
			if (!this.isRunning) return;
			
			var currentTime = Date.now();
			var deltaTime = currentTime - lastTime;
			lastTime = currentTime;
			
			this.update(deltaTime);
			this.draw();
			
			requestAnimationFrame(animate.bind(this));
		}.bind(this);
		
		animate();
	};
	
	NeutronParticleSystem.prototype.pause = function() {
		this.isRunning = false;
	};
	
	NeutronParticleSystem.prototype.resume = function() {
		if (!this.isRunning) {
			this.animate();
		}
	};
	
	NeutronParticleSystem.prototype.restart = function() {
		this.particles = [];
		this.lastSpawnTime = 0;
		this.time = 0;
		
		// Spawn more particles immediately for restart effect
		for (var i = 0; i < 12; i++) { // More particles on restart
			setTimeout(function() {
				neutronSystem.spawnParticle();
			}, i * 30); // Faster spawning
		}
	};
	
	// Initialize the particle system
	var neutronSystem = new NeutronParticleSystem('sky');
	neutronSystem.animate();
	
	// Event handlers with enhanced interactivity
	$( "a.button" ).hover(
		function() {
			neutronSystem.pause();
		}, function() {
			neutronSystem.resume();
		}
	);
	
	// Enhanced title click with restart effect
	$('header .title a').click(function(event){
		neutronSystem.restart();
	});

	$("header .title a").hover(function() {
		$(this).toggleClass("hover");
	});

	$("project .abstract").click(function() {
		$(this).toggleClass("show");
		$(this).children().children(".more-icon").toggleClass("open");

		if( $(this).hasClass("show") ){
			var textDelta = -parseInt($(this).css('font-size')) + 16;
			$('html, body').animate({
				scrollTop: ($(this).offset().top - $(this).outerHeight(false) - textDelta)
			}, 300);
		}

		var moreDiv  = $(this).next();
		moreDiv.toggleClass("show");
		moreDiv.css("background-image", "url("+moreDiv.attr('data-src')+")")
		.waitForImages(function(){},function(loaded, count, success) {
			if(success){
				moreDiv.children(".back-overlay").css("background-color", "rgba(0,0,0,.5)");
			}
		}, $.noop, true);

		var img = moreDiv.children().children().children().children('.screenshot img');
		img.attr("src", img.attr('data-src'))
		.waitForImages(function(){},function(loaded, count, success) {
			if(success){
				img.parent().css("opacity", "1");
			}
		}, $.noop, true);

	});

	$('header a').click(function(event){
		$('html, body').animate({
			scrollTop: $( $.attr(this, 'href') ).offset().top
		}, 300);
		$(this).blur(); 
		event.preventDefault();
	});

	String.prototype.reverse = function () {
		return this.split("").reverse().join("");
	};

	$('a.e-mail').click(function(event){
		var user = $(this).attr("data-user").split("").reverse().join("");
		var domain = $(this).attr("data-website").split("").reverse().join("");
		window.location.href = "mailto:"+user+"@"+domain;
		event.preventDefault();
	});

    // Vals
    var diviserX = 140;
    var diviserY = 140;
    var rotateMultiplier = 1;

    $("project .more").mousemove(function(e){
    	var y = -25 - (e.pageX - $(this).width()/2) / diviserX;
    	var x = 3 +(e.pageY - $(this).offset().top - $(this).height()/2) / diviserY;
    	
    	var img = $(this).children().children().children().children('.screenshot .content');

    	img.css({"-ms-transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)",
    		"-webkit-transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)",
    		"transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)"});
    	
    });

    $("project .more").mouseout(function(e){
    	var img = $(this).children().children().children().children('.screenshot .content');
    	img.css({"-ms-transform": "perspective( 600px ) rotateY( -20deg ) rotateX( 5deg )",
    		"-webkit-transform": "perspective( 600px ) rotateY( -20deg ) rotateX( 5deg )",
    		"transform": "perspective( 600px ) rotateY( -20deg ) rotateX( 5deg )"});
    	
    });

});

