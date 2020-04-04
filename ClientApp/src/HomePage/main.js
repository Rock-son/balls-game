import React from "react";
import { clearDriftless, setDriftlessInterval } from 'driftless';

import { start, stop, pause, unPause } from "./helpers/actions";
import { SimulationModal, NavBar, ShareModal } from "./components";

import 'bootstrap/dist/css/bootstrap.css';
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
		this.autostart = true;
		this.simulationApp = null;
		this.ticker = null;
		this.loader = null;

		this.state = {
			// playing choice
			simulation: true,
			game: false,
			// error handling
			hasError: false, 
			error: null,
			// current time
			currentTime: new Date().getTime(),
			// canvas state
			pause: false,
			stop: false,
			// nav & buttons
			startButtonText: "STOP SIMULATION",
			isCopied: false,
			isNavbarExpanded: false,
			isNavbarVisible: true,
			// modals - popups
			shareModalTitle: "",
			shareModalOpen: false,
			simulationSettingsOpen: false,
			// SIMULATION
			simulationSettings: {
				size: 9,
				speed: 2,
				quantity: "50",
				deactivateAfter: "0",
				showTime: true,
				showStats: true,
				autorestart: true
			}
		}
		this.interval = null;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		
		this.simulationStop = stop.bind(this);
		this.simulationStart = start.bind(this);
		this.simulationPause = pause.bind(this);
		this.simulationUnPause = unPause.bind(this);
		
		this.togglePause = this.togglePause.bind(this);
		this.intervalTime = this.intervalTime.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.toggleShareModal = this.toggleShareModal.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		this.stopStartSimulation = this.stopStartSimulation.bind(this);
		this.setSimulationSettings = this.setSimulationSettings.bind(this);
		this.toggleSimulationDialog = this.toggleSimulationDialog.bind(this);
		this.toggleNavbarVisibility = this.toggleNavbarVisibility.bind(this);
		this.toggleNavbarItemsExpand = this.toggleNavbarItemsExpand.bind(this);
	}
	componentDidMount() {
		this.simulationStart(true);
		window.addEventListener('resize', this.handleResize)
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
		this.simulationApp.destroy(true);
	}
	intervalTime() {
		this.setState({currentTime: new Date().getTime()});
	}
	handleResize(e) {
		this.canvasWidth = window.innerWidth < this.canvasWidth ? this.canvasWidth : window.innerWidth;
		this.canvasHeight = window.innerHeight < this.canvasHeight ? this.canvasHeight : window.innerHeight;
	}
	stopStartSimulation() {
		if (!this.state.stop) { // STOP
			this.simulationStop();
			this.setState(prevState => ({ stop: true, pause: true, startButtonText: "START SIMULATION" }));
		} else { 				//PLAY
			this.simulationStart(true);
			this.setState(prevState => ({ stop: false, pause: false, startButtonText: "STOP SIMULATION", simulationSettingsOpen: false }));
		}
	}
	setSimulationSettings(e) {
		const targetData = e.currentTarget.getAttribute("data-option");
		const parsedData = JSON.parse(targetData) || {};
		this.setState(prevState => {
			const newSimulationSettings = {...prevState.simulationSettings, ...parsedData};
			if (parsedData["size"] || parsedData["quantity"]) {
				this.simulationStop();
				this.simulationStart(false, newSimulationSettings);
			}
			return ({ simulationSettings: newSimulationSettings, stop: true, pause: true, startButtonText: "START SIMULATION" });
		}); 
	}
	togglePause() {
		return this.state.pause && !this.state.stop ? this.simulationUnPause() : this.simulationPause();
	}
	toggleShareModal(e) {
		this.togglePause();
		const target = e.currentTarget;
		const isGame = target.getAttribute("data");
		this.setState(prevState => ({ pause: !prevState.pause, shareModalOpen: !prevState.shareModalOpen, shareModalTitle: isGame ? "GAME COMING SOON" : ""}));
		setTimeout(() => {
			this.setState({ isCopied: false });
		}, 1000);
	}
	toggleSimulationDialog() {
		// unPause if previous state was pause, etc.
		this.togglePause();
		this.setState(prevState => {
			return ({ simulationSettingsOpen: !prevState.simulationSettingsOpen, pause: !prevState.pause })
		});
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
				if (result.state == "granted" || result.state == "prompt") {
					navigator.clipboard.writeText("https://www.covidsimulator.com");
					this.setState({ isCopied: true });
				}
		 	});
	}

	render() {
		return (
			<section className="main">
				<NavBar 
					toggleNavbarItemsExpand={this.toggleNavbarItemsExpand} 
					toggleNavbarVisibility={this.toggleNavbarVisibility}
					isNavbarExpanded={this.state.isNavbarExpanded}
					isNavbarVisible={this.state.isNavbarVisible}
					toggleSimulationDialog={this.toggleSimulationDialog}
					toggleShareModal={this.toggleShareModal}
				/>
				<SimulationModal
					startSimulation={this.stopStartSimulation}
					isOpen={this.state.simulationSettingsOpen} 
					toggle={this.toggleSimulationDialog}
					buttonText={this.state.startButtonText}
					settings={this.state.simulationSettings}
					setSimulationSettings={this.setSimulationSettings}
				/>
				<ShareModal 
					isOpen={this.state.shareModalOpen}
					toggle={this.toggleShareModal}
					copy={this.copyToClipboard}
					isCopied={this.state.isCopied}
					shareModalTitle={this.state.shareModalTitle}
				
				/>
				<article className="main__canvas">
					<canvas 
						onClick={this.toggleSimulationDialog}
						id="canvas"
						ref={this.canvasRef} 
						className="canvas" 
					>Sorry, your browser doesn't support HTML5 </canvas>
				</article>
			</section>
		);
	}
}