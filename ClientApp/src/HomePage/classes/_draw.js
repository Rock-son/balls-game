import { update } from "./update";
import * as PIXI from "pixi.js";

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
	const loader = PIXI.Loader.shared;
	loader.add("sheet", "myBalls.json")
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


	let contagion, sprite;
	const spriteArr = [];
	const radius = size;
	const nrImages = +quantity;
	const maxWidth = this.canvasWidth - radius * 2.5;
	const maxHeight = this.canvasHeight - radius * 2.5;

	function handleOnImageLoaded() {
		const whiteBall = loader.resources.sheet.textures["ball-white.png"];
		const redBall = loader.resources.sheet.textures["ball-red.png"];
		for (let i = 0; i < nrImages; i++) {

			contagion = i === 0 ? 1 : 0;
			let x = randomIntNumber(radius * 2, maxWidth);
			let y = randomIntNumber(radius * 2, maxHeight);
			if (i !== 0) {
				for (let j = 0; j < spriteArr.length; j++) {
					if ((distance(x, y, spriteArr[j].x, spriteArr[j].y) - (radius + spriteArr[j].radius)) < 0) {
						x = randomIntNumber(radius * 2, maxWidth);
						y = randomIntNumber(radius * 2, maxHeight);
						// set new x, y recursively
						j = -1;
					}
				}
			}
			if (contagion) {				
				sprite = new PIXI.Sprite(redBall);
			} else {
				sprite = new PIXI.Sprite(whiteBall);
			}
			sprite.x = x;
			sprite.y = y;
			sprite.width = size * 2;
			sprite.height = size * 2;
			sprite.anchor.x = .5;
			sprite.anchor.y = .5;
			sprite.myID = i;
			sprite.contagion = contagion;
			sprite.radius = radius;
			sprite.reactContext = this;
			sprite.velocity = { 
				x: (Math.random() - .5) * speed, 
				y: (Math.random() - .5) * speed 
			};
			spriteArr.push(sprite);
		}

		const len = spriteArr.length;
		// draw and animate
		for (let index = 0; index < len; index++) {
			app.stage.addChild(spriteArr[index]);
			app.ticker.add(update.bind(null, spriteArr[index], spriteArr, distance, loader));
		}
	}
}
