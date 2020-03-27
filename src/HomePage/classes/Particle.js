
export default class Particle {
	constructor(context, contagious, x, y, radius, color, speed, mass) {
		this.context = context;
		this.contagious = contagious;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.velocity = {
			x: (Math.random() - .5) * this.speed,
			y: (Math.random() - .5) * this.speed
		};
		this.radius = radius;
		this.color = color;
		this.mass = mass;
		
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
			this.velocity.x = -this.velocity.x;
			this.hitCounter++;
		}
		if ((this.x - this.radius) < 0) {
			this.velocity.x = -this.velocity.x;
			this.hitCounter++;
		}
		// Y BOUNDARIES
		if ((this.y + this.radius) > this.windowHeight) {
			this.velocity.y = -this.velocity.y;
			this.hitCounter++;
		}
		if ((this.y - this.radius) < 0) {
			this.velocity.y = -this.velocity.y;
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
				} else if (this.contagious) {
					particle.contagious = 1;
					particle.color = "red";
				}
				this.resolveCollision(this, particle);
			}
		}

		this.draw(this.context);
		this.x += this.velocity.x;
		this.y += this.velocity.y;

	}
	/**
	 * Rotates coordinate system for velocities
	 *
	 * Takes velocities and alters them as if the coordinate system they're on was rotated
	 *
	 * @param  Object | velocity | The velocity of an individual particle
	 * @param  Float  | angle    | The angle of collision between two objects in radians
	 * @return Object | The altered x and y velocities after the coordinate system has been rotated
	 */
	rotate(velocity, angle) {
		const rotatedVelocities = {
			x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
			y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
		};	
		return rotatedVelocities;
	}
	
	/**
	 * Swaps out two colliding particles' x and y velocities after running through
	 * an elastic collision reaction equation
	 *
	 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
	 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
	 * @return Null | Does not return a value
	 */
	
	resolveCollision(particle, otherParticle) {
		const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
		const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
	
		const xDist = otherParticle.x - particle.x;
		const yDist = otherParticle.y - particle.y;
	
		// Prevent accidental overlap of particles
		if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
	
			// Grab angle between the two colliding particles
			const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
	
			// Store mass in var for better readability in collision equation
			const m1 = particle.mass;
			const m2 = otherParticle.mass;
			
			// Velocity before equation
			const u1 = this.rotate(particle.velocity, angle);
			const u2 = this.rotate(otherParticle.velocity, angle);
	
			// Velocity after 1d collision equation
			const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
			const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
			
			// Final velocity after rotating axis back to original location
			const vFinal1 = this.rotate(v1, -angle);
			const vFinal2 = this.rotate(v2, -angle);
	
			// Swap particle velocities for realistic bounce effect
			particle.velocity.x = vFinal1.x;
			particle.velocity.y = vFinal1.y;
	
			otherParticle.velocity.x = vFinal2.x;
			otherParticle.velocity.y = vFinal2.y;
		}
	}
}