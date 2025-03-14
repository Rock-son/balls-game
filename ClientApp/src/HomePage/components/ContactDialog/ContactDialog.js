import React from "react";   
import { Button, Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container, NavLink } from "reactstrap";

import "./contactDialog.scss";

export class ContactDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen || nextProps.isCopied !== this.props.isCopied) {
			return true;
		}
		return false;
	}

	render() {
		
		const { isOpen, toggle, copy, isCopied  } = this.props;

		return (
			<Modal key="sharemodal" isOpen={isOpen} zIndex={isOpen ? 1000: -1} toggle={toggle} centered={true} className="share-modal">
				<ModalHeader charCode="X" toggle={toggle}></ModalHeader>
				<ModalBody className="justify-content-center">
					<Row>
						<Container className="share">
							Contact us here
						</Container>
					</Row>
					<Row>
						<Container>
							viralballs.simulator@gmail.com
						</Container>
					</Row>
					<Row>
						<Container>
							{ isCopied ?
								<div className="copied__link">Mail copied <span role="img" aria-label="smiley face">&#128515;</span></div> 
								:
								<Button onClick={copy} >Copy mail</Button>
							}
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter>
					<Container  className="col-12 d-inline-flex justify-content-center">
						For more visit&nbsp;
						<NavLink
							className="footer__link"
							target="_blank"
							rel="noopener noreferrer"							
							href="https://www.countdownkings.com/">
								CountdownKings.com
						</NavLink>
					</Container>
				</ModalFooter>
			</Modal>
	);}
};
