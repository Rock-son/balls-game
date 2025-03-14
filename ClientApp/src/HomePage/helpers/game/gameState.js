import soundGameStart from "../../assets/snd-gameStart.mp3";
import soundLose from "../../assets/snd-lose.mp3";
import soundWin from "../../assets/snd-win.mp3";
import { quantityDiffVals, speedDiffValues } from "../../components/GameDialog/gameOptions";

export const gameSettings = {
	isGameActive: false,
	gamePaused: true,
	gameStopped: true,
	// gamesettings - popups
	gameSettingsOpen: false,
	gameRestarting: false,
	gameTimeDifficultyInSeconds: { 0: 7, 1: 5, 2: 3},
	// PLAYER
	gameEnded: false,
	didPlayerWin: false,
	// GAME
	// quarantine settings
	isAnyButtonActive: false,
	quarantinePlaced: false,
	availableQuarantines: [],
	activeQuarantines: [],
	quarantineAboutToExpire: false,
	quarantineBeingDragged: false,
	quarantineOverlapping: false,
	quarantineCancelled: false,
	shouldGameUpdateExpiration: true,
	draggedQuarantine: {
		id: -1,
		x: 0,
		y: 0,
		dx: 0,
		durationInSeconds: 0,
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
		nrOfQuarantines: 6, // max nr
	}
}

export const resetSettings = {
	isGameActive: true,
	isAnyButtonActive: false,
	activeQuarantines: [],
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
		durationInSeconds: 0,
		size: 250
	},
}
// GAMEPLAY
export function gameEnded({ playerWin }) {
	this.setState({
		...resetSettings,
		gameEnded: true,
		gamePaused: true,
		gameStopped: true,
		didPlayerWin: playerWin
	});
	// if null => gameMode === 0
	if (playerWin != null)  {
		if (playerWin) {
			const audio = new Audio(soundWin);
			audio.play();
		} else {
			const audio = new Audio(soundLose);
			audio.play();
		}
	}
}
export function closeGameEndDialog() {
	const playerWin = this.state.didPlayerWin;

	if (playerWin) {
		this.openTimeChallengeShareDialog();
	} else {
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
				timeChallengeShareDialogOpen: false,
				gameSettingsOpen: true,
				gamePaused: true,
				gameStopped: true
			});
		}, 400);
	}
}
export function openTimeChallengeShareDialog() {
	this.setState(prevState => ({
		gamePaused: true,
		gameStopped: true,
		didPlayerWin: false, // reset due to closeGameEndDialog logic
		timeChallengeShareDialogOpen: !prevState.timeChallengeShareDialogOpen,

	}));
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
export function onTouchMove(e) {
	// not viable on Chrom dev tools: e.touches.length === 2
	if (this.state.quarantineBeingDragged) {
		let dx = 0;
		// on pinch - two fingers touch the screen
		if (e.touches.length > 1) {
			dx = Math.sqrt(Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2) + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2));

		}
		// pinching stops -> reset dx
		else if (e.touches.length === 1 && this.state.draggedQuarantine.dx !== 0) {
			dx = 0;
		}

		const { pageX, pageY } = (e.touches && e.touches[0]) || { pageX: 0, pageY: 0 };
		this.setState(prevState => {
			const { draggedQuarantine } = prevState;
			const limitSize = draggedQuarantine["size"] < 90 ? 90 : (draggedQuarantine["size"] > 360 ? 360 : draggedQuarantine["size"]);
			const changeInSize = dx === 0 ? limitSize : (dx > draggedQuarantine["dx"] ? draggedQuarantine["size"] + 30 : draggedQuarantine["size"] - 30);
			return { draggedQuarantine: {...prevState.draggedQuarantine, x: pageX , y: pageY, size: changeInSize, dx: dx } }
		});
	}
}
// GAME
export function stopStartGame() {
	if (this.state.gamePaused && !this.state.gameStopped) { // CONTINUE
		this.toggleGameDialog();
	} else {											// START
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
			const audio = new Audio(soundGameStart);
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
	
	// change settings according to valid size, numbers & speed values (difficulty can be 0!)
	if (parsedData["size"] || parsedData["difficulty"] != null) {		
		const validDifficulty = parsedData["difficulty"] != null ? parsedData["difficulty"] : this.state.gameSettings["difficulty"];
		const validSize = parsedData["size"] || this.state.gameSettings["size"];

		const minQuantity = (quantityDiffVals[validDifficulty][validSize] || { min: 0 }).min;
		const maxQuantity = (quantityDiffVals[validDifficulty][validSize] || { max: 1000 }).max;
		const changedSpeed = speedDiffValues[validDifficulty];
		
		// if quantity is greater or smaller than it should be according to size
		if (this.state.gameSettings["quantity"] > maxQuantity) {
			parsedData["quantity"] = maxQuantity;
		}
		else if (this.state.gameSettings["quantity"] < minQuantity ) {
			parsedData["quantity"] = minQuantity;
		}
		
		// if min, max values are not a problem, then set speed
		if (this.state.gameSettings["speed"] !== changedSpeed) {
			parsedData["speed"] = changedSpeed;
		}
	}
	// set new settings and use fade out
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
	function randomIntNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	const milisecondsInASecond = 1000;
	const difficultyTime = { 0: [15, 25], 1: [15, 20], 2: [10, 15] };
	const difficulty = this.state.gameSettings["difficulty"];
	const min = difficultyTime[difficulty][0]*milisecondsInASecond;
	const max = difficultyTime[difficulty][1]*milisecondsInASecond;
	
	const randomTimeInSeconds = Math.round(randomIntNumber(min, max) / milisecondsInASecond);	
	const pageX = e.pageX;
	const pageY = e.pageY;
	// pop first value from available quarantines
	this.setState(prevState => {		
		const quarantineId = prevState.availableQuarantines.slice(0,1)[0] || -1;		
		return {
			draggedQuarantine: {
				id: quarantineId,
				x: pageX,
				y: pageY,
				durationInSeconds: randomTimeInSeconds,
				size: prevState.draggedQuarantine.size
			},
			quarantineBeingDragged: true,
			quarantinePlaced: false,
			availableQuarantines: prevState.availableQuarantines.slice(1),
			activeQuarantines: prevState.activeQuarantines.concat(quarantineId)
		};
	});
	
}
export function resetQuarantineExpiration() {
	this.setState({ 
		quarantineAboutToExpire: false,
		shouldGameUpdateExpiration: false
	});
	setTimeout(() => {
		this.setState({ shouldGameUpdateExpiration: true });
	}, 1100);
}
export function setQuarantineInactive(id) {
	this.setState(prevState => {		
		const indexAvail = prevState.availableQuarantines.indexOf(id);
		const indexActive = prevState.activeQuarantines.indexOf(id);
		// index about to be inactive shouldn't be in available quarantines array - so leave it be if you find it
		if (indexAvail > -1) {
			return {
				availableQuarantines: prevState.availableQuarantines,
				quarantineCancelled: false,
			};
		} else {
			return {
				availableQuarantines: prevState.availableQuarantines.concat(id),
				activeQuarantines: prevState.activeQuarantines.slice(0, indexActive).concat(prevState.activeQuarantines.slice(indexActive + 1)),
				quarantineCancelled: false,
			};
		}
	});
}
export function setButtonStatus(status) {
	this.setState({ isAnyButtonActive: status });
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
					clockTime: new Date(0),
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
		// delete url params if they exist	
		if (window.location.search !== "") {
			window.history.replaceState({}, document.title, "/");
		}
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