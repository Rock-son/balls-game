import Particle from "../classes/Particle";
import { setDriftlessInterval, clearDriftless } from 'driftless';

export default function _draw() {	
	// UTILITIES
	function randomIntNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function distance(x1, y1, x2, y2) {
		const xDist = x2 - x1;
		const yDist = y2 - y1;
		return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	}


	// CANVAS
	const canvas = this.canvasRef.current;
	if (canvas.getContext) {
		let context = canvas.getContext("2d");
		const particles = [];
		let color, contagious;
		const radius = 5;
		const maxWidth = this.canvasWidth - radius * 2.5;
		const maxHeight = this.canvasHeight - radius * 2.5;
		for (let i = 0; i < 700; i++) {
			const mass = 1;
			color = i === 0 ? "darkred" : "#aaa";
			contagious = i === 0 ? 1 : 0;
			let x = randomIntNumber(radius * 2, maxWidth);
			let y = randomIntNumber(radius * 2, maxHeight);
			if (i !== 0) {
				for (let j = 0; j < particles.length; j++) {
					if ((distance(x, y, particles[j].x, particles[j].y) - (radius + particles[j].radius)) < 0) {
						x = randomIntNumber(radius * 2, maxWidth);
						y = randomIntNumber(radius * 2, maxHeight);
						// start over
						j = -1;
					}
				}
			}
			particles.push(new Particle(context, contagious, x, y, radius, color, this.state.speed, mass));			
		}

		// ANIMATION
		this.interval = setDriftlessInterval(
			() => {			
			if (!this.state.pause && !this.state.stop) {
				context.clearRect(0,0, window.innerWidth, window.innerHeight)			
				particles.forEach(particle => {
					particle.draw();
					particle.update(particles, distance);
				});
			} else if (this.state.pause && !this.state.stop) {
				return;
			} else {
				context.clearRect(0,0, window.innerWidth, window.innerHeight)
				context = null;				
				return clearDriftless(this.interval);
			}
		}, 16);
	}
}
