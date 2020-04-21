import React from "react";
import { Row, Modal, ModalHeader, ModalBody, Container, NavLink } from "reactstrap";
import aboutImage from "../../assets/viralballs-about-img.png";

import "./aboutDialog.scss";

export class AboutDialog extends React.Component {
	constructor(props) {
		super(props);

		this.onStaySafeLinkClick = this.onStaySafeLinkClick.bind(this);
		this.onContactDialogClick = this.onContactDialogClick.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}
	onStaySafeLinkClick(e) {
		this.props.toggle(e);
		setTimeout(() => {
			this.props.toggleStaySafeDialog();
		}, 250);
	}
	onContactDialogClick(e) {
		this.props.toggle(e);
		setTimeout(() => {
			this.props.toggleContactDialog();
		}, 250);
	}

	render() {
		const { toggle, isOpen } = this.props;

		return (
			<Modal key="about-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="about-dialog">
				<ModalHeader charCode="X" toggle={toggle}>ABOUT</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="about-dialog__photo">
							<img src={aboutImage} alt="creators photo" />>
						</Container>
					</Row>
					<Row>
						<Container className="about-dialog__text">
							<p>ViralBalls is a side project done by designer Igor Donkov and programmer Rok Zigon.
								The simulator and the game were developed in the midst of Corona / Covid 19, 2020 worldwide plandemic.
							</p>
							<p>We wanted to visually explore the pandemic situation and add a simple game. Part of the project is to spread
								awareness and add some simple
								<NavLink
									onClick={this.onStaySafeLinkClick}
									target="_blank"
									rel="noopener noreferrer">
										Stay safe
								</NavLink>
								instructions.
							</p>
							<p>Have a question, comment, suggestion?
								<NavLink
									onClick={this.onContactDialogClick}
									target="_blank"
									rel="noopener noreferrer">
										Contact
								</NavLink>
							</p>
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
