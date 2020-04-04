import { updateSprite } from "../helpers/updateSprite";
import * as PIXI from "pixi.js";


// USE OF CLASSES IS OBSOLETE DUE TO HIGH CPU DEMAND
export default class Simulation {
	constructor(context) {
		this.reactContext = context;
		this.ticker = null;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;

	}



	// UTILITIES
	randomIntNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	distance(x1, y1, x2, y2) {
		const xDist = x2 - x1;
		const yDist = y2 - y1;
		return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	}
	stop() {
		console.log("stop", this.reactContext);
	}

	start(autostart) {
		// main react variables
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
		} = this.reactContext.state;
		
		// canvas & pixi app
		const canvas = this.reactContext.canvasRef.current;
		const app = new PIXI.Application({
			autoresize: true,
			//backgroundColor: 0x191919,
			view: canvas,
			width: this.canvasWidth,
			height: this.canvasHeight,
			resolution: window.devicePixelRatio || 1,
			autoDensity: true
		});
		// for animating 
		this.ticker = PIXI.Ticker.shared;
		this.ticker.autoStart = autostart; // false - not to start when listeners are added

		// for sprite images
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
				let x = this.randomIntNumber(radius * 2, maxWidth);
				let y = this.randomIntNumber(radius * 2, maxHeight);
				if (i !== 0) {
					for (let j = 0; j < spriteArr.length; j++) {
						if ((this.distance(x, y, spriteArr[j].x, spriteArr[j].y) - (radius + spriteArr[j].radius)) < 0) {
							x = this.randomIntNumber(radius * 2, maxWidth);
							y = this.randomIntNumber(radius * 2, maxHeight);
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
				sprite.reactContext = this.reactContext;
				sprite.velocity = { 
					x: (Math.random() - .5) * speed, 
					y: (Math.random() - .5) * speed 
				};
				spriteArr.push(sprite);
			}

			const len = spriteArr.length;
			console.log("ticker", this.ticker);
			
			// draw and animate
			for (let index = 0; index < len; index++) {
				app.stage.addChild(spriteArr[index]);
				this.ticker.add(updateSprite.bind(null, spriteArr[index], spriteArr, this.distance, loader));
			}
		}
	}
}
