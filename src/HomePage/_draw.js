
import Circle from "./classes/Circle";

export default function _draw() {	
	const canvas = this.canvasRef.current;
	if (canvas.getContext) {
		const context = canvas.getContext("2d");

		const updateCircle = function() {
			requestAnimationFrame(updateCircle);
			myCircle.update(context);
		}

		const radius = 50;
		const color = "blue";
		const x = Math.floor(Math.random() * Math.floor(this.canvasWidth));
		const y = Math.floor(Math.random() * Math.floor(this.canvasHeight));

		const myCircle = new Circle(context, x, y, radius, color, 1, 1);

		myCircle.draw(context);
		//updateCircle();


		
	}
}
