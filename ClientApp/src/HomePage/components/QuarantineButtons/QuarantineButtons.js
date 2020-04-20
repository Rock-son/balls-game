import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

import "./quarantineButtons.scss";

export class QuarantineButtons extends React.Component {
	constructor(props) {
		super(props);
		this.availableButtons = [1,2,3,4];

		this.state = { activeButtons: [] };
		this.randomIntNumber = this.randomIntNumber.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {		
		if (!nextProps.isGameActive) {
			return false;
		}
		if (nextProps.clockTime !== this.props.clockTime || nextState.activeButtons.length !== this.state.activeButtons.length) {
			return true
		}
		if (nextProps.draggedQuarantine.id !== this.props.draggedQuarantine.id) {
			return true;
		}
		return false;
	}
	randomIntNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	onPointerDown = (e) => {
		const event = e;
		// start quarantine
		this.props.setQuarantineInMotion(event);
		// return button to index
		const buttonId = parseInt(event.currentTarget.id);
		const { activeButtons } = this.state;
		const buttonIndex = activeButtons.indexOf(buttonId);
		// remove clicked button from active buttons
		this.setState({ activeButtons: activeButtons.slice(0, buttonIndex).concat(activeButtons.slice(buttonIndex + 1))});
		
	}
	componentDidUpdate(prevProps, prevState) {
		const { clockTime, settings } = prevProps;
		if (this.props.gameRestarting) {			
			this.setState({ activeButtons: [] });
		}
		if (clockTime === 3) {
			const randomButton = this.randomIntNumber(1, this.availableButtons.length);
			const result = this.state.activeButtons.concat(randomButton);
			return this.setState({ activeButtons: result});
			
		}

		const random = this.randomIntNumber();

		if (clockTime > 5 && clockTime.getSeconds() % 2 === 0) {
			const randomButton = this.randomIntNumber(1, this.availableButtons.length);
			const result = this.state.activeButtons.concat(randomButton);			
			if (this.state.activeButtons.length < 3) {
				this.setState({ activeButtons: result});
			}
		}
	}

	render() {

		return (
			<>
				<Button
					id="1btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--left-top ${this.state.activeButtons.indexOf(1) > -1 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="2btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--left-bottom ${this.state.activeButtons.indexOf(2) > -1 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="3btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--right-top ${this.state.activeButtons.indexOf(3) > -1 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="4btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--right-bottom ${this.state.activeButtons.indexOf(4) > -1 ? "active" : ""}`}>
						QUARANTINE
				</Button>
			</>
		);
	}
}