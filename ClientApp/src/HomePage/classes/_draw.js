import { update } from "./update";
import * as PIXI from "@pixi/core";
import { install } from "@pixi/unsafe-eval";

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
	const {
		simulationSettings: {
			size,
			speed,
			quantity,
			deactivateAfter,
			showTime,
			showStats,
			autorestart
		}
	} = this.state;

	install(PIXI);
	const canvas = this.canvasRef.current;
	const app = new PIXI.Application({
		autoresize: true,
		backgroundColor: 0x191919,
		view: canvas,
		width: this.canvasWidth,
		height: this.canvasHeight,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true
	});
	// for many animating objects
	const container = new PIXI.ParticleContainer();
	app.stage.addChild(container);

	const loader = PIXI.Loader.shared;

	loader.add("ball-red.png")
		.add("ball-white.png")
		.on("progress", (loader, resource) => console.log(loader.progress + "% loaded"))
		.on("load", (loader, resource) => console.log("Asset loaded" + resource.name))
		.on("error", err => console.error("load error", err))
		.load(handleOnImageLoaded.bind(this));

	// Resize function window
	const resize = () => {
		// Resize the renderer
		app.renderer.resize(window.innerWidth < this.canvasWidth ? this.canvasWidth : window.innerWidth,
							window.innerHeight < this.canvasHeight ? this.canvasHeight : window.innerHeight);

	// You can use the 'screen' property as the renderer visible
	// area, this is more useful than view.width/height because
	// it handles resolution
	//rect.position.set(app.screen.width, app.screen.height);
	}
	// Listen for window resize events
	window.addEventListener('resize', resize);


	let color, contagion, img;
	const images = [];
	const radius = size;
	const nrImages = +quantity;
	const maxWidth = this.canvasWidth - radius * 2.5;
	const maxHeight = this.canvasHeight - radius * 2.5;

	function handleOnImageLoaded() {
		const whiteBall = loader.resources["ball-white.png"].texture;
		const redBall = loader.resources["ball-red.png"].texture;
		for (let i = 0; i < nrImages; i++) {

			contagion = i === 0 ? 1 : 0;
			let x = randomIntNumber(radius * 2, maxWidth);
			let y = randomIntNumber(radius * 2, maxHeight);
			if (i !== 0) {
				for (let j = 0; j < images.length; j++) {
					if ((distance(x, y, images[j].x, images[j].y) - (radius + images[j].radius)) < 0) {
						x = randomIntNumber(radius * 2, maxWidth);
						y = randomIntNumber(radius * 2, maxHeight);
						// set new x, y recursively
						j = -1;
					}
				}
			}
			const index = i;
			img = new PIXI.Sprite(whiteBall);	// texture
			img.x = x;
			img.y = y;
			img.scale.x = .1;
			img.scale.y = .1;
			img.anchor.x = .5;
			img.anchor.y = .5;
			img.myID = i;
			img.contagion = contagion;
			img.radius = radius;
			img.myContext = this;
			img.velocity = {
				x: (Math.random() - .5) * speed,
				y: (Math.random() - .5) * speed
			};
			images.push(img);
		}

		const len = images.length;
		// draw and animate
		for (let index = 0; index < len; index++) {
			container.addChild(images[index]);
			app.ticker.add(update.bind(null, images[index], images, distance, loader));
		}
	}
}
