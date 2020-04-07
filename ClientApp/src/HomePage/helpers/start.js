"use strict";

import { updateSprite } from "./updateSprite";
import * as PIXI from "pixi.js";

export function start(autostart, simulationSettings = null) {
	this.autostart = autostart || false;
	// UTILITIES

	const canvas = this.canvasRef.current;
	this.simulationApp = new PIXI.Application({
		backgroundColor: 0x000,
		view: canvas,
		width: this.canvasWidth,
		height: this.canvasHeight,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		sharedLoader: true
	});
	
	if (this.simulationApp.loader.resources.sheet == null) {
		this.simulationApp.loader.add("sheet", "balls-15.json")
		.on("progress", (loader, resource) => console.log(loader.progress + "% loaded"))
		.on("load", (loader, resource) => console.log("Asset loaded" + resource.name))
		.on("error", err => console.error("load error", err))
		.load(handleOnImageLoaded.bind(this, simulationSettings));
	} else {
		this.simulationApp.loader.load(handleOnImageLoaded.bind(this, simulationSettings));
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
}

function randomIntNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function distance(x1, y1, x2, y2) {
	const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
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
	const whiteBall = this.simulationApp.loader.resources.sheet.textures["ball-white-15.png"];
	const redBall = this.simulationApp.loader.resources.sheet.textures["ball-red-15.png"];

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
			sprite = new PIXI.Sprite(whiteBall);;
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
		sprite.contagiousFrom = 0;
		sprite.velocity = { 
			x: (Math.random() > .5 ? randomIntNumber(-1, -1.3) : randomIntNumber(1, 1.3)) * speed,
			y: (Math.random() > .5 ? randomIntNumber(-1, -1.3) : randomIntNumber(1, 1.3)) * speed,
		};
		// calculate hypothenuse
		sprite.startSpeed = Math.sqrt(Math.pow(sprite.velocity.x, 2) + Math.pow(sprite.velocity.y, 2));
		spriteArr.push(sprite);
	}
		
	const len = spriteArr.length;	
	// draw and animate
	if (this.autostart) {
		for (let index = 0; index < len; index++) {
			this.simulationApp.stage.addChild(spriteArr[index]);
			this.simulationApp.ticker.add(updateSprite.bind(null, spriteArr[index], spriteArr, distance, this.simulationApp.loader));
		}
	} else {
		for (let index = 0; index < len; index++) {
			this.simulationApp.stage.addChild(spriteArr[index]);
			this.simulationApp.ticker.addOnce(updateSprite.bind(null, spriteArr[index], spriteArr, distance, this.simulationApp.loader));
		}
	}
}

