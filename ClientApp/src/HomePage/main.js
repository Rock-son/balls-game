import React from "react";
import { clearDriftless, setDriftlessInterval } from 'driftless';

import _draw from "./helpers/_draw";
import { SimulationModal, NavBar, ShareModal } from "./components";

import 'bootstrap/dist/css/bootstrap.css';
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();

		this.state = {
			// playing choice
			simulation: true,
			game: false,
			// operation
			speed: 1,
			density: null,
			// error handling
			hasError: false, 
			error: null,
			// current time
			currentTime: new Date().getTime(),
			// canvas state
			canvasAnimating: true,
			pause: false,
			stop: true,
			// nav & buttons
			startButtonText: "STOP SIMULATION",
			isNavbarExpanded: false,
			isNavbarVisible: true,
			// modals - popups
			shareModalTitle: "",
			shareModalOpen: true,
			simulationModalOpen: false,
			simulationOptions: {
				size: 6,
				speed: 1,
				quantity: "250",
				deactivateAfter: "0",
				showTime: true,
				showStats: true,
				autorestart: true
			}
		}
		this.interval = null;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		
		this._draw = _draw.bind(this);
		this.playPause = this.playPause.bind(this);
		this.intervalTime = this.intervalTime.bind(this);
		this.toggleShareModal = this.toggleShareModal.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		this.stopStartSimulation = this.stopStartSimulation.bind(this);
		this.setSimulationOptions = this.setSimulationOptions.bind(this);
		this.toggleSimulationModal = this.toggleSimulationModal.bind(this);
		this.toggleNavbarVisibility = this.toggleNavbarVisibility.bind(this);
		this.toggleNavbarItemsExpand = this.toggleNavbarItemsExpand.bind(this);
	}
	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}
	componentDidCatch(error, errorInfo) {
		// logErrorToMyService(error, errorInfo);
	}
	componentDidMount() {
		this.interval = setDriftlessInterval(this.intervalTime, 1000);
		this._draw();
	}
	componentWillUnmount() {
		clearDriftless(this.interval);
	}
	intervalTime() {
		this.setState({currentTime: new Date().getTime()});
	}
	// DEPRECATED
	playPause() {		
		const { canvasAnimating } = this.state;
		if (canvasAnimating) {
			this.shouldAnimationStop = true;
			this.setState({ stop: false, canvasAnimating: false, pause: true, startButtonText: "Resume Simulation" });
		} else {
			this.shouldAnimationStop = false;
			this.setState({ stop: false, canvasAnimating: true, pause: false, startButtonText: "Pause Simulation" });
		}
	}
	stopStartSimulation() {
		if (!this.state.stop) { // STOP
			this.setState({ stop: true, canvasAnimating: false, pause: true, startButtonText: "START SIMULATION" });			
		} else { 				//PLAY
			this.setState({ stop: false, canvasAnimating: true, pause: false, startButtonText: "STOP SIMULATION" });
			this._draw();	
		}
	}
	setSimulationOptions(e) {
		const targetData = e.currentTarget.getAttribute("data-option");
		const parsedData = JSON.parse(targetData) || {};
		this.setState(prevState => ({ simulationOptions: {...prevState.simulationOptions, ...parsedData}}));
	}
	toggleShareModal(e) {
		const target = e.currentTarget;
		const game = target.getAttribute("data");
		this.setState(prevState => ({ shareModalOpen: !prevState.shareModalOpen, shareModalTitle: game ? "GAME COMING SOON" : ""}));
	}
	toggleSimulationModal() {
		this.setState(prevState => ({ simulationModalOpen: !prevState.simulationModalOpen}));
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
					toggleSimulationModal={this.toggleSimulationModal}
					toggleShareModal={this.toggleShareModal}
				/>
				<SimulationModal
					startSimulation={this.stopStartSimulation}
					isOpen={this.state.simulationModalOpen} 
					toggle={this.toggleSimulationModal}
					buttonText={this.state.startButtonText}
					options={this.state.simulationOptions}
					setSimulationOptions={this.setSimulationOptions}
				/>
				<ShareModal 
					isOpen={this.state.shareModalOpen}
					toggle={this.toggleShareModal}
					copy={this.copyToClipboard}
					shareModalTitle={this.state.shareModalTitle}
				
				/>
				<article className="main__right">
					<canvas 
						id="canvas"
						ref={this.canvasRef} 
						className="canvas" 
						width={this.canvasWidth} 
						height={this.canvasHeight}
					/>
				</article>
			</section>
		);
	}
}