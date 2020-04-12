export const updateGame = (sprite, spriteArr, circleIntersect, loader, startTime) => {

	if (new Date().getTime() - startTime < 3000) {
		return;
	}

	if (sprite.time && (new Date().getTime() - sprite.time) > 20000) {
		sprite.x = -500;
		sprite.y = -500;
		sprite.time = null;
	}
	// DRAG QUARANTINE AROUND - when quarantineDropped === false
	if (sprite.time && !sprite.reactContext.state.quarantineDropped && sprite.myID === sprite.reactContext.state.draggedQuarantine.id) {		
		sprite.x = sprite.reactContext.state.draggedQuarantine.x;
		sprite.y = sprite.reactContext.state.draggedQuarantine.y;		
	}
	
	// X BOUNDARIES
	if ((sprite.x + sprite.radius) > (window.innerWidth < sprite.reactContext.canvasWidth ? sprite.reactContext.canvasWidth : window.innerWidth )) {
		sprite.velocity.x = -sprite.velocity.x;
	}
	if ((sprite.x - sprite.radius) < 0) {
		sprite.velocity.x = -sprite.velocity.x;
	}
	// Y BOUNDARIES
	if ((sprite.y + sprite.radius) > (window.innerHeight < sprite.reactContext.canvasHeight ? sprite.reactContext.canvasHeight : window.innerHeight)) { // resize only up
		sprite.velocity.y = -sprite.velocity.y;
	}
	if ((sprite.y - sprite.radius) < 0) {
		sprite.velocity.y = -sprite.velocity.y;
	}
	/* CALCULATE DEACTIVATION TIME IF APPLIED - MAYBE WILL BE USED FOR PREVOIUS INFECTED - VIOLET
	if (sprite.reactContext.state.simulationSettings["deactivateAfter"] > 0) {
		if (sprite.contagiousFrom && (sprite.reactContext.state.currentTime - sprite.contagiousFrom > sprite.reactContext.state.simulationSettings["deactivateAfter"])) {
			sprite.contagion = 0;
			sprite.contagiousFrom = 0;
			sprite.texture = loader.resources.sheet.textures["ball-white-15.png"];
			sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious - 1, healthy: prevState.healthy + 1 }));
		}
	}*/
	// CALCULATE COLLISION DETECTION WITH QUARANTINE ONLY WHEN DROPPED - when draggedID changes this eval will be false!
	if (sprite.myID === sprite.reactContext.state.draggedQuarantine.id && !sprite.reactContext.state.quarantineDropped) {
		return;
	}
	// CALCULATE COLLISION DETECTION TO ALL OTHER IMAGES
	for (let i = 0; i < spriteArr.length; i++) {
		// don't calculate collisions for same or quarantined objects
		if (sprite.myID === spriteArr[i].myID || (spriteArr[i].velocity.x === 0 && spriteArr[i].velocity.y === 0)) {
			continue;
		}
		// check if distance minus radia is less then 0 --> crash
		if (circleIntersect(sprite.x, sprite.y, sprite.radius, spriteArr[i].x, spriteArr[i].y, spriteArr[i].radius)) {
			const otherSprite = spriteArr[i]
			// don't calculate contagion for quarantine particles (which have id > particle quantity)
			if (otherSprite.myID < sprite.reactContext.state.gameSettings.quantity && sprite.myID < sprite.reactContext.state.gameSettings.quantity) {	
				// only calculating contagion transmission (one contagious, one healthy)
				if (otherSprite.contagion && !sprite.contagion) {		
					const d = Math.random();
					if (sprite.reactContext.state.gameSettings["difficulty"] === 2) {
						// 100% chance of being here - hard difficulty
						getContagion(sprite, loader);
					} else if (d < 0.5 && sprite.reactContext.state.gameSettings["difficulty"] === 1) {
						// 50% chance of being here - medium
						getContagion(sprite, loader);
					} else if (d < 0.67) {
						// 17% chance of being here
					} else {
						// 33% chance of being here - easy
						getContagion(sprite, loader);
					}
					
				} else if (sprite.contagion && !otherSprite.contagion) {
					const d = Math.random();
					if (sprite.reactContext.state.gameSettings["difficulty"] === 2) {
						// 100% chance of being here - hard difficulty
						getContagion(otherSprite, loader);
					} else if (d < 0.5 && sprite.reactContext.state.gameSettings["difficulty"] === 1) {
						// 50% chance of being here - medium
						getContagion(otherSprite, loader);
					} else if (d < 0.67) {
						// 17% chance of being here
					} else {
						// 33% chance of being here - easy
						getContagion(otherSprite, loader);
					}
				}
			}
			resolveCollision(sprite, otherSprite, circleIntersect);
		}
	}
	if (sprite.velocity.x === 0 && sprite.velocity.y === 0) {
		sprite.x = sprite.x;
		sprite.y = sprite.y;
	} else {
		sprite.x += sprite.velocity.x;
		sprite.y += sprite.velocity.y;
	}

}

function getContagion(sprite, loader) {
	sprite.contagion = 1;
	sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious + 1, healthy: prevState.healthy - 1 }));
	sprite.contagiousFrom = new Date().getTime();
	sprite.texture = loader.resources.sheet.textures["ball-red-15.png"];
	sprite.reactContext.state.simulationSettings["autorestart"] && sprite.reactContext.state.healthy === 0 && sprite.reactContext.gameRestart();	// ON AUTORESTART=TRUE
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
function rotate(velocity, angle) {
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

function resolveCollision(particle, otherParticle, circleIntersect) {
	const quantity = particle.reactContext.state.gameSettings.quantity;
	let xVelocityDiff, yVelocityDiff, xDist, yDist;

	xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
	yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

	xDist = otherParticle.x - particle.x;
	yDist = otherParticle.y - particle.y;



	// Prevent accidental overlap of images - calculate only when objects are moving towards each other
	if (xVelocityDiff * xDist + yVelocityDiff * yDist > 0 && particle.myID < quantity && otherParticle.myID < quantity) {
		// Grab angle between the two colliding images
		const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

		// Store mass in var for better readability in collision equation
		// const m1 = particle.mass;
		// const m2 = otherParticle.mass;

		// Velocity before equation
		const u1 = rotate(particle.velocity, angle);
		const u2 = rotate(otherParticle.velocity, angle);

		// Velocity after 1d collision equation
		// (mass) const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
		// (mass) const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
		const v1 = { x: u2.x, y: u1.y };
		const v2 = { x: u1.x, y: u2.y };

		// Final velocity after rotating axis back to original location
		const vFinal1 = rotate(v1, -angle);
		const vFinal2 = rotate(v2, -angle);

		// PRESERVE SPEED - calculate startSpeed and newSpeed ratio and apply it to particle x and y velocities
		const particlePreservedSpeed = preserveSpeed(particle, vFinal1);
		const otherParticlePreservedSpeed = preserveSpeed(otherParticle, vFinal2);

		// Swap particle velocities for realistic bounce effect
		particle.velocity.x = particlePreservedSpeed.x;
		particle.velocity.y = particlePreservedSpeed.y;

		otherParticle.velocity.x = otherParticlePreservedSpeed.x;
		otherParticle.velocity.y = otherParticlePreservedSpeed.y;
	}	// QUARANTENE
	else if (particle.myID >= quantity){
		const particleDistance = distance(particle.x, particle.y, otherParticle.x, otherParticle.y) - particle.radius + otherParticle.radius;
		// make a border > -2 for outside particles
		if (particleDistance > -2) {
			otherParticle.velocity.x = -otherParticle.velocity.x;
			otherParticle.velocity.y = -otherParticle.velocity.y;
			particle.velocity.x = 0;
			particle.velocity.y = 0;
		}
		// border < -2 for inside particles (so inside / outside don+t touch!)
		if (particleDistance > -5 && particleDistance < -2) {
			otherParticle.velocity.x = -otherParticle.velocity.x;
			otherParticle.velocity.y = -otherParticle.velocity.y;
			particle.velocity.x = 0;
			particle.velocity.y = 0;
		}
	} 
}

function preserveSpeed(particle, vFinal) {
	// calculate hypothenuse of the new speed
	const newSpeed = Math.sqrt(vFinal.x * vFinal.x + vFinal.y * vFinal.y);
	// and compare it to the old speed hypothenuse and shorten / prolong x & y with calculated ratio
	return {
		x: vFinal.x * particle.startSpeed / newSpeed,
		y: vFinal.y * particle.startSpeed / newSpeed
	}
}
function distance(x1, y1, x2, y2) {
	const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(xDist * xDist + yDist * yDist);
}
function quarantineCollision(particle, otherParticle) {
	const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x -particle.x);
		
	// Store mass in var for better readability in collision equation
	// const m1 = particle.mass;
	// const m2 = otherParticle.mass;

	// Velocity before equation
	const u2 = rotate(otherParticle.velocity, angle);

	// Velocity after 1d collision equation
	const v2 = { x: 0, y: u2.y };

	// Final velocity after rotating axis back to original location
	const vFinal2 = rotate(v2, -angle);

	// PRESERVE SPEED - calculate startSpeed and newSpeed ratio and apply it to particle x and y velocities
	const otherParticlePreservedSpeed = preserveSpeed(otherParticle, vFinal2);

	// 
	otherParticle.velocity.x = -otherParticlePreservedSpeed.x;
	otherParticle.velocity.y = -otherParticlePreservedSpeed.y;
}