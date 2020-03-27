
export default class Circle {
	constructor(context, xpos, ypos, radius, color, text, speed) {
		this.context = context;
		this.xpos = xpos;
		this.ypos = ypos;
		this.radius = radius;
		this.color = color;
		this.text = text;
		this.speed = speed;

		this.dx = 1 * this.speed;
		this.dy = 1 * this.speed;

		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight
	}

	draw() {
		this.context.beginPath();		
		this.context.strokeStyle = this.color;
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		this.context.font = "20px Arial";
		this.context.fillText(this.text, this.xpos, this.ypos);

		this.context.linewidth = 1;
		this.context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
		this.context.fillStyle = this.color;
		this.context.stroke();
		this.context.closePath();
	}
	update() {
		this.context.clearRect(0, 0, this.windowWidth, this.windowHeight);

		this.draw(this.context);
		this.xpos += this.dx;
		this.ypos += this.dy;

	}
}