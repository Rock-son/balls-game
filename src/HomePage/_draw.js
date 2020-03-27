
import Particle from "./classes/Circle";

export default function _draw() {	

	// utility functions
	function randomIntNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	function distance(x1, y1, x2, y2) {
		const xDist = x2 - x1;
		const yDist = y2 - y1;

		return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	}



	const canvas = this.canvasRef.current;
	if (canvas.getContext) {
		const context = canvas.getContext("2d");


		const particles = [];
		const radius = 15;
		const color = "blue";
		const maxWidth = this.canvasWidth - radius * 2.5;
		const maxHeight = this.canvasHeight - radius * 2.5
		for (let i = 0; i < 100; i++) {
			let x = randomIntNumber(radius * 2, maxWidth);
			let y = randomIntNumber(radius * 2, maxHeight);
			if (i !== 0) {
				for (let j = 0; j < particles.length; j++) {
					if (distance(x, y, particles[j].xpos, particles[j].ypos) - radius * 2 < 0) {
						x = randomIntNumber(radius * 2, maxWidth);
						y = randomIntNumber(radius * 2, maxHeight);
						// start over
						j = -1;
					}
				}
			}
			particles.push(new Particle(context, x, y, radius, color, 1, 5));
			
		}
		
		// ANIMATION
		const animate = () => {
			requestAnimationFrame(animate);
			context.clearRect(0,0, window.innerWidth, window.innerHeight)			
			particles.forEach(particle => {
				particle.draw();
			});
		}		
		animate();	
	}
}
