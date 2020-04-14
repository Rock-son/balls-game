export const gameSettings = {
	isGameActive: false,
	gamePaused: true,
	gameStopped: true,
	// modals - popups
	gameSettingsOpen: false,
	// GAME
	// quarantine settings
	quarantineButtonsActive: false,
	quarantineDropped: false,
	availableQuarantines: Array.apply(0, {length: 7}).map((x,i) => i),
	quarantineBeingDragged: false,
	quarantineOverlapping: false,
	activeQuarantines: [],
	draggedQuarantine: {
		id: -1,
		x: 0,
		y: 0,
	},
	// game settings
	gameSettings: {
		mode: 0,
		difficulty: 0,
		size: (window.innerWidth < 800 ? 2.5 : 5),
		quantity: 100,
		speed: 0.3,
		delayInSeconds: 3
	}
}
const resetSettings = {
	quarantineBeingDragged: false,
	quarantineOverlapping: false,
	quarantineButtonsActive: true, // change this setting
	quarantineDropped: false,
	activeQuarantines: [],
	gameSettingsOpen: false,
	gamePaused: false,
	gameStopped: false,
	draggedQuarantine: {
		id: -1,
		x: 0,
		y: 0,
	},
}


export function onMouseMove(e) {	
	if (this.state.quarantineButtonsActive) {			
		const pageX = e.pageX;
		const pageY = e.pageY;
		this.setState(prevstate => { 
			return { draggedQuarantine: {...prevstate.draggedQuarantine, ...{ x: pageX, y: pageY }} }
		});
	}	
}
export function shuffle(arr) {
	let currentIndex = arr.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex -= 1;	  
	  // And swap it with the current element.
	  temporaryValue = arr[currentIndex];
	  arr[currentIndex] = arr[randomIndex];
	  arr[randomIndex] = temporaryValue;
	}	  
	return arr;
}
// GAME
export function stopStartGame() {
	if (this.state.gamePaused && !this.state.gameStopped) { // CONTINUE
		this.toggleGameDialog();
	} else {								// START
		this.stop();
		const shuffledQuarantines = this.shuffle(this.state.availableQuarantines); 
		this.setState(prevState => {
			return {
				isGameActive: true,
				clockTime: new Date(0),
				startButtonText: "CONTINUE GAME",
				healthy: prevState.gameSettings["quantity"] - 1, 
				contagious: 1,
				availableQuarantines: shuffledQuarantines,
				...resetSettings
			}
		});
		this.startGame(true);
	}
}
// TODO: not so simple
export function gameRestart() {
	this.stop();
	this.startGame(true);
	this.setState(prevState => ({ 
		clockTime: new Date(0),
		startButtonText: "CONTINUE SIMULATION",
		healthy: prevState.gameSettings["quantity"] - 1, 
		contagious: 1,
		...resetSettings
	}));
}
export function setGameSettings(e) {
	let targetData, parsedData;
	// triggered on event
	if (e.currentTarget) {
		targetData = e.currentTarget.getAttribute("data-option");
		parsedData = JSON.parse(targetData) || {};
	} else {
		// triggered directly from dialog
		parsedData = e;
	}		
	this.setState(prevState => {
		const newGameSettings = {...prevState.gameSettings, ...parsedData};
		this.stop();
		this.startGame(false, newGameSettings);
		// reset settings as you would at game start
		return ({
			isGameActive: true,
			clockTime: new Date(0), 
			gameSettings: newGameSettings, 
			healthy: newGameSettings["quantity"] - 1, 
			contagious: 1,
			startButtonText: "START GAME",
			...resetSettings,
			// override reset settings after this
			gameSettingsOpen: true,
			gameStopped: true, 
			gamePaused: true, 
		});
	}); 
}
export function setQuarantineInMotion(e) {
	const pageX = e.pageX;
	const pageY = e.pageY;
	// loop through available quarantines
	const targetID = this.state.gameSettings["quantity"] + this.state.availableQuarantines[this.state.activeQuarantines.length];	
	this.setState(prevState => {
		return {draggedQuarantine: {...prevState.draggedQuarantine, 
									...{ id: targetID, x: pageX, y: pageY }
								},
				quarantineBeingDragged: true,
				quarantineButtonsActive: true,
				quarantineDropped: false,
				activeQuarantines: prevState.activeQuarantines.concat(targetID)
		};
	});
}
export function resetDraggedQuarantineId(id) {
	this.setState({
		draggedQuarantine: {...resetSettings.draggedQuarantine}
	});
}
export function setQuarantineNonactive(id) {
	console.log("active", this.state.activeQuarantines);
	
	this.setState(prevState => {
		const index = prevState.activeQuarantines.indexOf(id);

		if (index === -1) {
			return {
				activeQuarantines: prevState.activeQuarantines
			};
		}
		const test = prevState.activeQuarantines.slice(0, index).concat(prevState.activeQuarantines.slice(index + 1));
		console.log("after set non active", test);
		return {
			activeQuarantines: prevState.activeQuarantines.slice(0, index).concat(prevState.activeQuarantines.slice(index + 1))
		};
	});
}
export function toggleGamePause() {
	return this.state.gamePaused && !this.state.gameStopped ? this.unpause() : this.pause();
}
export function toggleGameDialog() {
	if (this.state.isSimulationActive) {
		this.stop();
		// only when clicking on navbar link -> stop simulation and show game dialog
		this.setState(prevState => {
			return ({ 
				gameSettingsOpen: true, 
				gamePaused: true, 
				startButtonText: "START GAME", 
				isSimulationActive: false,
				isGameActive: true, 
				simulationPaused: true, 
				simulationStopped: true 
			})
		});
	} else {
		this.toggleGamePause();
		this.setState(prevState => {
			return ({ 
				gameSettingsOpen: !prevState.gameSettingsOpen, 
				gamePaused: !prevState.gamePaused, 
				startButtonText: prevState.gameStopped ? "START GAME" : "CONTINUE GAME", 
				isSimulationActive: false, 
				isGameActive: true, 
				simulationPaused: true, 
				simulationStopped: true 
			})
		});
	}
}