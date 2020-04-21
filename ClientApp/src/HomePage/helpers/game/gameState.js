
import sound from "../../assets/gameStart.mp3";

export const gameSettings = {
	isGameActive: false,
	gamePaused: true,
	gameStopped: true,
	// gamesettings - popups
	gameSettingsOpen: false,
	gameRestarting: false,
	gameTimeDifficulty: { 0: 7, 1: 5, 2: 3},
	// PLAYER
	gameEnded: false,
	didPlayerWin: false,
	// GAME
	// quarantine settings
	quarantinePlaced: false,
	availableQuarantines: [],
	quarantineBeingDragged: false,
	quarantineOverlapping: false,
	quarantineCancelled: false,
	draggedQuarantine: {
		id: -1,
		x: 0,
		y: 0,
		duration: 0,
		size: 250
	},
	// game settings
	gameSettings: {
		mode: 0,
		difficulty: 1,
		size: 8,
		quantity: 300,
		speed: 0.6,
		delayInSeconds: 3,
		nrOfQuarantines: 5, // max nr
	}
}

export const resetSettings = {
	gameEnded: false,
	didPlayerWin: false,
	quarantineBeingDragged: false,
	quarantineOverlapping: false,
	quarantinePlaced: false,
	gameSettingsOpen: false,
	howToPlayDialogOpen: false,
	gamePaused: false,
	gameStopped: false,
	quarantineCancelled: false,
	draggedQuarantine: {
		id: -1,
		x: 0,
		y: 0,
		size: 250
	},
}
// GAMEPLAY
export function gameEnded({ playerWin }) {
	this.setState({
		gameEnded: true,
		gamePaused: true,
		gameStopped: true,
		didPlayerWin: playerWin
	});
}
export function closeGameEndDialog() {
	const playerWin = this.state.didPlayerWin;
	this.setState({ gameRestarting: true });
	setTimeout(() => this.setState({ gameRestarting: false }), 1000);
	setTimeout(() => {
		this.stop();
		this.startGame(false);
		this.setState({
			...resetSettings,
			clockTime: new Date(0),
			startButtonText: "START GAME",
			didPlayerWin: playerWin,
			gameSettingsOpen: true,
			gamePaused: true,
			gameStopped: true
		});
	}, 400);
}


export function onContextMenuHideQuarantine(e) {
	e.preventDefault();
	if (this.state.quarantineBeingDragged) {
		this.setState(prevState => {
			return {
				quarantineCancelled: true,
				quarantineBeingDragged: false
			}
		});
	}
}

export function onWheelScroll(e) {
	const deltaY = e.deltaY;
	if (this.state.quarantineBeingDragged) {
		if (deltaY > 0) {
			this.setState(prevState => {
				return {
					draggedQuarantine: {
						...prevState.draggedQuarantine,
						size: prevState.draggedQuarantine["size"] + 30
					}
				}
			});
		 } else {
			this.setState(prevState => {
				return {
					draggedQuarantine: {
						...prevState.draggedQuarantine,
						size: prevState.draggedQuarantine["size"] -30
					}
				}
			});
		}
	}
}
export function onMouseMove(e) {
	if (this.state.quarantineBeingDragged) {
		const pageX = e.pageX;
		const pageY = e.pageY;
		this.setState(prevstate => {
			return { draggedQuarantine: {...prevstate.draggedQuarantine, x: pageX , y: pageY} }
		});
	}
}
// GAME
export function stopStartGame() {
	if (this.state.gamePaused && !this.state.gameStopped) { // CONTINUE
		this.toggleGameDialog();
	} else {												// START
		this.setState({ gameRestarting: true });
		setTimeout(() => this.setState({ gameRestarting: false }), 1000);
		setTimeout(() => {
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
		}, 400)
		this.audioTimeoutId = setTimeout(() => {
			const audio = new Audio(sound);
			audio.play();
		}, 3000);
	}
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
		this.setState({ gameRestarting: false });
		clearTimeout(this.gameTimeoutId);
	}
	
	const newGameSettings = {...this.state.gameSettings, ...parsedData};
	setTimeout(() => this.setState({ gameRestarting: true }), 100);
	this.gameTimeoutId = setTimeout(() => this.setState({ gameRestarting: false }), 1200);
	setTimeout(() => {
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
	}, 500);
}
export function resetDraggedQuarantineId() {
	this.setState({
		draggedQuarantine: {...resetSettings.draggedQuarantine}
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
				y: pageY,
				// TODO: 
				//duration: 
				size: prevState.draggedQuarantine.size
			},
			quarantineBeingDragged: true,
			quarantinePlaced: false,
			availableQuarantines: prevState.availableQuarantines.slice(1)
		};
	});
}
export function setQuarantineNonactive(id) {
	this.setState(prevState => {
		const index = prevState.availableQuarantines.indexOf(id);
		// index about to be inactive shouldn't be in available quarantines array - so leave it be if you find it
		if (index > -1) {
			return {
				availableQuarantines: prevState.availableQuarantines,
				quarantineCancelled: false,
			};
		} else {
			return {
				availableQuarantines: prevState.availableQuarantines.concat(id),
				quarantineCancelled: false,
			};
		}
	});
}
export function toggleGamePause() {
	return this.state.gamePaused && !this.state.gameStopped ? this.unpause() : this.pause();
}
export function toggleGameDialog(e) {
	e && e.preventDefault();
	e && e.stopPropagation();
	if (this.state.isSimulationActive) {
		this.setState({ gameRestarting: true });
		setTimeout(() => this.setState({ gameRestarting: false }), 1000);
		setTimeout(() => {
			this.stop();
			this.startGame(false);
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
		}, 400);
	} else {
		this.toggleGamePause();
		this.audioTimeoutId != null && clearTimeout(this.audioTimeoutId);
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