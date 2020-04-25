import React from "react";
import { clearDriftless, setDriftlessInterval } from 'driftless';

import { startSimulation, startGame, stop, pause, unPause } from "./helpers/actions";
import { SimulationDialog, NavBar, ShareDialog, GameDialog, QuarantineButtons, TimeChallengeEndDialog,
	HowToPlayDialog, TimeOpenEndDialog, AboutDialog, StaySafeDialog, BeatYourFriendDialog, ContactDialog } from "./components";
import { simulationSettings, stopStartSimulation, simulationRestart, setSimulationSettings,
	toggleSimulationPause, toggleSimulationDialog, toggleSimulationDialogAfterNoRestart } from "./helpers/simulation/simulationState";
import { gameSettings, setGameSettings, onMouseMove, stopStartGame, onWheelScroll, onContextMenuHideQuarantine, gameEnded, resetQuarantineExpiration,
	setQuarantineInMotion, setQuarantineInactive, setButtonStatus, toggleGamePause, toggleGameDialog, resetDraggedQuarantineId, closeGameEndDialog } from "./helpers/game/gameState";

import 'bootstrap/dist/css/bootstrap.css';
import "./main.scss";
import soundQuarantine from "./assets/snd-quarantine.mp3";

//import Modernizr from "../modernizr"

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.autostart = true;
		this.simulationApp = null;
		this.gameApp = null;
		this.gameTimeoutId = null;
		this.audioTimeoutId = null;

		this.state = {
			...simulationSettings,
			...gameSettings,
			hasError: false,
			error: null,
			isCopied: false,
			// time
			currentTime: new Date().getTime(),
			clockTime: new Date(0),
			// canvas state
			contagious: 1,
			healthy: simulationSettings.simulationSettings["quantity"] - 1,
			healed: 0,
			// nav & buttons
			startButtonText: "CONTINUE SIMULATION",
			isNavbarExpanded: false,
			isNavbarVisible: true,
			// modals - popups
			shareDialogOpen: false,
			aboutDialogOpen: false,
			contactDialogOpen: false,
			staySafeDialogOpen: false,
			howToPlayDialogOpen: false,
			beatYourFriendDialogOpen: false
		}

		this.interval = null;
		this.canvasWidth = window.innerWidth < 800 ? 800 : window.innerWidth;
		this.canvasHeight = window.innerHeight < 600 ? 600 : window.innerHeight;

		this.stop = stop.bind(this);
		this.startSimulation = startSimulation.bind(this);
		this.startGame = startGame.bind(this);
		this.pause = pause.bind(this);
		this.unpause = unPause.bind(this);
		// DIALOGS
		this.toggleDialog = this.toggleDialog.bind(this);
		this.toggleGamePause = toggleGamePause.bind(this);
		this.toggleAboutDialog = this.toggleAboutDialog.bind(this);
		this.toggleSimulationPause = toggleSimulationPause.bind(this);
		this.toggleContactDialog = this.toggleContactDialog.bind(this);
		this.toggleStaySafeDialog = this.toggleStaySafeDialog.bind(this);
		this.toggleHowToPlayDialog = this.toggleHowToPlayDialog.bind(this);
		this.toggleBeatYourFriendDialog = this.toggleBeatYourFriendDialog.bind(this);
		this.toggleSimulationDialogAfterNoRestart = toggleSimulationDialogAfterNoRestart.bind(this);
		// EVENTS
		this.onMouseMove = onMouseMove.bind(this);
		this.intervalTime = this.intervalTime.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.copyUriToClipboard = this.copyUriToClipboard.bind(this);
		this.copyMailToClipboard = this.copyMailToClipboard.bind(this);		
		// GAME
		this.gameEnded = gameEnded.bind(this);
		this.stopStartGame = stopStartGame.bind(this);
		this.onWheelScroll = onWheelScroll.bind(this);
		this.setButtonStatus = setButtonStatus.bind(this);
		this.setGameSettings = setGameSettings.bind(this);
		this.toggleGameDialog = toggleGameDialog.bind(this);
		this.closeGameEndDialog = closeGameEndDialog.bind(this);
		this.beatYourFriendLink = this.beatYourFriendLink.bind(this);
		this.setQuarantineInMotion = setQuarantineInMotion.bind(this);
		this.setQuarantineInactive = setQuarantineInactive.bind(this);
		this.resetDraggedQuarantineId = resetDraggedQuarantineId.bind(this);
		this.onContextMenuHideQuarantine = onContextMenuHideQuarantine.bind(this);
		this.resetQuarantineExpiration = resetQuarantineExpiration.bind(this);
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
		if (window.location.search !== "") {
			this.startGame(false);
			this.setState({ beatYourFriendDialogOpen: true, gameStopped: true, gamePaused: true, isGameActive: true });
		} else {
			this.startSimulation(true);
		}
			window.addEventListener('resize', this.handleResize);
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
	handleResize(e) {
		this.canvasWidth = window.innerWidth < this.canvasWidth ? this.canvasWidth : window.innerWidth;
		this.canvasHeight = window.innerHeight < this.canvasHeight ? this.canvasHeight : window.innerHeight;
	}

	toggleDialog(e) {
		// on simulation -> show dialog
		if (this.state.isSimulationActive) {
			this.toggleSimulationDialog();
		// on quarantineButtonsActive -> should trigger quarantineDrop - user should have quarantine attached to cursor
		} else if (this.state.quarantineBeingDragged && !this.state.quarantinePlaced) {
			// overlap check - dont'l let the user lay quarantine down
			if (!this.state.quarantineOverlapping) {
				this.setState({
					quarantineBeingDragged: false,
					quarantineButtonsActive: true,
					quarantinePlaced: true,
				});
				const audio = new Audio(soundQuarantine);
				audio.play();
			}
		} else {
			this.toggleGameDialog();
		}
	}
	toggleAboutDialog(e){
		e && e.preventDefault();
		e && e.stopPropagation();
		if (this.state.isSimulationActive) {
			this.toggleSimulationPause();
			this.setState(prevState => ({ simulationPaused: !prevState.simulationPaused, aboutDialogOpen: !prevState.aboutDialogOpen }));
		} else {
			this.toggleGamePause();
			this.setState(prevState => ({ gamePaused: !prevState.gamePaused, aboutDialogOpen: !prevState.aboutDialogOpen }));
		}
	}
	toggleShareDialog(e) {
		e && e.preventDefault();
		e && e.stopPropagation();
		if (this.state.isSimulationActive) {
			this.toggleSimulationPause();
			this.setState(prevState => ({ simulationPaused: !prevState.simulationPaused, shareDialogOpen: !prevState.shareDialogOpen }));
		} else {
			this.toggleGamePause();
			this.setState(prevState => ({ gamePaused: !prevState.gamePaused, shareDialogOpen: !prevState.shareDialogOpen }));
		}
		setTimeout(() => {
			this.setState({ isCopied: false });
		}, 1000);
	}
	toggleContactDialog(e) {
		e && e.preventDefault();
		e && e.stopPropagation();
		if (this.state.isSimulationActive) {
			this.toggleSimulationPause();
			this.setState(prevState => ({ simulationPaused: !prevState.simulationPaused, contactDialogOpen: !prevState.contactDialogOpen }));
		} else {
			this.toggleGamePause();
			this.setState(prevState => ({ gamePaused: !prevState.gamePaused, contactDialogOpen: !prevState.contactDialogOpen }));
		}
		setTimeout(() => {
			this.setState({ isCopied: false });
		}, 1000);
	}
	toggleStaySafeDialog(e) {
		e && e.preventDefault();
		e && e.stopPropagation();
		if (this.state.isSimulationActive) {
			this.toggleSimulationPause();
			this.setState(prevState => ({ simulationPaused: !prevState.simulationPaused, staySafeDialogOpen: !prevState.staySafeDialogOpen}));
		} else {
			this.toggleGamePause();
			this.setState(prevState => ({ gamePaused: !prevState.gamePaused, staySafeDialogOpen: !prevState.staySafeDialogOpen}));
		}
	}
	toggleHowToPlayDialog(e) {
		if (this.state.isSimulationActive) {
			this.toggleSimulationPause();
			this.setState(prevState => ({ simulationPaused: !prevState.simulationPaused, howToPlayDialogOpen: !prevState.howToPlayDialogOpen}));
		} else {
			this.toggleGamePause();
			this.setState(prevState => ({ gamePaused: !prevState.gamePaused, howToPlayDialogOpen: !prevState.howToPlayDialogOpen}));
		}
	}
	toggleBeatYourFriendDialog() {
		this.toggleGameDialog();
		this.setState(prevState => ({ beatYourFriendDialogOpen: !prevState.beatYourFriendDialogOpen}));
	}
	beatYourFriendLink() {

	}
	toggleNavbarItemsExpand(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState(prevState => ({ isNavbarExpanded: !prevState.isNavbarExpanded}));
	}
	toggleNavbarVisibility(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState(prevState => ({ isNavbarVisible: !prevState.isNavbarVisible}));
	}
	copyUriToClipboard() {
		navigator.permissions.query({name: "clipboard-write"})
			.then(result => {
				if (result.state === "granted" || result.state === "prompt") {
					navigator.clipboard.writeText("https://www.viralballs.com");
					this.setState({ isCopied: true });
				}
		 	});
	}
	copyMailToClipboard() {
		navigator.permissions.query({name: "clipboard-write"})
			.then(result => {
				if (result.state === "granted" || result.state === "prompt") {
					navigator.clipboard.writeText("viralballs.simulator@gmail.com");
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
					onMouseMove={this.onMouseMove}
					onWheel={this.onWheelScroll}
					toggleNavbarItemsExpand={this.toggleNavbarItemsExpand}
					toggleNavbarVisibility={this.toggleNavbarVisibility}
					isNavbarExpanded={this.state.isNavbarExpanded}
					isNavbarVisible={this.state.isNavbarVisible}
					toggleSimulationDialog={this.toggleSimulationDialog}
					toggleShareDialog={this.toggleShareDialog}
					toggleGameDialog={this.toggleGameDialog}
					toggleAboutDialog={this.toggleAboutDialog}
					toggleStaySafeDialog={this.toggleStaySafeDialog}
					toggleDialog={this.toggleDialog}
					simulationSettings={this.state.simulationSettings}
					gameSettings={this.state.gameSettings}
					gameTimeDifficultyInSeconds={this.state.gameTimeDifficultyInSeconds}
					isSimulationActive={this.state.isSimulationActive}
					isGameActive={this.state.isGameActive}
					gamePaused={this.state.gamePaused}
					contagious={this.state.contagious}
					healthy={this.state.healthy}
					healed={this.state.healed}
					gameEnded={this.state.gameEnded}
				/>
				<SimulationDialog
					startSimulation={this.stopStartSimulation}
					isSimulationActive={this.state.isSimulationActive}
					isSimulationStopped={this.state.simulationStopped}
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
					isGameStopped={this.state.gameStopped}
					toggle={this.toggleGameDialog}
					buttonText={this.state.startButtonText}
					settings={this.state.gameSettings}
					gameTimeDifficultyInSeconds={this.state.gameTimeDifficultyInSeconds}
					setGameSettings={this.setGameSettings}
				/>
				<TimeChallengeEndDialog
					isGameActive={this.state.isGameActive}
					gameEnded={this.state.gameEnded}
					gameSettings={this.state.gameSettings}
					didPlayerWin={this.state.didPlayerWin}
					closeGameEndDialog={this.closeGameEndDialog}
				/>
				<TimeOpenEndDialog
					isGameActive={this.state.isGameActive}
					gameEnded={this.state.gameEnded}
					gameSettings={this.state.gameSettings}
					closeGameEndDialog={this.closeGameEndDialog}
					clockTime={this.state.clockTime}
				/>
				<ShareDialog
					isOpen={this.state.shareDialogOpen}
					toggle={this.toggleShareDialog}
					copy={this.copyUriToClipboard}
					isCopied={this.state.isCopied}
				/>
				<ContactDialog
					isOpen={this.state.contactDialogOpen}
					toggle={this.toggleContactDialog}
					copy={this.copyMailToClipboard}
					isCopied={this.state.isCopied}
				/>
				<AboutDialog
					isOpen={this.state.aboutDialogOpen}
					toggle={this.toggleAboutDialog}
					toggleStaySafeDialog={this.toggleStaySafeDialog}
					toggleContactDialog={this.toggleContactDialog}
				/>
				<StaySafeDialog
					isOpen={this.state.staySafeDialogOpen}
					toggle={this.toggleStaySafeDialog}
				/>
				<HowToPlayDialog
					startGame={this.stopStartGame}
					isOpen={this.state.howToPlayDialogOpen}
					toggle={this.toggleHowToPlayDialog}
					gameSettings={this.state.gameSettings}
				/>
				<BeatYourFriendDialog
					isOpen={this.state.beatYourFriendDialogOpen}
					toggle={this.toggleBeatYourFriendDialog}
					setGameSettings={this.setGameSettings}
					gameSettings={this.state.gameSettings}
					toggleGameDialog={this.toggleGameDialog}
				/>
				<QuarantineButtons
					clockTime={this.state.clockTime}
					isGameActive={this.state.isGameActive}
					activeQuarantines={this.state.activeQuarantines}
					availableQuarantines={this.state.availableQuarantines}
					setQuarantineInMotion={this.setQuarantineInMotion}
					quarantineAboutToExpire={this.state.quarantineAboutToExpire}
					isAnyButtonActive={this.state.isAnyButtonActive}
					isQuarantineBeingDragged={this.state.quarantineBeingDragged}
					setButtonStatus={this.setButtonStatus}
					quarantinePlaced={this.state.quarantinePlaced}
					quarantineCancelled={this.state.quarantineCancelled}
					resetQuarantineExpiration={this.resetQuarantineExpiration}
					gameStopped={this.state.gameStopped}
					healthyBalls={this.state.healthy}
					infectedBalls={this.state.contagious}
				/>
				<article
					id="canvas-container"
					onClick={this.toggleDialog}
					onPointerMove={this.onMouseMove}
					onWheel={this.onWheelScroll}
					onContextMenu={this.onContextMenuHideQuarantine}
					touch-action="auto"
				>
				</article>
				<article
					className={`simulator-fadein ${this.state.simulationRestarting || this.state.gameRestarting ? "visible" : ""}`}
					tabIndex="-1"
					role="presentation"
				>
				</article>
			</section>
		);
	}
}
