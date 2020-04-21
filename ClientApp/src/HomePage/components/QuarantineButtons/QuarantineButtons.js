import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

import "./quarantineButtons.scss";

export class QuarantineButtons extends React.Component {
	constructor(props) {
		super(props);
		this.availableButtons = [1,2,3,4];

		this.state = { 
			active_btn_1: false, 
			active_btn_2: false, 
			active_btn_3: false, 
			active_btn_4: false 
		};

		this.randomIntNumber = this.randomIntNumber.bind(this);
		this.getRandomButton = this.getRandomButton.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {		
		if (!nextProps.isGameActive) {
			return false;
		}
		if (nextProps.clockTime !== this.props.clockTime ||
			this.state.active_btn_1 !== nextState.active_btn_1 ||
			this.state.active_btn_2 !== nextState.active_btn_2 ||
			this.state.active_btn_3 !== nextState.active_btn_3 ||
			this.state.active_btn_4 !== nextState.active_btn_4
			) {
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
		// start quarantine
		const event = e;
		this.props.setQuarantineInMotion(event);

		// deactivate button
		const buttonId = parseInt(event.currentTarget.id);
		this.setState({ [`active_btn_${buttonId}`]: false });
		
	}
	getRandomButton() {
		let return_btn = null;
		let i = 0;
		// if all buttons are taken, return null
		if (this.state.active_btn_1 && this.state.active_btn_2 && this.state.active_btn_3 && this.state.active_btn_4 ) {
			return null;
		}
		// else choose one that is not taken
		while(!return_btn && i < 100) {
			const random = this.randomIntNumber(1, 4);			
			if (!this.state[`active_btn_${random}`]) {
				return_btn = `active_btn_${random}`;
			}
			i++;
		}
		return return_btn;
	}

	componentDidUpdate(prevProps, prevState) {
		const { clockTime, settings } = prevProps;
		// ON RESTART
		if (this.props.gameRestarting) {
			return this.setState({
				active_btn_1: false,
				active_btn_2: false,
				active_btn_3: false,
				active_btn_4: false
			});
		}
		if (clockTime.getSeconds() === 3) {
			// since this is the first button, no need to check for availability
			const randomButtonStateKey = this.getRandomButton();			
			return randomButtonStateKey && this.setState({ [randomButtonStateKey]: true });
		}
		if (clockTime.getSeconds() > 5 && clockTime.getSeconds() % 5 === 0) {
			const randomButtonStateKey = this.getRandomButton();
			return randomButtonStateKey && this.setState({ [randomButtonStateKey]: true });
		}
	}

	render() {
		

		return (
			<>
				<Button
					id="1btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--left-top ${this.state.active_btn_1 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="2btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--left-bottom ${this.state.active_btn_2 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="3btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--right-top ${this.state.active_btn_3 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="4btn"
					onPointerDown={this.onPointerDown}
					className={`btn quarantine__btn quarantine__btn--right-bottom ${this.state.active_btn_4 ? "active" : ""}`}>
						QUARANTINE
				</Button>
			</>
		);
	}
}