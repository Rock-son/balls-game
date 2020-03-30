import React from "react";
import { Row, Navbar, Nav, NavbarToggler,
			Collapse, NavItem, NavLink, NavbarText } from "reactstrap";
import { clearDriftless } from 'driftless';

import _draw from "./helpers/_draw";
import { SimulationModal } from "./components";

import 'bootstrap/dist/css/bootstrap.css';
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();

		this.state = { 
			// operation
			speed: 1,
			density: null,
			// react functionality
			hasError: false, 
			error: null,
			// deprecated buttons
			canvasAnimating: true,
			pause: false,
			stop: false,
			simulationModalOpen: true,
			startButtonText: "STOP SIMULATION",
			// nav item buttons
			isNavBarOpen: false,
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
		this.toggleNavItems = this.toggleNavItems.bind(this);
		this.stopStartSimulation = this.stopStartSimulation.bind(this);
		this.setSimulationOptions = this.setSimulationOptions.bind(this);
		this.toggleSimulationModal = this.toggleSimulationModal.bind(this);
	}
	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}
	componentDidCatch(error, errorInfo) {
		// logErrorToMyService(error, errorInfo);
	}
	componentDidMount() {
		this._draw();
	}
	componentWillUnmount() {
		clearDriftless(this.interval);
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
	toggleSimulationModal() {
		this.setState(prevState => ({ simulationModalOpen: !prevState.simulationModalOpen}));
	}
	toggleNavItems() {
		this.setState(prevState => ({ isNavBarOpen: !prevState.isNavBarOpen}));
	}

	render() {
		return (
			<section className="main">
				<Navbar dark className="main__navbar d-inline-flex justify-content-between" >
					<Navbar dark className="col-6 main__navbar__left d-inline-flex justify-content-between" expand="sm">
						<NavbarToggler onClick={this.toggleNavItems} />
						<Collapse isOpen={this.state.isNavBarOpen} navbar>
						<Nav className="navbar__nav left" navbar>
							<NavItem>
								<NavLink onClick={this.toggleSimulationModal} className="navbar__nav__link">Simulate</NavLink>
							</NavItem>
							<NavItem>
								<NavLink className="d-none d-sm-block navbar__nav__separator">|</NavLink>
							</NavItem>
							<NavItem>
								<NavLink className="navbar__nav__link">Play game</NavLink>
							</NavItem>
							<NavItem>
								<NavLink className="d-none d-sm-block navbar__nav__separator">|</NavLink>
							</NavItem>
							<NavItem>
								<NavLink className="navbar__nav__link">Share</NavLink>
							</NavItem>
							<NavItem>
								<NavLink className="d-none d-sm-block navbar__nav__separator">|</NavLink>
							</NavItem>
							<NavItem>
								<NavLink className="navbar__nav__link">Hide</NavLink>
							</NavItem>
						</Nav>
						</Collapse>
					</Navbar>
					<Navbar dark className="col-6 main__navbar__right d-inline-flex justify-content-between" >
						<Nav className="navbar__nav caption" navbar>
							<NavItem>TheCovidSimulator</NavItem>
						</Nav>
						<Nav className="navbar__nav right " navbar>
							<NavItem className=" d-inline-flex justify-content-between">
								<NavbarText>Stay safe. For more visit&nbsp;</NavbarText>
								<NavLink href="https://www.countdownkings.com/">CountdownKings.com</NavLink>
							</NavItem>
						</Nav>
					</Navbar>
				</Navbar>
				<SimulationModal
					startSimulation={this.stopStartSimulation}
					isOpen={this.state.simulationModalOpen} 
					toggle={this.toggleSimulationModal}
					buttonText={this.state.startButtonText}
					options={this.state.simulationOptions}
					setSimulationOptions={this.setSimulationOptions}
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