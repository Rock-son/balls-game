import React from "react";
import { Tooltip, Button } from "reactstrap";
import { clearDriftless } from 'driftless';

import _draw from "./_draw";
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			speed: 1,
			density: null, 
			hasError: false, 
			error: null,
			canvasAnimating: true,
			pause: false,
			stop: false,
			buttonText: "Cancel" 
		}
		this.interval = null;
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;

		this.shouldAnimationStop = false;
		this.canvasRef = React.createRef();

		this._draw = _draw.bind(this);
		this.drawHandler = this.drawHandler.bind(this);
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
	
	drawHandler() {		
		const canvasAnimating = this.state.canvasAnimating;
		if (canvasAnimating) {
			this.shouldAnimationStop = true;
			this.setState({ canvasAnimating: false, pause: true, buttonText: "Draw" });
		} else {
			this.shouldAnimationStop = false;
			this.setState({ canvasAnimating: true, pause: false, buttonText: "Cancel" });
		}

	}


	render() {
		return (
			<main className="main">
				<aside className="main__left">
					<Button className="col-10" onClick={this.drawHandler}>{this.state.buttonText}</Button>
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