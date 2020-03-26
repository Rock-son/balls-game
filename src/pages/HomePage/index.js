import React from "react";
import { Tooltip, Button } from "reactstrap";

import "./main.scss";

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { density: null, hasError: false, error: null, text: "yello again" }
		
		//TODO: calculate from window width
		this.canvasWidth = "1024";
		this.canvasHeight = "780";

		this.ctx = null;
		this.canvasRef = React.createRef();
		this._draw = this._draw.bind(this);
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

	_draw() {
		const canvas = this.canvasRef.current;
		if (canvas.getContext) {
			const ctx = canvas.getContext("2d");

			const radius = 5;
		
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					const rand = Math.floor(Math.random() * Math.floor(155));
					ctx.beginPath();
					const x = rand + j * 50;
					const y = rand + i * 50;
					ctx.arc(x, y, radius, 0, 2 * Math.PI);
					ctx.stroke();
					if (i === 0 && j === 0) {
						ctx.fill();
					} else {
						ctx.stroke();
					}
				}
			}
		}
	}



	render() {
		return (
			<main className="main">
				<aside className="main__left">
					<Button className="col-10" onClick={this. drawHandler}>Draw</Button>
				</aside>
				<aside className="main__right">
					<canvas 
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