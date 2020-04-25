import { updateGame } from "./updateGame";
import * as PIXI from "pixi.js-legacy";

export function startGame(autostart, gameSettings = null) {
	this.autostart = autostart || false;
	// UTILITIES
	PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
	this.gameApp = new PIXI.Application({
		width: this.canvasWidth,
		height: this.canvasHeight,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		sharedLoader: true
	});
	document.getElementById("canvas-container").appendChild(this.gameApp.view);

	if (this.gameApp.loader.resources.sheet == null) {
		this.gameApp.loader
			.add("sheet", "textures.json")
			.add("animatedsheet", "textures_blink_black.json")
			//.on("progress", (loader, resource) => console.log(loader.progress + "% loaded"))
			//.on("load", (loader, resource) => console.log("Asset loaded" + resource.name))
			.on("error", err => console.error("load error", err))
			.load(handleOnImageLoaded.bind(this, gameSettings, autostart));
	} else {
		this.gameApp.loader.load(handleOnImageLoaded.bind(this, gameSettings, autostart));
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

function handleOnImageLoaded(gameSettings, autostart) {
	const {
		size: radius,
		speed,
		quantity,
		nrOfQuarantines
	} = gameSettings == null ? this.state.gameSettings : gameSettings;


	const quarantineArr = [];
	const timeTextArr = [];
	// TEXT & QUARANTINES
	for (let index = 0; index < nrOfQuarantines; index++) {
		// TEXT
		const timeText = new PIXI.Text("", {
			fill: 0x69b11c,
			fontSize: "21px",
			fontWeight: "700",
			fontFamily : "Roboto Condensed"
		});
		timeText.alpha = 1;
		timeText.isTextSprite = true;
		timeText.anchor.set(0.5, 0);
		timeText.x = -500;
		timeText.y = -500;
		timeText.dropTime = null;
		timeText.reactContext = this;
		timeText.myID = quantity + nrOfQuarantines + index; // text index (calulate existing quarantines)

		// QUARANTINES
		const width = this.state.draggedQuarantine["size"];
		const height = width;
		const radius = width / 2;

		const green = new PIXI.Graphics();
		green.beginFill(0x69b11c, 0.7);
		green.drawCircle(0,0,radius);
		green.endFill();
		const greenTexture = green.generateCanvasTexture();

		const particleID = quantity + index;
		const quarantine = new PIXI.Sprite(greenTexture);
		quarantine.alpha = 1;
		quarantine.x = -500 * (index+1); // so quarantines don't crash all the time in each other
		quarantine.y = -500 * (index+1); // so quarantines don't crash all the time in each other
		quarantine.alpha = .5;
		quarantine.width = width;
		quarantine.height = height;
		quarantine.anchor.x = .5;
		quarantine.anchor.y = .5;
		quarantine.radius = radius;
		quarantine.reactContext = this;
		quarantine.contagion = 0;
		quarantine.contagiousFrom = null;
		quarantine.velocity = {
			x: 0,
			y: 0
		};
		quarantine.startSpeed = 0;
		// events
		quarantine.myID = particleID;
		quarantine.isQuarantineSprite = true;
		quarantine.isActive = false;
		quarantine.isDragged = false;
		quarantine.isBeingDropped = false;
		quarantine.dropTime = null;





		// push each object to its own array
		quarantineArr.push(quarantine);
		timeTextArr.push(timeText);
	}

	// PARTICLES
	let contagion, sprite;
	const spriteArr = [];
	const nrImages = +quantity;
	const maxWidth = this.canvasWidth - radius * 2.5;
	const maxHeight = this.canvasHeight - radius * 2.5;
	const whiteBall = this.gameApp.loader.resources.sheet.textures["ball-white.svg"];
	const redBall = this.gameApp.loader.resources.sheet.textures["ball-red.svg"];
	const animatedsheet = this.gameApp.loader.resources.animatedsheet.spritesheet;
	

	for (let i = 0; i < nrImages; i++) {

		contagion = i === 0 ? 1 : 0;
		let tries = 0;
		let x = randomIntNumber(radius * 2, maxWidth);
		let y = randomIntNumber(radius * 2, maxHeight);
		if (i !== 0) {
			for (let j = 0; j < spriteArr.length; j++) {
				if (tries > 1000000) {
					break; // if the screen is too small, it will go forever - so break and have none and notify user
				}
				if (circleIntersect(x, y, radius, spriteArr[j].x, spriteArr[j].y, spriteArr[j].radius)) {
					x = randomIntNumber(radius * 2, maxWidth);
					y = randomIntNumber(radius * 2, maxHeight);
					// set new x, y recursively
					j = -1;
					tries++;
				}
			}
		}
		if (contagion) {
			if (autostart) {
				sprite = new PIXI.AnimatedSprite(animatedsheet.animations["animatedball"]);
				sprite.animationSpeed = 0.1;
				sprite.play();
			} else {
				sprite = new PIXI.Sprite(redBall);
			}
		} else {
			sprite = new PIXI.Sprite(whiteBall);
		}
		sprite.x = x;
		sprite.y = y;
		sprite.isParticleSprite = true;
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

		// calculate starting speed (hypothenuse from x, y) - optimised (without Math.pow() func)
		sprite.startSpeed = Math.sqrt(sprite.velocity.x * sprite.velocity.x + sprite.velocity.y * sprite.velocity.y);
		spriteArr.push(sprite);
	}

	quarantineArr.forEach(item => spriteArr.push(item));
	timeTextArr.forEach(item => spriteArr.push(item));
	

	// construct quarantine and text object
	const quarantineObj = quarantineArr.reduce((acc, obj) => Object.assign(acc, {[obj.myID]: obj}), {length: quarantineArr.length})
	this.setState({ availableQuarantines: quarantineArr.map(item => item.myID)});
	
	const len = spriteArr.length;
	// draw and animate
	if (this.autostart) {
		for (let spriteIndex = 0; spriteIndex < len; spriteIndex++) {
			this.gameApp.stage.addChild(spriteArr[spriteIndex]);
			this.gameApp.ticker.add(updateGame.bind(null, spriteArr[spriteIndex], spriteArr, quarantineArr, quarantineObj, circleIntersect, this.gameApp.loader, randomIntNumber));
		}
	} else {
		for (let spriteIndex = 0; spriteIndex < len; spriteIndex++) {
			this.gameApp.stage.addChild(spriteArr[spriteIndex]);
			this.gameApp.ticker.addOnce(updateGame.bind(null, spriteArr[spriteIndex], spriteArr, quarantineArr, quarantineObj, circleIntersect, this.gameApp.loader, randomIntNumber));
		}
	}
}

