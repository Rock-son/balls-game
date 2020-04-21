import React from "react";
import { Row, Modal, ModalHeader, ModalBody, ModalFooter,
		Container, Nav, NavLink } from "reactstrap";

import { modeOptions, difficultyOptions, sizeOptions, quantityValues, quantityDiffVals, speedOptions, speedDiffValues } from "./gameOptions";
import { InstructionsPopover } from "./instructionsPopover";
import "./gameDialog.scss";

export class GameDialog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			instructionsOpen: false,
			mode: null,
			modeType: null
		};
		this.onMouseEnterInstructions = this.onMouseEnterInstructions.bind(this);
		this.onMouseLeaveInstructions = this.onMouseLeaveInstructions.bind(this);
	}

	onMouseEnterInstructions(e) {
		const mode = JSON.parse(e.currentTarget.getAttribute("data-option"));
		const modeType = e.currentTarget.getAttribute("data-type"); // minutes of duration
		this.setState({ instructionsOpen: true, mode, modeType });
	}
	onMouseLeaveInstructions(e) {
		const mode = JSON.parse(e.currentTarget.getAttribute("data-option"));
		const modeType = e.currentTarget.getAttribute("data-type");
		this.setState({ instructionsOpen: false, mode, modeType });
	}

	shouldComponentUpdate(nextProps, nextState) {
		// starightforward - in case simulation is active, this component should not update
		if (!nextProps.isGameActive) {
			return false;
		}
		if (this.props.isOpen !== nextProps.isOpen || this.props.buttonText !== nextProps.buttonText) {
			return true;
		}
		if (this.props.settings["mode"] !== nextProps.settings["mode"] ||
			this.props.settings["difficulty"] !== nextProps.settings["difficulty"] ||
			this.props.settings["size"] !== nextProps.settings["size"] ||
			this.props.settings["quantity"] !== nextProps.settings["quantity"] ||
			this.props.settings["speed"] !== nextProps.settings["speed"]
			) {
				return true;
		}
		return false;
	}

	componentDidUpdate(prevProps, prevState) {
		// in case simulation is active, this component should not trigger update
		if (!this.props.isGameActive) {
			return false;
		}
		const minQuantity = (quantityDiffVals[this.props.settings.difficulty][this.props.settings.size] || { min: 0 }).min;
		const maxQuantity = (quantityDiffVals[this.props.settings.difficulty][this.props.settings.size] || { max: 1000 }).max;
		const changedSpeed = speedDiffValues[this.props.settings.difficulty];
		// if quantity is greater or smaller than it should be according to size
		if (this.props.settings.quantity > maxQuantity ) {
			return this.props.setGameSettings({ quantity: maxQuantity, speed: changedSpeed });
		}
		else if (this.props.settings.quantity < minQuantity ) {
			return this.props.setGameSettings({ quantity: minQuantity, speed: changedSpeed });
		}
		// if min, max values are not a problem, then set speed
		else if (this.props.settings.speed !== changedSpeed) {
			return this.props.setGameSettings({ speed: changedSpeed });
		}
	}

	render() {

		const { isOpen, toggle, startGame, buttonText, setGameSettings, isGameStopped,
					settings: { mode, difficulty, size, quantity, speed } } = this.props;
		const diffTime = this.props.gameTimeDifficultyInSeconds;

		return (
			<Modal key="game" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="game-modal">
				<ModalHeader charCode="X" toggle={toggle}>GAME SETTINGS</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="choice">
							<div className="choice__header">Game mode</div>
							<Nav className="choice__options">
								{modeOptions.map((modeOption, idx) => {
									if (typeof modeOption != "object") {
										return <NavLink className="disabled" key={idx}>{modeOption}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												title={modeOption.value === 0 ? "How long can you last" : `Keep one ball healthy for at least ${diffTime[this.props.settings["difficulty"]]} min`}
												tabIndex="0"
												data-type={modeOption.type}
												data-option={`${JSON.stringify({ mode: modeOption.value })}`}
												onClick={setGameSettings}
												onMouseEnter={this.onMouseEnterInstructions}
												onMouseLeave={this.onMouseLeaveInstructions}
												active={modeOption.value === mode}>
													{modeOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
					<Row>
						<Container className="choice">
							<div className="choice__header">Difficulty level</div>
							<div className="choice__header__sub">Affects infection rate and quarantine.</div>
							<Nav className="choice__options">
								{difficultyOptions.map((difficultyOption, idx) => {
									if (difficultyOption === "|") {
										return <NavLink className="disabled" key={idx}>{difficultyOption}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												tabIndex="0"
												title={difficultyOption.value === 0 ? "33% infection rate" : difficultyOption.value === 1 ? "50% infection rate" : "100% infection rate"}
												data-option={`${JSON.stringify({ difficulty: difficultyOption.value })}`}
												onClick={setGameSettings}
												active={difficultyOption.value === difficulty}>
													{difficultyOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
					<Row>
						<Container className="choice">
							<div className="choice__header">Size of balls</div>
							<Nav className="choice__options">
								{sizeOptions.map((sizeOption, idx) => {
									if (typeof sizeOption != "object") {
										return <NavLink className="disabled" key={idx}>{sizeOption}</NavLink>;
									}
									return	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({size: sizeOption.value})}`}
												onClick={setGameSettings}
												active={sizeOption.value === size}>
													{sizeOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
					<Row>
						<Container className="choice">
							<div className="choice__header">Number of balls</div>
							<Nav className="choice__options">
								{quantityValues[size].map((quantityValue, idx) => {
									if (quantityValue === "|") {
										return <NavLink className="disabled" key={idx}>{quantityValue}</NavLink>;
									}
									// if quantity is outside of min / max values
									if ((quantityDiffVals[difficulty][size] && (quantityValue < quantityDiffVals[difficulty][size].min)) ||
										(quantityDiffVals[difficulty][size] && (quantityValue > quantityDiffVals[difficulty][size].max))
									) {
										return <NavLink disabled={true} key={idx}>{quantityValue}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({quantity: quantityValue})}`}
												onClick={setGameSettings}
												active={quantityValue === quantity}>
													{quantityValue}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
					<Row>
						<Container className="choice">
							<div className="choice__header">Speed of balls</div>
							<Nav className="choice__options">
								{speedOptions.map((speedOption, idx) => {
									if (typeof speedOption != "object") {
										return <NavLink className="disabled" key={idx}>{speedOption}</NavLink>;
									}
									if (speedOption.difficulty !== difficulty ) {
										return <NavLink className="disabled" key={idx}>{speedOption.type}</NavLink>;
									}
									return	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({speed: speedOption.value})}`}
												onClick={setGameSettings}
												active={speedOption.value === speed}>
													{speedOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter onClick={startGame} data-title={isGameStopped ? "Use mousewheel to make quarantine larger or smaller" : "Restart by changing game settings"} className="game-modal__footer">
					{isGameStopped ? ">>>" : ""}&nbsp;&nbsp; {buttonText} &nbsp;&nbsp;{isGameStopped ? "<<<" : ""}
				</ModalFooter>
		</Modal>
	)};
};
