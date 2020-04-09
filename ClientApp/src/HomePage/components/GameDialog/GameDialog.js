import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container, Nav, NavLink } from "reactstrap";

import { modeOptions, difficultyOptions, sizeOptions, quantityValues, quantityDiffVals, speedOptions, speedDiffValues } from "./gameOptions";
import "./gameDialog.scss";

export class GameDialog extends React.Component {
	constructor(props) {
		super(props);
		
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.isOpen != nextProps.isOpen || this.props.buttonText != nextProps.buttonText) {
			return true;
		}
		if (this.props.settings["mode"] != nextProps.settings["mode"] ||
			this.props.settings["difficulty"] != nextProps.settings["difficulty"] ||
			this.props.settings["size"] != nextProps.settings["size"] ||
			this.props.settings["quantity"] != nextProps.settings["quantity"] ||
			this.props.settings["speed"] != nextProps.settings["speed"]
			) {
				return true;
		}
		return false;
	}

	componentDidUpdate(prevProps, prevState) {
		const minQuantity = (quantityDiffVals[this.props.settings.difficulty][this.props.settings.size] || { min: 0 }).min;
		const maxQuantity = (quantityDiffVals[this.props.settings.difficulty][this.props.settings.size] || { max: 1000 }).max;
		const changedSpeed = speedDiffValues[this.props.settings.difficulty];
		// if quantity is greater or smaller than it should be according to size
		if (this.props.settings.quantity > maxQuantity ) {
			return this.props.setGameSettings({ quantity: maxQuantity, speed: changedSpeed });
		}
		if (this.props.settings.quantity < minQuantity ) {			
			return this.props.setGameSettings({ quantity: minQuantity, speed: changedSpeed });
		}
		// if min, max values are not a problem, then set speed
		if (this.props.settings.speed !== changedSpeed) {
			return this.props.setGameSettings({ speed: changedSpeed });
		}
	}

	render() {

		const { isOpen, toggle, startSimulation, buttonText, setGameSettings, 
					settings: { mode, difficulty, size, quantity, speed } } = this.props;
		return (		
			<Modal key="simulator" isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="simulator-modal">
				<ModalHeader charCode="X" toggle={toggle}></ModalHeader>
				<ModalBody>
					<Row>
						<Container className="choice">
							<div>Game Mode</div>
							<Nav className="choice__options">
								{modeOptions.map((modeOption, idx) => {
									if (typeof modeOption != "object") {
										return <NavLink className="disabled" key={idx}>{modeOption}</NavLink>;
									}
									return 	<NavLink 
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({ mode: modeOption.value })}`}
												onClick={setGameSettings}
												active={modeOption.value === mode}>
													{modeOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
					<Row>
						<Container className="choice">
							<div>Difficulty level (also affects Quarantine)</div>
							<Nav className="choice__options">
								{difficultyOptions.map((difficultyOption, idx) => {
									if (difficultyOption === "|") {
										return <NavLink className="disabled" key={idx}>{difficultyOption}</NavLink>;
									}
									return 	<NavLink 
												key={idx}
												tabIndex="0"
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
							<div>Size of balls</div>
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
							<div>Number of balls</div>
							<Nav className="choice__options">
								{quantityValues[size].map((quantityValue, idx) => {
									if (quantityValue === "|") {
										return <NavLink className="disabled" key={idx}>{quantityValue}</NavLink>;
									}
									// if quantity is outside of min / max values
									if (quantityDiffVals[difficulty][size] && (quantityValue < quantityDiffVals[difficulty][size].min) ||
										quantityDiffVals[difficulty][size] && (quantityValue > quantityDiffVals[difficulty][size].max)
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
							<div>Speed of balls</div>
							<Nav className="choice__options">
								{speedOptions.map((speedOption, idx) => {
									if (typeof speedOption != "object") {
										return <NavLink className="disabled" key={idx}>{speedOption}</NavLink>;
									}
									if (speedOption.difficulty != difficulty ) {
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
				<ModalFooter onClick={startSimulation} className="simulator-modal__footer">
					&gt;&gt;&gt;&nbsp;&nbsp; {buttonText} &nbsp;&nbsp;&lt;&lt;&lt;
				</ModalFooter>
		</Modal>
	)};
};
