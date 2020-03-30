import React from "react";
import { Modal, Button, Row, Navbar, Nav, NavbarToggler,
			Collapse, NavItem, NavLink, NavbarText } from "reactstrap";
import { clearDriftless } from 'driftless';

import _draw from "./helpers/_draw";
import { DropDown } from "./components";

import 'bootstrap/dist/css/bootstrap.css';
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();

		this.state = { 
			// operation
			speed: 2,
			density: null,
			// react functionality
			hasError: false, 
			error: null,
			// deprecated buttons
			isPaneOpen: true,
			canvasAnimating: true,
			pause: true,
			stop: false,
			dropdownSizeOpen: false,
			dropdownQuantityOpen: false,
			startButtonText: "Pause Simulation",
			stopButtonText: "Stop Simulation",
			// nav item buttons
			isNavOpened: false,
		}
		this.interval = null;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;
		
		this.sizeItems = ["small", "medium", "large"];
		this.sizeQuantities = ["small", "medium", "large"];

		this._draw = _draw.bind(this);
		this.playPause = this.playPause.bind(this);
		this.stopButton = this.stopButton.bind(this);
		this.toggleTooltip = this.toggleTooltip.bind(this);
		this.toggleSizeOpen = this.toggleSizeOpen.bind(this);
		this.toggleNavItems = this.toggleNavItems.bind(this);
		this.toggleQuantityOpen = this.toggleQuantityOpen.bind(this);
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
	stopButton() {
		if (!this.state.stop) { // STOP
			this.setState({ stop: true, canvasAnimating: false, pause: true, startButtonText: "Simulation", stopButtonText: "Start Simulation" });			
		} else { 				//PLAY
			this.setState({ stop: false, canvasAnimating: true, pause: false, startButtonText: "Pause Simulation", stopButtonText: "Stop Simulation" });
			this._draw();	
		}
	}
	toggleTooltip() {
		this.setState(prevState => ({ isPaneOpen: !prevState.isPaneOpen }));
	}
	toggleSizeOpen() {
		this.setState(prevState => ({ dropdownSizeOpen: !prevState.dropdownSizeOpen}));
	}
	toggleQuantityOpen() {
		this.setState(prevState => ({ dropdownQuantityOpen: !prevState.dropdownQuantityOpen}));
	}

	toggleNavItems() {
		this.setState(prevState => ({ isNavOpened: !prevState.isNavOpened}));
	}

	render() {
		return (
			<section className="main">
				<Navbar dark className="main__navbar d-inline-flex justify-content-between" >
					<Navbar dark className="col-6 main__navbar__left d-inline-flex justify-content-between" expand="sm">
						<NavbarToggler onClick={this.toggleNavItems} />
						<Collapse isOpen={this.state.isNavOpened} navbar>
						<Nav className="navbar__nav left" navbar>
							<NavItem>
								<NavLink className="navbar__nav__link">Simulate</NavLink>
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


				<article className={`main__left main__left--${this.state.isPaneOpen ? "open" : "closed"}`}>
					<Button className="col-1 close-pane" onClick={this.toggleTooltip} >{this.state.isPaneOpen ? "<" : ">"} </Button>
					<Row>
						<Button 
							className={`offset-2 col-6 btn btn-primary btn-sm btn-${this.state.pause ? "success" : "warning"}`}
							disabled={this.state.stop}
							onClick={this.playPause}>
								{this.state.startButtonText}
						</Button>
					</Row>
					<Row>
						<Button 
							className={`offset-2 col-6 btn btn-primary btn-sm btn-${this.state.stop ? "success" : "danger"}`} 
							onClick={this.stopButton}>
								{this.state.stopButtonText}
						</Button>
					</Row>
					<br/>
					<Row>
						<DropDown 
							className="offset-2 col-6 dropdown" 
							dropdownOpen={this.state.dropdownSizeOpen}
							toggle={this.toggleSizeOpen}
							isDisabled={!this.state.stop}
							header="Choose Size"
							text="Particle size"
							items={this.sizeItems}
						/>
					</Row>
					<Row>
						<DropDown 
							className="offset-2 col-6 dropdown" 
							dropdownOpen={this.state.dropdownQuantityOpen}
							toggle={this.toggleQuantityOpen}
							isDisabled={!this.state.stop}
							header="Choose Quantity"
							text="Particle Quantity"
							items={this.sizeQuantities}
						/>
					</Row>
				</article>
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