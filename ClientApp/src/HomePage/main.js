import React from "react";
import { clearDriftless, setDriftlessInterval } from 'driftless';

import { startSimulation, startGame, stop, pause, unPause } from "./helpers/actions";
import { SimulationDialog, NavBar, ShareDialog, GameDialog, QuarantineButtons } from "./components";
import { simulationSettings, stopStartSimulation, simulationRestart, setSimulationSettings, 
	toggleSimulationPause, toggleSimulationDialog } from "./helpers/simulation/simulationState";
import { gameSettings, setGameSettings, onMouseMove, shuffle, stopStartGame, gameRestart, 
	setQuarantineInMotion, setQuarantineNonactive, toggleGamePause, toggleGameDialog, resetDraggedQuarantineId } from "./helpers/game/gameState";


import 'bootstrap/dist/css/bootstrap.css';
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.autostart = true;
		this.simulationApp = null;
		this.gameApp = null;

		this.state = {
			...simulationSettings,
			...gameSettings,
			hasError: false, 
			error: null,
			// time
			currentTime: new Date().getTime(),
			clockTime: new Date(0),
			// canvas state
			contagious: 1,
			healthy: 199,
			// nav & buttons
			startButtonText: "CONTINUE SIMULATION",
			isCopied: false,
			isNavbarExpanded: false,
			isNavbarVisible: true,
			// modals - popups
			shareModalOpen: false
		}

		this.interval = null;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		
		this.stop = stop.bind(this);
		this.startSimulation = startSimulation.bind(this);
		this.startGame = startGame.bind(this);
		this.pause = pause.bind(this);
		this.unpause = unPause.bind(this);

		this.shuffle = shuffle.bind(this);
		this.toggleDialog = this.toggleDialog.bind(this);
		this.onMouseMove = onMouseMove.bind(this);
		this.toggleSimulationPause = toggleSimulationPause.bind(this);
		this.toggleGamePause = toggleGamePause.bind(this);
		this.intervalTime = this.intervalTime.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleRefocus = this.handleRefocus.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		// GAME
		this.gameRestart = gameRestart.bind(this);
		this.stopStartGame = stopStartGame.bind(this);
		this.setGameSettings = setGameSettings.bind(this);
		this.toggleGameDialog = toggleGameDialog.bind(this);
		this.setQuarantineInMotion = setQuarantineInMotion.bind(this);
		this.setQuarantineNonactive = setQuarantineNonactive.bind(this);
		this.resetDraggedQuarantineId = resetDraggedQuarantineId.bind(this);
		// SIMULATION
		this.simulationRestart= simulationRestart.bind(this);
		this.toggleShareDialog = this.toggleShareDialog.bind(this);
		this.stopStartSimulation = stopStartSimulation.bind(this);
		this.setSimulationSettings = setSimulationSettings.bind(this);
		this.toggleSimulationDialog = toggleSimulationDialog.bind(this);
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
			return ({ currentTime: new Date().getTime(), clockTime: new Date(prevState.clockTime.getTime() + 1000) })
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

	toggleDialog(e) {
		const target = e && e.currentTarget || null;
		// on simulation -> show dialog
		if (this.state.isSimulationActive) {
			this.toggleSimulationDialog();
		// on quarantineButtonsActive -> should trigger quarantineDrop - user should have quarantine attached to cursor
		} else if (this.state.quarantineBeingDragged && !this.state.quarantineDropped) {
			// overlap check - dont'l let the user lay quarantine down
			if (!this.state.quarantineOverlapping) {
				this.setState({
					quarantineBeingDragged: false,
					quarantineButtonsActive: true,
					quarantineDropped: true,
				});
			}
		} else {
			this.toggleGameDialog();
		}
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
					clockTime={this.state.clockTime}
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
					isGameActive={this.state.isGameActive}
					gamePaused={this.state.gamePaused}
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
				<QuarantineButtons 
					quarantineButtonsActive={this.state.quarantineButtonsActive}
					setQuarantineInMotion={this.setQuarantineInMotion}
				/>
				<article 
					id="canvas-container" 
					onClick={this.toggleDialog}
					onMouseMove={this.onMouseMove}
					>
				</article>
			</section>
		);
	}
}
