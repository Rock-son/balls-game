import React from "react";
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
	Container } from "reactstrap";

import "./browserWarningDialog.scss";


export class BrowserWarningDialog extends React.Component {
	constructor(props) {
		super(props);

		this.checkBrowser = this.checkBrowser.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}
	checkBrowser() {
		// INTERNET EXPLORER
		if (navigator.userAgent.indexOf("MSIE") !== -1 ) {
			return "Internet Expolorer";
		}
		// EDGE
		else if (navigator.userAgent.indexOf("Edge") !== -1 ) {
			return "Edge";
		}
		// SAFARI
		else if (navigator.userAgent.indexOf("Safari") !== -1 ) {
			return "Safari";
		}
		return true;
	}

	render() {
		const { isOpen, toggle } = this.props;
		const browserName = this.checkBrowser();

		return (
			<Modal key="browserwarning-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="browserwarning-dialog">
				<ModalHeader >WARNING</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="browserwarning-dialog__container">
							<div >Sorry, simulator is not working properly in {browserName} browser. Please use Chrome, Firefox, or some other browser.</div>
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter onClick={toggle} className="game-modal__footer">
					OK
				</ModalFooter>
			</Modal>
		)
	};
};
