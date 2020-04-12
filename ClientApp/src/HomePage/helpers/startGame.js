import { updateGame } from "./updateGame";
import * as PIXI from "pixi.js-legacy";

export function startGame(autostart, gameSettings = null) {
	this.autostart = autostart || false;
	// UTILITIES

	this.gameApp = new PIXI.Application({
		backgroundColor: 0x000,
		width: this.canvasWidth,
		height: this.canvasHeight,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		sharedLoader: true
	});
	document.getElementById("canvas-container").appendChild(this.gameApp.view);
	
	if (this.gameApp.loader.resources.sheet == null) {
		this.gameApp.loader.add("sheet", "balls.json")
			.on("progress", (loader, resource) => console.log(loader.progress + "% loaded"))
			.on("load", (loader, resource) => console.log("Asset loaded" + resource.name))
			.on("error", err => console.error("load error", err))
			.load(handleOnImageLoaded.bind(this, gameSettings));
	} else {
		this.gameApp.loader.load(handleOnImageLoaded.bind(this, gameSettings));
	}
	// Resize function window
	const resize = (e) => {
		if (this.gameApp) {
			// Resize the renderer
			this.gameApp.renderer.resize(window.innerWidth < this.canvasWidth ? this.canvasWidth : window.innerWidth,
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
function distance(x1, y1, x2, y2) {
	const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function handleOnImageLoaded(gameSettings) {
	const {
		size: radius,
		speed,
		quantity,
		difficulty,
		availableQuarantines
	} = gameSettings == null ? this.state.gameSettings : gameSettings;
	
	
	const quarantineArr = [];
	// QUARANTINES - create and hide them from the screen & use them randomly when needed
	for (let index = 1; index < this.state.availableQuarantines.length+1; index++) {
		const randomLength = randomIntNumber(index*50, index*70);
		const width = randomLength;
		const height = randomLength;
		const radius = randomLength / 2;

		const gt = new PIXI.Graphics();
		gt.beginFill();
		gt.lineStyle(5,0x85e312,1);
		gt.drawCircle(0,0,radius);
		gt.endFill();
		const texture = gt.generateCanvasTexture();	
	
		const particleID = this.state.gameSettings.quantity + index-1;
		const quarantine = new PIXI.Sprite(texture);
		quarantine.x = -500;
		quarantine.y = -500;
		quarantine.alpha = .5;
		quarantine.time = new Date().getTime();
		quarantine.width = width;
		quarantine.height = height;
		quarantine.anchor.x = .5;
		quarantine.anchor.y = .5;
		quarantine.myID = particleID;
		quarantine.radius = radius;
		quarantine.reactContext = this;
		quarantine.contagion = 0;
		quarantine.contagiousFrom = null;
		quarantine.velocity = { 
			x: 0,
			y: 0
		};
		quarantine.startSpeed = 0;
		quarantineArr.push(quarantine);
	}

		
	let contagion, sprite;
	const spriteArr = [];
	const nrImages = +quantity;
	const maxWidth = this.canvasWidth - radius * 2.5;
	const maxHeight = this.canvasHeight - radius * 2.5;
	const whiteBall = this.gameApp.loader.resources.sheet.textures["ball-white-15.png"];
	const redBall = this.gameApp.loader.resources.sheet.textures["ball-red-15.png"];

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
		sprite.radius = radius;
		sprite.reactContext = this;
		sprite.contagion = contagion;
		sprite.contagiousFrom = 0;
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
	
	quarantineArr.forEach(item => spriteArr.push(item));
	
	const len = spriteArr.length;	
	// draw and animate
	if (this.autostart) {
		for (let index = 0; index < len; index++) {
			this.gameApp.stage.addChild(spriteArr[index]);
			this.gameApp.ticker.add(updateGame.bind(null, spriteArr[index], spriteArr, distance, this.gameApp.loader));
		}
	} else {
		for (let index = 0; index < len; index++) {
			this.gameApp.stage.addChild(spriteArr[index]);
			this.gameApp.ticker.addOnce(updateGame.bind(null, spriteArr[index], spriteArr, distance, this.gameApp.loader));
		}
	}
}

