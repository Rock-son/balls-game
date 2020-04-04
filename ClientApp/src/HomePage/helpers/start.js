import { updateSprite } from "./updateSprite";
import * as PIXI from "pixi.js";

export function start() {

	// UTILITIES
	function randomIntNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function distance(x1, y1, x2, y2) {
		const xDist = x2 - x1;
		const yDist = y2 - y1;
		return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	}

	const canvas = this.canvasRef.current;
	this.simulationApp = new PIXI.Application({
		autoresize: true,
		backgroundColor: 0x191919,
		view: canvas,
		width: this.canvasWidth,
		height: this.canvasHeight,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true
	});
	// for many animating objects
	this.loader = PIXI.Loader.shared;
	if (this.loader.resources.sheet == null) {
		this.loader.add("sheet", "myBalls.json")
		.on("progress", (loader, resource) => console.log(loader.progress + "% loaded"))
		.on("load", (loader, resource) => console.log("Asset loaded" + resource.name))
		.on("error", err => console.error("load error", err))
		.load(handleOnImageLoaded.bind(this));
	} else {
		this.loader.load(handleOnImageLoaded.bind(this));
	}


	// Resize function window
	const resize = () => {
		// Resize the renderer
		this.simulationApp.renderer.resize(window.innerWidth < this.canvasWidth ? this.canvasWidth : window.innerWidth,
							window.innerHeight < this.canvasHeight ? this.canvasHeight : window.innerHeight);

	// You can use the 'screen' property as the renderer visible
	// area, this is more useful than view.width/height because
	// it handles resolution
	//rect.position.set(app.screen.width, app.screen.height);
	}
	// Listen for window resize events
	window.addEventListener('resize', resize);


	function handleOnImageLoaded() {
		const {
			simulationSettings: {
				size: radius,
				speed,
				quantity,
				deactivateAfter,
				showTime,
				showStats,
				autorestart
			}
		} = this.state;

		let contagion, sprite;
		const spriteArr = [];
		const nrImages = +quantity;
		const maxWidth = this.canvasWidth - radius * 2.5;
		const maxHeight = this.canvasHeight - radius * 2.5;
		const whiteBall = this.loader.resources.sheet.textures["ball-white.png"];
		const redBall = this.loader.resources.sheet.textures["ball-red.png"];

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
			sprite.width = radius * 2;
			sprite.height = radius * 2;
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
			this.simulationApp.stage.addChild(spriteArr[index]);
			this.simulationApp.ticker.add(updateSprite.bind(null, spriteArr[index], spriteArr, distance, this.loader));
		}
	}
}
