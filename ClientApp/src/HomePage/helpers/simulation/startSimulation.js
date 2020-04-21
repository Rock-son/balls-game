import { updateSimulation } from "./updateSimulation";
import * as PIXI from "pixi.js-legacy";

export function startSimulation(autostart, simulationSettings = null) {
	this.autostart = autostart || false;
	// UTILITIES
	PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
	this.simulationApp = new PIXI.Application({
		width: this.canvasWidth,
		height: this.canvasHeight,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		sharedLoader: true
	});
	const isWebGL = PIXI.utils.isWebGLSupported();	
	if (!isWebGL) {
		this.simulationApp.renderer.context.mozImageSmoothingEnabled = false
		this.simulationApp.renderer.context.webkitImageSmoothingEnabled = false
	}
	/*
	* Fix for iOS GPU issues
	*/
	this.simulationApp.renderer.view.style['transform'] = 'translatez(0)'


	document.getElementById("canvas-container").appendChild(this.simulationApp.view);


	if (this.simulationApp.loader.resources.sheet == null) {
		this.simulationApp.loader
			.add("sheet", "textures.json")
			.add("animatedsheet", "textures_blink_black.json")
			//.on("progress", (loader, resource) => console.log(loader.progress + "% loaded"))
			//.on("load", (loader, resource) => console.log("Asset loaded " + resource.name))
			.on("error", err => console.error("load error", err))
			.load(handleOnImageLoaded.bind(this, simulationSettings));
	} else {
		this.simulationApp.loader.load(handleOnImageLoaded.bind(this, simulationSettings));
	}

	// Resize function window
	const resize = (e) => {
		if (this.simulationApp) {
			// Resize the renderer
			this.simulationApp.renderer.resize(window.innerWidth < this.canvasWidth ? this.canvasWidth : window.innerWidth,
								window.innerHeight < this.canvasHeight ? this.canvasHeight : window.innerHeight);
		}
	// You can use the 'screen' property as the renderer visible
	// area, this is more useful than view.width/height because
	// it handles resolution
	//rect.position.set(app.screen.width, app.screen.height);
	}
	// Listen for window resize events
	window.addEventListener('resize', resize);
}

function randomIntNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Intersection calculation. Multiplication is much faster than getting the square root with Math.sqrt(), so distance is calculated without getting the root 
 * and the sum of the radii is multiplied by itself. The outcome stays the same, but the performance is better.
 * @param {Float} x1 
 * @param {Float} y1 
 * @param {Int}   r1 
 * @param {Float} x2 
 * @param {Float} y2 
 * @param {Int}	  r2 
 */
function circleIntersect(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    var squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

function handleOnImageLoaded(simulationSettings) {
	const {
		size: radius,
		speed,
		quantity
	} = simulationSettings == null ? this.state.simulationSettings : simulationSettings;
	
	let contagion, sprite;
	const spriteArr = [];
	const nrImages = +quantity;
	const maxWidth = this.canvasWidth - radius * 2.5;
	const maxHeight = this.canvasHeight - radius * 2.5;
	const whiteBall = this.simulationApp.loader.resources.sheet.textures["ball-white.svg"];
	const redBall = this.simulationApp.loader.resources.sheet.textures["ball-red.svg"];

	let x, y;
	for (let i = 0; i < nrImages; i++) {
		// red ball always starts in the middle - for more beautiful effec
		contagion = i === 0 ? 1 : 0
		x = randomIntNumber(radius * 2, maxWidth);
		y = randomIntNumber(radius * 2, maxHeight);
		if (i !== 0) {
			for (let j = 0; j < spriteArr.length; j++) {
				if (circleIntersect(x, y, radius, spriteArr[j].x, spriteArr[j].y, spriteArr[j].radius)) {	
					x = randomIntNumber(radius * 2, maxWidth);
					y = randomIntNumber(radius * 2, maxHeight);
					// set new x, y recursively
					j = -1;
				}
			}
		}
		if (contagion) {				
			sprite = new PIXI.Sprite(redBall);
		sprite.y = y;
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
		sprite.radius = radius;
		sprite.reactContext = this;
		sprite.contagion = contagion;
		sprite.contagiousFrom = sprite.contagion ? new Date().getTime() : null;
		const randomX = Math.random() - .5;
		const randomY = Math.random() - .5;
		sprite.velocity = { 
			x: randomX < 0  && randomX > -.3 ? (randomX*speed) - speed : (randomX > 0  && randomX < .3 ? (randomX) + speed : randomX * speed),
			y: randomY < 0  && randomY > -.3 ? (randomY*speed) - speed : (randomY > 0  && randomY < .3 ? (randomY) + speed : randomY * speed),
		};
		
		// calculate starting speed (hypothenuse from x, y)
		sprite.startSpeed = Math.sqrt(Math.pow(sprite.velocity.x, 2) + Math.pow(sprite.velocity.y, 2));
		spriteArr.push(sprite);
	}
	
	const len = spriteArr.length;	
	// draw and animate
	if (this.autostart) {
		for (let index = 0; index < len; index++) {
			this.simulationApp.stage.addChild(spriteArr[index]);
			this.simulationApp.ticker.add(updateSimulation.bind(null, spriteArr[index], spriteArr, circleIntersect, this.simulationApp.loader));
		}
	} else {
		for (let index = 0; index < len; index++) {
			this.simulationApp.stage.addChild(spriteArr[index]);
			this.simulationApp.ticker.addOnce(updateSimulation.bind(null, spriteArr[index], spriteArr, circleIntersect, this.simulationApp.loader));
		}
	}
}

