import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container, NavLink } from "reactstrap";

import "./staySafeDialog.scss";

export class StaySafeDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}

	render() {
		const { isOpen, toggle } = this.props;
		
		return (
			<Modal key="staysafe-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="staysafe-dialog">
				<ModalHeader charCode="X" toggle={toggle}>STAY SAFE</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="staysafe-dialog__text">
							<p>ViraticBalls is a side project done by designer Igor Donkov and programmer Rok Zigon.
								The simulator and the game were developed in the midst of Corona / Covid 19 , 2020 worldwide pandemic.
							</p>
							<p>We wanted to visually explore the pandemic situation and add a simple game. Part of the project is to spread
								awareness and add some simple 
								instructions.
							</p>
							<p>Have a qustion, comment, suggestion?</p>
							<div>Check main project:</div>
							<NavLink
								className="countdown"
								target="_blank"
								rel="noopener noreferrer"							
								href="https://www.countdownkings.com/">
									CountdownKings.com
							</NavLink>
						</Container>
					</Row>
				</ModalBody>
			</Modal>
		)
	};
};
