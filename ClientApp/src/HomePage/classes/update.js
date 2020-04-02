export const update = (img, images, distance, loader, canvasWidth, canvasHeight) => {
	// X BOUNDARIES
	if ((img.x + img.radius) > (window.innerWidth < canvasWidth ? canvasWidth : window.innerWidth )) {
		img.velocity.x = -img.velocity.x;
	}
	if ((img.x - img.radius) < 0) {
		img.velocity.x = -img.velocity.x;
	}
	// Y BOUNDARIES
	if ((img.y + img.radius) > (window.innerHeight < canvasHeight ? canvasHeight : window.innerHeight)) {
		img.velocity.y = -img.velocity.y;
	}
	if ((img.y - img.radius) < 0) {
		img.velocity.y = -img.velocity.y;
	}
	// CALCULATE COLLISION DETECTION TO ALL OTHER IMAGES
	for (let i = 0; i < images.length; i++) {
		if (img.myID === images[i].myID) {
			i === 0 && console.log("OK");			
			continue;
		}

		if ((distance(img.x, img.y, images[i].x, images[i].y) - (img.radius + images[i].radius)) < 0) {			
			const image = images[i];
			if (image.contagion) {
				img.contagion = 1;
				img.texture = loader.resources["ball-red.png"].texture;
			} else if (img.contagion) {
				image.contagion = 1;
				image.texture = loader.resources["ball-white.png"].texture;
			}
			resolveCollision(img, image);
		}
	}

	img.x += img.velocity.x;
	img.y += img.velocity.y;

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
 * Swaps out two colliding images' x and y velocities after running through
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

		// Swap particle velocities for realistic bounce effect
		particle.velocity.x = vFinal1.x;
		particle.velocity.y = vFinal1.y;

		otherParticle.velocity.x = vFinal2.x;
		otherParticle.velocity.y = vFinal2.y;
	}
}
