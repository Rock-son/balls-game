import React from "react";
import { clearDriftless, setDriftlessInterval } from 'driftless';

import { startSimulation, startGame, stop, pause, unPause } from "./helpers/actions";
import { SimulationDialog, NavBar, ShareDialog, GameDialog } from "./components";

import 'bootstrap/dist/css/bootstrap.css';
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.autostart = true;
		this.simulationApp = null;
		this.gameApp = null;

		this.state = {
			isSimulationActive: true,
			isGameActive: false,
			// error handling
			hasError: false, 
			error: null,
			// time
			currentTime: new Date().getTime(),
			startTime: new Date(0),
			// canvas state
			simulationPaused: false,
			gamePaused: true,
			simulationStopped: false,
			gameStopped: true,
			contagious: 1,
			healthy: 199,
			// nav & buttons
			startButtonText: "CONTINUE SIMULATION",
			isCopied: false,
			isNavbarExpanded: false,
			isNavbarVisible: true,
			// modals - popups
			shareModalOpen: false,
			simulationSettingsOpen: false,
			gameSettingsOpen: false,
			// GAME
			gameSettings: {
				mode: 0,
				difficulty: 0,
				size: (window.innerWidth < 800 ? 2.5 : 5),
				quantity: 100,
				speed: 0
			},
			// SETTINGS
			simulationSettings: {
				size: (window.innerWidth < 800 ? 2.5 : 5),
				speed: 1,
				quantity: 200,
				deactivateAfter: 0,
				showTime: true,
				showStats: true,
				autorestart: true
			}
		}
		this.interval = null;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		
		this.stop = stop.bind(this);
		this.startSimulation = startSimulation.bind(this);
		this.startGame = startGame.bind(this);
		this.pause = pause.bind(this);
		this.unpause = unPause.bind(this);
		
		this.toggleDialog = this.toggleDialog.bind(this);
		this.toggleSimulationPause = this.toggleSimulationPause.bind(this);
		this.toggleGamePause = this.toggleGamePause.bind(this);
		this.intervalTime = this.intervalTime.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleRefocus = this.handleRefocus.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		// GAME
		this.gameRestart = this.gameRestart.bind(this);
		this.stopStartGame = this.stopStartGame.bind(this);
		this.setGameSettings = this.setGameSettings.bind(this);
		this.toggleGameDialog = this.toggleGameDialog.bind(this);
		// SIMULATION
		this.simulationRestart= this.simulationRestart.bind(this);
		this.toggleShareDialog = this.toggleShareDialog.bind(this);
		this.stopStartSimulation = this.stopStartSimulation.bind(this);
		this.setSimulationSettings = this.setSimulationSettings.bind(this);
		this.toggleSimulationDialog = this.toggleSimulationDialog.bind(this);
		this.toggleNavbarVisibility = this.toggleNavbarVisibility.bind(this);
		this.toggleNavbarItemsExpand = this.toggleNavbarItemsExpand.bind(this);
	}
	componentDidMount() {
		this.startSimulation(true);
		window.addEventListener('resize', this.handleResize);
		window.addEventListener("blur", this.handleBlur);
		window.addEventListener("focus", this.handleRefocus);
		this.interval = setDriftlessInterval(this.intervalTime, 1000);
	}
	componentDidCatch(error, errorInfo) {
		// logErrorToMyService(error, errorInfo);
	}
	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}
	componentWillUnmount() {
		clearDriftless(this.interval);
		this.simulationApp && this.simulationApp.destroy(true);
		this.gameApp && this.gameApp.destroy(true);
	}
	intervalTime() {
		this.setState(prevState => {
			// in case of simulation /game either stopped or paused 
			if ((this.state.isSimulationActive && (this.state.simulationPaused || this.state.simulationStopped)) || 
				(this.state.isGameActive && (this.state.gamePaused || this.state.gameStopped))
			) {
				// stop calculating currentTime because of deactivate time
				return ({ currentTime: prevState.currentTime })
			}
			// if simulation / game is not paused, calculate start time a new
			return ({ currentTime: new Date().getTime(), startTime: new Date(prevState.startTime.getTime() + 1000) })
		});
	}
	handleBlur() {
		if (this.state.isGameActive && !this.state.gamePaused) {
			this.toggleDialog();
		}
	}
	handleRefocus() {
		if (this.state.isGameActive && this.state.gamePaused) {
			this.toggleDialog();
		}
	}
	handleResize(e) {
		this.canvasWidth = window.innerWidth < this.canvasWidth ? this.canvasWidth : window.innerWidth;
		this.canvasHeight = window.innerHeight < this.canvasHeight ? this.canvasHeight : window.innerHeight;
	}
	toggleDialog() {
		if (this.state.isSimulationActive) {
			this.toggleSimulationDialog();
		} else {
			this.toggleGameDialog();
		}
	}
	// SIMULATION
	stopStartSimulation() {
		if (this.state.simulationPaused && !this.state.simulationStopped) { // CONTINUE
			this.toggleSimulationDialog();
		} else { 			
			this.stop();						// START
			this.startSimulation(true);
			this.setState(prevState => ({ startTime: new Date(0), simulationStopped: false, simulationPaused: false, startButtonText: "CONTINUE SIMULATION", 
									simulationSettingsOpen: false, healthy: prevState.simulationSettings["quantity"] - 1, contagious: 1  }));
		}
	}
	simulationRestart() {
		this.stop();
		this.startSimulation(true);
		this.setState(prevState => ({ startTime: new Date(0), simulationStopped: false, simulationPaused: false, startButtonText: "CONTINUE SIMULATION", simulationSettingsOpen: false,
					healthy: prevState.simulationSettings["quantity"] - 1, contagious: 1 }));
	}
	setSimulationSettings(e) {
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
			const newSimulationSettings = {...prevState.simulationSettings, ...parsedData};			
			// only reset simulation for size and quantity - for preview
			if (parsedData["size"] || parsedData["quantity"] || parsedData["speed"]) {
				this.stop();
				this.startSimulation(false, newSimulationSettings);
				return ({ simulationSettings: newSimulationSettings, startTime: new Date(0), healthy: newSimulationSettings["quantity"] - 1, 
						contagious: 1, simulationStopped: true, simulationPaused: true, startButtonText: "START SIMULATION" });
			}
			return ({ simulationSettings: newSimulationSettings });
		}); 
	}
	// GAME
	stopStartGame() {
		if (this.state.gamePaused && !this.state.gameStopped) { // CONTINUE
			this.toggleGameDialog();
		} else {								// START
			this.stop();
			this.startGame(true);
			this.setState(prevState => ({ startTime: new Date(0), gameStopped: false, gamePaused: false, startButtonText: "CONTINUE GAME", 
									gameSettingsOpen: false, healthy: prevState.gameSettings["quantity"] - 1, contagious: 1 }));
		}
	}	
	gameRestart() {
		this.stop();
		this.startGame(true);
		this.setState(prevState => ({ startTime: new Date(0), gameStopped: false, gamePaused: false, startButtonText: "CONTINUE SIMULATION", gameSettingsOpen: false,
					healthy: prevState.gameSettings["quantity"] - 1, contagious: 1 }));
	}
	setGameSettings(e) {
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
			// only reset game for size and quantity - for preview
			this.stop();
			this.startGame(false, newGameSettings);
			return ({ gameSettings: newGameSettings, healthy: newGameSettings["quantity"] - 1, 
					contagious: 1, gameStopped: true, gamePaused: true, startButtonText: "START GAME" });
		}); 
	}
	toggleSimulationPause() {
		return this.state.simulationPaused && !this.state.simulationStopped ? this.unpause() : this.pause();
	}
	toggleGamePause() {
		return this.state.gamePaused && !this.state.gameStopped ? this.unpause() : this.pause();
	}
	toggleShareDialog(e) {
		if (this.state.isSimulationActive) {
			this.toggleSimulationPause();
			this.setState(prevState => ({ simulationPaused: !prevState.simulationPaused, shareModalOpen: !prevState.shareModalOpen }));
		} else {
			this.toggleGamePause();
			this.setState(prevState => ({ gamePaused: !prevState.gamePaused, shareModalOpen: !prevState.shareModalOpen }));
		}
		setTimeout(() => {
			this.setState({ isCopied: false });
		}, 1000);
	}
	toggleSimulationDialog() {
		if (this.state.isGameActive) {
			this.stop();
			// only when clicking on navbar link -> stop game and show dialog
			this.setState(prevState => {
				return ({ 
					simulationSettingsOpen: true, 
					simulationPaused: true, 
					startButtonText: "START SIMULATION", 
					isSimulationActive: true, 
					isGameActive: false, 
					gamePaused: true, 
					gameStopped: true 
				})
			});
		} else {
			// in all other cases toggle
			this.toggleSimulationPause();
			this.setState(prevState => {
				return ({ 
					simulationSettingsOpen: !prevState.simulationSettingsOpen, 
					simulationPaused: !prevState.simulationPaused, 
					startButtonText: prevState.simulationStopped ? "START SIMULATION" : "CONTINUE SIMULATION", 
					isSimulationActive: true, 
					isGameActive: false, 
					gamePaused: true, 
					gameStopped: true 
				})
			});
		}
	}
	toggleGameDialog() {
		if (this.state.isSimulationActive) {
			this.stop();
			// only when clicking on navbar link -> stop simulation and show dialog
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
	toggleNavbarItemsExpand() {
		this.setState(prevState => ({ isNavbarExpanded: !prevState.isNavbarExpanded}));
	}
	toggleNavbarVisibility() {
		this.setState(prevState => ({ isNavbarVisible: !prevState.isNavbarVisible}));
	}
	copyToClipboard() {		
		navigator.permissions.query({name: "clipboard-write"})
			.then(result => {
				if (result.state === "granted" || result.state === "prompt") {
					navigator.clipboard.writeText("https://www.covidsimulator.com");
					this.setState({ isCopied: true });
				}
		 	});
	}

	render() {
		return (
			<section className="main">
				<NavBar 
					currentTime={this.state.currentTime}
					startTime={this.state.startTime}
					toggleNavbarItemsExpand={this.toggleNavbarItemsExpand} 
					toggleNavbarVisibility={this.toggleNavbarVisibility}
					isNavbarExpanded={this.state.isNavbarExpanded}
					isNavbarVisible={this.state.isNavbarVisible}
					toggleSimulationDialog={this.toggleSimulationDialog}
					toggleShareDialog={this.toggleShareDialog}
					toggleGameDialog={this.toggleGameDialog}
					simulationSettings={this.state.simulationSettings}
					gameSettings={this.state.gameSettings}
					isSimulationActive={this.state.isSimulationActive}
					contagious={this.state.contagious}
					healthy={this.state.healthy}
				/>
				<SimulationDialog
					startSimulation={this.stopStartSimulation}
					isSimulationActive={this.state.isSimulationActive}
					isOpen={this.state.simulationSettingsOpen} 
					toggle={this.toggleSimulationDialog}
					buttonText={this.state.startButtonText}
					settings={this.state.simulationSettings}
					setSimulationSettings={this.setSimulationSettings}
				/>
				<GameDialog
					startGame={this.stopStartGame}
					isOpen={this.state.gameSettingsOpen} 
					isGameActive={this.state.isGameActive}
					toggle={this.toggleGameDialog}
					buttonText={this.state.startButtonText}
					settings={this.state.gameSettings}
					setGameSettings={this.setGameSettings}
				/>
				<ShareDialog 
					isOpen={this.state.shareModalOpen}
					toggle={this.toggleShareDialog}
					copy={this.copyToClipboard}
					isCopied={this.state.isCopied}				
				/>
				<article id="canvas-container" onClick={this.toggleDialog}>
				</article>
			</section>
		);
	}
}

/*
	<canvas 
		onClick={this.toggleDialog}
		id="canvas"
		ref={this.canvasRef} 
		className="canvas" 
	>Sorry, your browser doesn't support HTML5 </canvas>
*/