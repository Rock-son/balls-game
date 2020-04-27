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
		// Safari 3.0+ "[object HTMLElementConstructor]" 
		const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari']);
		// Internet Explorer 6-11
		const isIE = /*@cc_on!@*/false || !!document.documentMode;
		// Edge 20+
		const isEdge = !isIE && !!window.StyleMedia;
		if (isSafari) {
			return "Safari";
		}
		else if (isEdge) {
			return "Edge";
		}
		else if (isIE) {
			return "Internet Explorer";
		}
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
