import React from "react";
import { Row, Modal, ModalHeader, ModalBody, ModalFooter,
		Container, Nav, NavLink } from "reactstrap";

import { sizeOptions, quantityValues, speedOptions, healedOptions, healedSpeedVals, booleanOptions } from "./simulationOptions";
import "./simulationDialog.scss";

export class SimulationDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		// starightforward - in case simulation is active, this component should not update
		if (!nextProps.isSimulationActive) {
			return false;
		}
		if (this.props.isOpen !== nextProps.isOpen || this.props.buttonText !== nextProps.buttonText) {
			return true;
		}
		if (this.props.settings["size"] !== nextProps.settings["size"] ||
			this.props.settings["speed"] !== nextProps.settings["speed"] ||
			this.props.settings["quantity"] !== nextProps.settings["quantity"] ||
			this.props.settings["healedAfter"] !== nextProps.settings["healedAfter"] ||
			this.props.settings["staysHealed"] !== nextProps.settings["staysHealed"] ||
			this.props.settings["showTime"] !== nextProps.settings["showTime"] ||
			this.props.settings["showStats"] !== nextProps.settings["showStats"] ||
			this.props.settings["autorestart"] !== nextProps.settings["autorestart"]
			) {
				return true;
		}
		return false;
	}

	componentDidUpdate(prevProps, prevState) {
		// in case simulation is active, this component should not trigger update
		if (!this.props.isSimulationActive) {
			return false;
		}			
		// if "staysHealed" is on and healedAfter is off
		if (this.props.settings["staysHealed"] && this.props.settings["healedAfter"] === 0) {
			if (!prevProps.settings["staysHealed"]) {
				return this.props.setSimulationSettings({ healedAfter: healedSpeedVals[this.props.settings["speed"]] });
			} else if (prevProps.settings["staysHealed"]) {
				return this.props.setSimulationSettings({ staysHealed: false });
			} 
		}
	}

	render() {

		const { isOpen, toggle, startSimulation, buttonText, setSimulationSettings, isSimulationStopped,
					settings: { size, speed, quantity, healedAfter, staysHealed, showTime, showStats, autorestart} } = this.props;
					
		return (
			<Modal key="simulator" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="simulator-modal">
				<ModalHeader charCode="X" toggle={toggle}>SIMULATION SETTINGS</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="choice">
							<div className="choice__header">Size of balls</div>
							<Nav className="choice__options">
								{sizeOptions.map((sizeOption, idx) => {
									if (typeof sizeOption != "object") {
										return <NavLink className="disabled" key={idx}>{sizeOption}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({size: sizeOption.value})}`}
												onClick={setSimulationSettings}
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
									return 	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({quantity: quantityValue})}`}
												onClick={setSimulationSettings}
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
									return	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({speed: speedOption.value})}`}
												onClick={setSimulationSettings}
												active={speedOption.value === speed}>
													{speedOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
					<Row>
						<Container className="choice">
							<div className="choice__header">Heal ball (after)</div>
							<Nav className="choice__options">
								{healedOptions.map((healedOption, idx) => {
									if (healedOption === "|") {
										return <NavLink className="disabled" key={idx}>{healedOption}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												title={healedOption !== 0 ? `Heals infected ball after ${healedOption/1000}s` : "No deactivation"}
												tabIndex="0"
												data-option={`${JSON.stringify({healedAfter: healedOption})}`}
												onClick={setSimulationSettings}
												active={healedOption === healedAfter}>
													{healedOption === 0 ? "no" : `${healedOption/1000}s`}
											</NavLink>;
								})}
								<NavLink
									className="healed"
									title={healedAfter > 0? `Start healing after ${healedAfter/1000}s`:"You have to chose time value and then enable this option."}
									tabIndex="0"
									data-option={`${JSON.stringify({staysHealed: !staysHealed})}`}
									onClick={setSimulationSettings}
									active={staysHealed}>
										stays healed
								</NavLink>
							</Nav>
						</Container>
					</Row>
					<Row className="optionsContainer d-flex justify-content-center">
						<Container className="col-4 choice choice--container">
							<div className="choice__header">Show time</div>
							<Nav className="choice__options">
								{booleanOptions.map((timeOption, idx) => {
									if (typeof timeOption !== "object") {
										return <NavLink className="disabled" key={idx}>{timeOption}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({showTime: timeOption.value})}`}
												onClick={setSimulationSettings}
												active={timeOption.value === showTime}>
													{timeOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
						<Container className="col-4 choice choice--container">
							<div className="choice__header">Show stats</div>
							<Nav className="choice__options">
								{booleanOptions.map((statOption, idx) => {
									if (typeof statOption !== "object") {
										return <NavLink className="disabled" key={idx}>{statOption}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({showStats: statOption.value})}`}
												onClick={setSimulationSettings}
												active={statOption.value === showStats}>
													{statOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
						<Container className="col-4 choice choice--container">
							<div className="choice__header">Autorestart</div>
							<Nav className="choice__options">
								{booleanOptions.map((restartOption, idx) => {
									if (typeof restartOption !== "object") {
										return <NavLink className="disabled" key={idx}>{restartOption}</NavLink>;
									}
									return 	<NavLink
												key={idx}
												tabIndex="0"
												data-option={`${JSON.stringify({autorestart: restartOption.value})}`}
												onClick={setSimulationSettings}
												active={restartOption.value === autorestart}>
													{restartOption.type}
											</NavLink>;
								})}
							</Nav>
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter onClick={startSimulation} className="simulator-modal__footer" data-title="For fullscreen press F11">
					{isSimulationStopped ? ">>>" : ""}&nbsp;&nbsp; {buttonText} &nbsp;&nbsp;{isSimulationStopped ? "<<<" : ""}
				</ModalFooter>
		</Modal>
	)};
};
