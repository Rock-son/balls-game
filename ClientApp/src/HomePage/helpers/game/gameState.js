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
	availableQuarantines: [],
	quarantineBeingDragged: false,
	quarantineOverlapping: false,
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
		delayInSeconds: 3,
		nrOfQuarantines: 5 // max 5
	}
}
const resetSettings = {
	quarantineBeingDragged: false,
	quarantineOverlapping: false,
	quarantineButtonsActive: true, // change this setting
	quarantineDropped: false,
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
// GAME
export function stopStartGame() {
	console.log("from stopstartgame");
	
	if (this.state.gamePaused && !this.state.gameStopped) { // CONTINUE
		this.toggleGameDialog();
	} else {								// START
		this.stop();
		this.startGame(true);
		this.setState(prevState => {
			return {
				isGameActive: true,
				clockTime: new Date(0),
				startButtonText: "CONTINUE GAME",
				healthy: prevState.gameSettings["quantity"] - 1, 
				contagious: 1,
				...resetSettings
			}
		});
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
	const newGameSettings = {...this.state.gameSettings, ...parsedData};
	console.log("parsedData", newGameSettings);
	
	this.setState(prevState => {
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
	// pop first value from available quarantines	
	this.setState(prevState => {
		return {
			draggedQuarantine: {
				id: prevState.availableQuarantines.slice(0,1)[0] || -1,
				x: pageX, 
				y: pageY
			},
			quarantineBeingDragged: true,
			quarantineButtonsActive: true,
			quarantineDropped: false,
			availableQuarantines: prevState.availableQuarantines.slice(1)
		};
	});
}
export function resetDraggedQuarantineId(id) {
	this.setState({
		draggedQuarantine: {...resetSettings.draggedQuarantine}
	});
}
export function setQuarantineNonactive(id) {
	this.setState(prevState => {
		const index = prevState.availableQuarantines.indexOf(id);
		// index about to be inactive shouldn't be in available quarantines array - so leave it be if you find it
		if (index > -1) {
			return {
				availableQuarantines: prevState.availableQuarantines
			};
		} else {
			return {
				availableQuarantines: prevState.availableQuarantines.concat(id)
			};
		}
	});
}
export function toggleGamePause() {
	return this.state.gamePaused && !this.state.gameStopped ? this.unpause() : this.pause();
}
export function toggleGameDialog() {
	if (this.state.isSimulationActive) {
		this.stop();
		console.log("from game dialog");
		
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