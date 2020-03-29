import React from "react";
import { Tooltip, Button, Row } from "reactstrap";
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
			speed: 2,
			density: null, 
			hasError: false, 
			error: null,
			isPaneOpen: true,
			canvasAnimating: true,
			pause: false,
			stop: false,
			dropdownSizeOpen: false,
			dropdownQuantityOpen: false,
			startButtonText: "Pause Simulation",
			stopButtonText: "Stop Simulation"
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

	render() {
		return (
			<main className="main">
				<aside className={`main__left main__left--${this.state.isPaneOpen ? "open" : "closed"}`}>
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
				</aside>
				<aside className="main__right">
					<canvas 
						id="canvas"
						ref={this.canvasRef} 
						className="canvas" 
						width={this.canvasWidth} 
						height={this.canvasHeight}
					/>
				</aside>
			</main>
		);
	}
}