import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container, Nav, NavLink } from "reactstrap";

import { sizeOptions, quantityOptions, speedOptions, deactivateOptions, booleanOptions } from "./modalOptions";
import "./simulationModal.scss";

export const SimulationModal = props => {
	const { isOpen, toggle, startSimulation, buttonText, setSimulationOptions, 
					options: { size, speed, quantity, deactivateAfter, showTime, showStats, autorestart} } = props;
   	return (		
		<Modal key="simulator" isOpen={isOpen} toggle={toggle} centered={true} className="simulator-modal">
			<ModalHeader charCode="X" toggle={toggle}></ModalHeader>
			<ModalBody>
				<Row>
					<Container className="choice">
						<div>Size of balls</div>
						<Nav className="choice__options">
							{sizeOptions.map((sizeOption, idx) => {
								if (typeof sizeOption != "object") {
									return <NavLink key={idx}>{sizeOption}</NavLink>;
								}
								return 	<NavLink 
													key={idx}
													tabIndex="0"
													data-option={`${JSON.stringify({size: sizeOption.value})}`}
													onClick={setSimulationOptions}
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
							{quantityOptions.map((quantityOption, idx) => {
								if (quantityOption === "|") {
									return <NavLink key={idx}>{quantityOption}</NavLink>;
								}
								return 	<NavLink 
													key={idx}
													tabIndex="0"
													data-option={`${JSON.stringify({quantity: quantityOption})}`}
													onClick={setSimulationOptions}
													active={quantityOption === quantity}>
														{quantityOption}
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
									return <NavLink key={idx}>{speedOption}</NavLink>;
								}
								return	<NavLink 
													key={idx}
													tabIndex="0" 
													data-option={`${JSON.stringify({speed: speedOption.value})}`}
													onClick={setSimulationOptions}
													active={speedOption.value === speed}>
														{speedOption.type}
												</NavLink>;
							})}
						</Nav>
					</Container>
				</Row>
				<Row>
					<Container className="choice">
						<div>Deactivate ball after</div>
						<Nav className="choice__options">
							{deactivateOptions.map((deactivateOption, idx) => {
								if (deactivateOption === "|") {
									return <NavLink key={idx}>{deactivateOption}</NavLink>;
								}
								return 	<NavLink 
													key={idx}
													tabIndex="0" 
													data-option={`${JSON.stringify({deactivateAfter: deactivateOption})}`}
													onClick={setSimulationOptions}
													active={deactivateOption === deactivateAfter}>
														{deactivateOption === "0" ? "no" : `${deactivateOption}s`}
												</NavLink>;
							})}
						</Nav>				
					</Container>
				</Row>				
				<Row className="col-12">
					<Container className="col-4 choice">
						<div>Show time</div>
						<Nav className="choice__options">
							{booleanOptions.map((timeOption, idx) => {
								if (typeof timeOption !== "object") {
									return <NavLink key={idx}>{timeOption}</NavLink>;
								}
								return 	<NavLink 
													key={idx}
													tabIndex="0" 
													data-option={`${JSON.stringify({showTime: timeOption.value})}`}
													onClick={setSimulationOptions}
													active={timeOption.value === showTime}>
														{timeOption.type}
												</NavLink>;
							})}
						</Nav>
					</Container>
					<Container className="col-4 choice">
						<div>Show stats</div>
						<Nav className="choice__options">
							{booleanOptions.map((statOption, idx) => {
								if (typeof statOption !== "object") {
									return <NavLink key={idx}>{statOption}</NavLink>;
								}
								return 	<NavLink 
													key={idx} 
													tabIndex="0" 
													data-option={`${JSON.stringify({showStats: statOption.value})}`}
													onClick={setSimulationOptions}
													active={statOption.value === showStats}>
														{statOption.type}
												</NavLink>;
							})}
						</Nav>
					</Container>
					<Container className="col-4 choice">
						<div>Autorestart</div>
						<Nav className="choice__options">
							{booleanOptions.map((restartOption, idx) => {
								if (typeof restartOption !== "object") {
									return <NavLink key={idx}>{restartOption}</NavLink>;
								}
								return 	<NavLink 
													key={idx}
													tabIndex="0" 
													data-option={`${JSON.stringify({autorestart: restartOption.value})}`}
													onClick={setSimulationOptions}
													active={restartOption.value === autorestart}>
														{restartOption.type}
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
   );
};
