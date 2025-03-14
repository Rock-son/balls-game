export const updateSimulation = (sprite, spriteArr, circleIntersect, loader) => {
	// X BOUNDARIES
	if ((sprite.x + sprite.velocity.x + sprite.radius) > (window.innerWidth < sprite.reactContext.canvasWidth ? sprite.reactContext.canvasWidth : window.innerWidth )) {
		sprite.velocity.x = -sprite.velocity.x;
	}
	if ((sprite.x + sprite.velocity.x - sprite.radius) < 0) {
		sprite.velocity.x = -sprite.velocity.x;
	}
	// Y BOUNDARIES
	if ((sprite.y + sprite.velocity.y + sprite.radius) > (window.innerHeight < sprite.reactContext.canvasHeight ? sprite.reactContext.canvasHeight : window.innerHeight)) { // resize only up
		sprite.velocity.y = -sprite.velocity.y;
	}
	if ((sprite.y + sprite.velocity.y - sprite.radius) < 0) {
		sprite.velocity.y = -sprite.velocity.y;
	}

	// PROLONG DURATION OF INFECTED BALLS IF THERE WAS A PAUSE
	if (sprite.contagion === 1 && sprite.reactContext.state.pausedTime > 0) {
		sprite.contagiousFrom = sprite.contagiousFrom + sprite.reactContext.state.pausedTime;
	}
	// STOP THE PAUSED_TIME
	if (sprite.myID === sprite.reactContext.state.simulationSettings["quantity"] - 1) {
		sprite.reactContext.setState({ pausedTime: 0 });
	}

	// HEAL BALLS IF HEALAFTER TIME IS APPLIED AND DOESN'T STAY HEALED
	if (sprite.reactContext.state.simulationSettings["healedAfter"] > 0 && !sprite.reactContext.state.simulationSettings["staysHealed"]) {
		if (sprite.contagiousFrom && (new Date().getTime() - sprite.contagiousFrom) > sprite.reactContext.state.simulationSettings["healedAfter"]) {
			sprite.contagion = 0;
			sprite.contagiousFrom = null;
			sprite.texture = loader.resources.sheet.textures["ball-white.svg"];
			sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious - 1, healthy: prevState.healthy + 1 }));
		}
	}
	// HEAL BALLS IF HEALAFTER TIME IS APPLIED AND STAYS HEALED
	if (sprite.reactContext.state.simulationSettings["healedAfter"] > 0 && sprite.reactContext.state.simulationSettings["staysHealed"]) {
		if (sprite.contagiousFrom && (new Date().getTime() - sprite.contagiousFrom) > sprite.reactContext.state.simulationSettings["healedAfter"]) {
			sprite.contagion = 2;
			sprite.contagiousFrom = null;
			sprite.texture = loader.resources.sheet.textures["ball-grey.svg"];
			sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious - 1, healthy: prevState.healthy + 1, healed: prevState.healed + 1 }));
		}
	}
	// AUTORESTART
	if (sprite.reactContext.state.simulationSettings["autorestart"] && (sprite.reactContext.state.contagious === 0 || sprite.reactContext.state.healthy === 0)) {
		// only need to restart it once but stop calculating further!
		if (sprite.myID === 0) {
			sprite.reactContext.toggleSimulationPause();
			sprite.reactContext.simulationRestart();
			return;
		}
		return;
	} // END GAME (AUTORESTART === false)
	else if ((sprite.reactContext.state.contagious === 0 || sprite.reactContext.state.healthy === 0)) {
		// only need to STOP it once but stop calculating further!
		if (sprite.myID === 0) {
			sprite.reactContext.toggleSimulationPause();
			sprite.reactContext.toggleSimulationDialogAfterNoRestart();
			return;
		}
		return;
	}
	// CALCULATE COLLISION DETECTION TO ALL OTHER IMAGES
	for (let i = 0; i < spriteArr.length; i++) {
		if (sprite.myID === spriteArr[i].myID) {
			continue;
		}

		if (circleIntersect(sprite.x, sprite.y, sprite.radius, spriteArr[i].x, spriteArr[i].y, spriteArr[i].radius)) {		
			const otherSprite = spriteArr[i];
				// ACTIVATE TIME contagiousFrom - if not already healed
			if (sprite.contagion !== 2) {
				// red cannot infect another red again
				if ((otherSprite.contagion && !sprite.contagion) || (!otherSprite.contagion && sprite.contagion))
				{
					sprite.contagiousFrom = otherSprite.contagion ? new Date().getTime() : sprite.contagiousFrom;
					otherSprite.contagiousFrom = sprite.contagion ? new Date().getTime() : otherSprite.contagiousFrom;
				}
			}
			// only calculate crashes where one particle is contagious - exclude healed from the equation
			if (sprite.contagion === 0 && otherSprite.contagion === 1) {				
				sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious + 1, healthy: prevState.healthy - 1 }));
				sprite.contagion = 1;
				sprite.texture = loader.resources.sheet.textures["ball-red.svg"];
			} else if (sprite.contagion === 1 && otherSprite.contagion === 0) {
				sprite.reactContext.setState(prevState => ({ contagious: prevState.contagious + 1, healthy: prevState.healthy - 1 }));
				otherSprite.contagion = 1;
				otherSprite.texture = loader.resources.sheet.textures["ball-red.svg"];
			}
			resolveCollision(sprite, otherSprite);
		}
	}

	sprite.x += sprite.velocity.x;
	sprite.y += sprite.velocity.y;

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
	const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
	const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

	const xDist = otherParticle.x - particle.x;
	const yDist = otherParticle.y - particle.y;

	// Prevent accidental overlap of images
	if (xVelocityDiff * xDist + yVelocityDiff * yDist > 0) {

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
	}
}

function preserveSpeed(particle, vFinal) {
	const newSpeed = Math.sqrt(vFinal.x * vFinal.x + vFinal.y * vFinal.y);
	
	return { // RETURN SPEED RATIO
		x: vFinal.x * particle.startSpeed / newSpeed,
		y: vFinal.y * particle.startSpeed / newSpeed
	}

}
