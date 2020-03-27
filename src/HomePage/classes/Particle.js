
export default class Particle {
	constructor(context, contagious, x, y, radius, color, text, speed) {
		this.context = context;
		this.contagious = contagious;
		this.x = x;
		this.y = y;
		this.velocity = {
			x: Math.random() - .5,
			y: Math.random() - .5
		};
		this.speed = speed;
		this.directionX = this.randomInt(-1, 1) || 1;
		this.directionY = this.randomInt(-1, 1) || 1;
		this.radius = radius;
		this.color = color;
		this.text = text;
		
		this.dx = this.directionX * speed;
		this.dy = this.directionY * speed;

		this.hitCounter = 0;

		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight
		this.rotate = this.rotate.bind(this);
		this.randomInt = this.randomInt.bind(this);
		this.resolveCollision = this.resolveCollision.bind(this);
	}

	randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	draw() {
		this.context.beginPath();

		this.context.linewidth = 1;
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.context.fillStyle = this.color;
		this.context.fill();
		this.context.closePath();
	}
	
	update(particles, distance) {
		//this.text = this.hitCounter;
		// X BOUNDARIES
		if ((this.x + this.radius) > this.windowWidth) {
			this.dx = -this.dx;
			this.hitCounter++;
		}
		if ((this.x - this.radius) < 0) {
			this.dx = -this.dx;
			this.hitCounter++;
		}
		// Y BOUNDARIES
		if ((this.y + this.radius) > this.windowHeight) {
			this.dy = -this.dy;
			this.hitCounter++;
		}
		if ((this.y - this.radius) < 0) {
			this.dy = -this.dy;
			this.hitCounter++;
		}
		// CALCULATE COLLISION DETECTION TO ALL OTHER PARTICLES
		for (let i = 0; i < particles.length; i++) {
			if (this === particles[i]) {
				continue;
			}
			
			if ((distance(this.x, this.y, particles[i].x, particles[i].y) - (this.radius + particles[i].radius)) < 0) {
				const particle = particles[i];
				if (particle.contagious) {
					this.contagious = 1;
					this.color = "red";
				}
				this.resolveCollision(this, particle);
			}
		}

		this.draw(this.context);
		this.x += this.dx;
		this.y += this.dy;

	}

	rotate(particle, angle) {
		return {
			dx: particle.dx * Math.cos(angle) - particle.dy * Math.sin(angle),
			dy: particle.dx * Math.sin(angle) + particle.dy * Math.cos(angle)
		};
	}

	resolveCollision(particle, otherParticle) {
		const xVelocityDiff = particle.dx - otherParticle.dx;
		const yVelocityDiff = particle.dy - otherParticle.dy;
	
		const xDist = otherParticle.x - particle.x;
		const yDist = otherParticle.y - particle.y;
		//console.log("I bet this is wrong", xVelocityDiff * xDist + yVelocityDiff * yDist, ">=0");
		
 		// Prevent accidental overlap of particles
 		if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
			// Grab angle between the two colliding particles
			const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

			// Velocity before equation
			const u1 = this.rotate(particle, angle);
			const u2 = this.rotate(otherParticle, angle);

			particle.dx = u1.dx;
			particle.dy = u1.dy;
	
			otherParticle.dx = u2.dx;
			otherParticle.dy = u2.dy;
		}
	}
}