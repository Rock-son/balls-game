"use strict";

export const updateGame = (sprite, spriteArr, distance, loader) => {
	if (sprite.time && (new Date().getTime() - sprite.time) > 10000) {
		sprite.x = -500;
		sprite.y = -500;
		sprite.time = null;		
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
	// CALCULATE COLLISION DETECTION TO ALL OTHER IMAGES
	for (let i = 0; i < spriteArr.length; i++) {
		if (sprite.myID === spriteArr[i].myID || (spriteArr[i].velocity.x === 0 && spriteArr[i].velocity.y === 0)) {
			continue;
		}

		if ((distance(sprite.x, sprite.y, spriteArr[i].x, spriteArr[i].y) - (sprite.radius + spriteArr[i].radius)) < 0) {
			const otherSprite = spriteArr[i];
			// quarantine check
			if (!otherSprite.myID > sprite.reactContext.state.gameSettings.quantity && !sprite.myID > sprite.reactContext.state.gameSettings.quantity) {
				if (otherSprite.contagion && !sprite.contagion) {				
					sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious + 1, healthy: prevState.healthy - 1 }));
					sprite.contagion = 1;
					sprite.contagiousFrom = new Date().getTime();
					sprite.texture = loader.resources.sheet.textures["ball-red-15.png"];
					sprite.reactContext.state.simulationSettings["autorestart"] && sprite.reactContext.state.healthy === 0 && sprite.reactContext.gameRestart();	// ON AUTORESTART=TRUE
				} else if (sprite.contagion && !otherSprite.contagion) {
					sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious + 1, healthy: prevState.healthy - 1 }));
					otherSprite.contagion = 1;
					otherSprite.contagiousFrom = new Date().getTime();
					otherSprite.texture = loader.resources.sheet.textures["ball-red-15.png"];
					sprite.reactContext.state.simulationSettings["autorestart"] && sprite.reactContext.state.healthy === 0 && sprite.reactContext.gameRestart(); // ON AUTORESTART=TRUE
				}
			}
			resolveCollision(sprite, otherSprite);
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

function resolveCollision(particle, otherParticle) {
	const quantity = particle.reactContext.state.gameSettings.quantity;
	let xVelocityDiff, yVelocityDiff, xDist, yDist;

	if (particle.myID >= quantity) {
		xVelocityDiff = otherParticle.velocity.x;
		yVelocityDiff = otherParticle.velocity.y;
	
		xDist = otherParticle.x - particle.x;
		yDist = otherParticle.y - particle.y;
	} else if (otherParticle.myID >= quantity) {
		xVelocityDiff = particle.velocity.x;
		yVelocityDiff = particle.velocity.y;
	
		xDist = otherParticle.x - particle.x;
		yDist = otherParticle.y - particle.y;
	} else {
		xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
		yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
	
		xDist = otherParticle.x - particle.x;
		yDist = otherParticle.y - particle.y;
	}


	// Prevent accidental overlap of images
	if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
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

	}  else if (xVelocityDiff * xDist + yVelocityDiff * yDist < 0) {
		console.log("yo", otherParticle.myID, ":", xVelocityDiff, xDist, yVelocityDiff, yDist, xVelocityDiff * xDist + yVelocityDiff * yDist, );
					
		if (particle.myID >= quantity && (otherParticle.velocity.x !== 0 && otherParticle.velocity.y !== 0)) {
			otherParticle.velocity.x = 0;
			otherParticle.velocity.y = 0;
			particle.velocity.x = 0;
			particle.velocity.y = 0;	
		}
	}
}

function preserveSpeed(particle, vFinal) {
	// calculate hypothenuse of the new speed
	const newSpeed = Math.sqrt(Math.pow(vFinal.x, 2) + Math.pow(vFinal.y, 2));
	// and compare it to the old speed hypothenuse and shorten / prolong x & y with calculated ratio
	return {
		x: vFinal.x * particle.startSpeed / newSpeed,
		y: vFinal.y * particle.startSpeed / newSpeed
	}

}
