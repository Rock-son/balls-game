import React from "react";
import { Tooltip, Button } from "reactstrap";

import _draw from "./_draw";
import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { density: null, hasError: false, error: null, text: "yello again" }
		
		//TODO: calculate from window width
		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;

		this.ctx = null;
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
	
	drawHandler() {
		this._draw();
	}


	render() {
		return (
			<main className="main">
				<aside className="main__left">
					<Button className="col-10" onClick={this.drawHandler}>Draw</Button>
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