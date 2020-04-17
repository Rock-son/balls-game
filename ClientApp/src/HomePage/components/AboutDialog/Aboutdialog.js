import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container, 
		NavLink} from "reactstrap";
import aboutImage from "../../assets/viralballs-about-img.png";
import "./aboutDialog.scss";

export class AboutDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}

	render() {
		const { toggleAboutDialog, isOpen, toggleStaySafe} = this.props;
		
		return (
			<Modal key="about-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} centered={true} fade={true} className="about-dialog">
				<ModalHeader charCode="X" toggle={toggleAboutDialog}>ABOUT</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="about-dialog__photo">
							<img src={aboutImage} alt="creators photo" />>
						</Container>
					</Row>
					<Row>
						<Container className="about-dialog__text">
							<p>ViraticBalls is a side project done by designer Igor Donkov and programmer Rok Zigon.
								The simulator and the game were developed in the midst of Corona / Covid 19 , 2020 worldwide pandemic.
							</p>
							<p>We wanted to visually explore the pandemic situation and add a simple game. Part of the project is to spread
								awareness and add some simple 
								<NavLink
									onClick={toggleStaySafe}
									target="_blank"
									rel="noopener noreferrer">
										Stay safe
								</NavLink> 
								instructions.
							</p>
							<p>Have a qustion, comment, suggestion? 
								<NavLink
									onClick={toggleStaySafe}
									target="_blank"
									rel="noopener noreferrer">
										Contact
								</NavLink> 
							</p>
							<p>Check main project:</p>
							<NavLink
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
