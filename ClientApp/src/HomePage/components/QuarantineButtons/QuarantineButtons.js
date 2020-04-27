import React from "react";
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
		this.onMouseDown = this.onMouseDown.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {		
		if (!nextProps.isGameActive) {
			return false;
		}
		if (!this.props.isGameActive && nextProps.isGameActive && nextProps.forceUpdateGame) {
			return true;
		}
		if (nextProps.clockTime !== this.props.clockTime ||
			this.state.active_btn_1 !== nextState.active_btn_1 ||
			this.state.active_btn_2 !== nextState.active_btn_2 ||
			this.state.active_btn_3 !== nextState.active_btn_3 ||
			this.state.active_btn_4 !== nextState.active_btn_4
			) {
				return true
		}
		if (nextProps.quarantineAboutToExpire || nextProps.quarantinePlaced || this.props.quarantineCancelled !== nextProps.quarantineCancelled) {
			return true;
		}
		if (this.props.healthyBalls !== nextProps.healthyBalls || this.props.gameStopped !== nextProps.gameStopped) {
			return true;
		}
		return false;
	}

	randomIntNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	onMouseDown = (e) => {	
		// start quarantine
		const event = e;
		this.props.setQuarantineInMotion(event);
		this.props.setButtonStatus(false);

		// deactivate button
		const buttonId = parseInt(event.currentTarget.id);
		this.setState({ [`active_btn_${buttonId}`]: false });
	}

	getRandomButton({ aboutToExpire }) {
		//only deploy if quarantine is not being dragged at the moment
		if (this.props.isQuarantineBeingDragged) {
			return null;
		}
		let shouldButtonBeDeployed = false;
		let buttonToBeDeployed = null;
		// only deploy button if no button is active at the moment
		if (!this.props.isAnyButtonActive) {
			const random = this.randomIntNumber(1, 4);
			buttonToBeDeployed = `active_btn_${random}`;
		}
		// onyl deploy button if there are more healthy than active quarantines in case less than 6 healthy
		if (this.props.healthyBalls < 5) {
			// if aboutToExpire === true - one active quarantine can be deducted
			if (aboutToExpire && this.props.activeQuarantines.length <= this.props.healthyBalls) {
				shouldButtonBeDeployed = true;
			}
			// if aboutToExpire === false 
			else if (this.props.activeQuarantines.length < this.props.healthyBalls) {
				shouldButtonBeDeployed = true;
			}
		}
		// only deploy button if there are more infected balls than quarantines in case less than 6 infected
		else if (this.props.infectedBalls < 5) {
			// if aboutToExpire === true - one active quarantine can be deducted
			if (aboutToExpire && this.props.activeQuarantines.length <= this.props.infectedBalls) {
				shouldButtonBeDeployed = true;
			}
			// if aboutToExpire === false 
			else if (this.props.activeQuarantines.length < this.props.infectedBalls) {
				shouldButtonBeDeployed = true;
			}
		} else if ((aboutToExpire && this.props.activeQuarantines.length < 6) || (!aboutToExpire && this.props.activeQuarantines.length < 5)) {
			shouldButtonBeDeployed = true;
		}

		if (shouldButtonBeDeployed) {
			return buttonToBeDeployed;
		}

		return null;

	}

	componentDidUpdate(prevProps, prevState) {
		const { clockTime } = prevProps;
		// reset buttons from simulation
		if (this.props.gameStopped) {
			this.setState({
				active_btn_1: false,
				active_btn_2: false,
				active_btn_3: false,
				active_btn_4: false
			});
		}


		// deploy first button- no need to check anything
		if (clockTime.getTime() === 2000) {			
			const randomButtonStateKey = this.getRandomButton({ aboutToExpire: false });
			if (randomButtonStateKey) {
				this.props.setButtonStatus(true);
				this.setState({ [randomButtonStateKey]: true });
			}
		}		
		// deploy button 1 sec after quarantine is placed or canceled
		if (this.props.quarantinePlaced || this.props.quarantineCancelled) {
			const randomButtonStateKey = this.getRandomButton({ aboutToExpire: false });
			if (randomButtonStateKey) {	
				this.props.setButtonStatus(true);
				setTimeout(() => {
					this.setState({ [randomButtonStateKey]: true });
				}, 1000);
			}
		}
		// deploy button immediatelly one's about to expire
		if (this.props.quarantineAboutToExpire) {
			this.props.resetQuarantineExpiration(); // needed so updateGame.js doesn't come into setState() loop
			const randomButtonStateKey = this.getRandomButton({ aboutToExpire: true });
			if (randomButtonStateKey) {
				this.props.setButtonStatus(true);
				this.setState({ [randomButtonStateKey]: true });				
			}
		}
	}

	render() {
		return (
			<>
				<Button
					id="1btn"
					onMouseDown={this.onMouseDown}
					className={`btn quarantine__btn quarantine__btn--left-top ${this.state.active_btn_1 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="2btn"
					onMouseDown={this.onMouseDown}
					className={`btn quarantine__btn quarantine__btn--left-bottom ${this.state.active_btn_2 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="3btn"
					onMouseDown={this.onMouseDown}
					className={`btn quarantine__btn quarantine__btn--right-top ${this.state.active_btn_3 ? "active" : ""}`}>
						QUARANTINE
				</Button>
				<Button
					id="4btn"
					onMouseDown={this.onMouseDown}
					className={`btn quarantine__btn quarantine__btn--right-bottom ${this.state.active_btn_4 ? "active" : ""}`}>
						QUARANTINE
				</Button>
			</>
		);
	}
}