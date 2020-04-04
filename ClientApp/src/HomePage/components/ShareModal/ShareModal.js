import React from "react";   
import { Button, Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container, NavLink } from "reactstrap";

import "./shareModal.scss";

export const ShareModal = props => {
	const { isOpen, toggle, copy, isCopied, shareModalTitle } = props;
   	return (
		<Modal key="sharemodal" isOpen={isOpen} toggle={toggle} centered={true} className="share-modal">
			<ModalHeader charCode="X" toggle={toggle}>
				{shareModalTitle}
			</ModalHeader>
			<ModalBody className="justify-content-center">
				<Row>
					<Container className="share">
						Share with your friends
					</Container>
				</Row>
				<Row>
					<Container>
						https://www.covidsimulator.com
					</Container>
				</Row>
				<Row>
					<Container>
						{ isCopied ?
							<div className="copied__link">Link copied &#128515;</div> 
							:
							<Button onClick={copy} >Copy link</Button>
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
						href="https://www.countdownkings.com">
							CountdownKings.com
					</NavLink>
				</Container>
			</ModalFooter>
		</Modal>
   );
};
