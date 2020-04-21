import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container } from "reactstrap";

import "./beatYourFriendDialog.scss";

export class BeatYourFriendDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}

	render() {
		const { isOpen, toggle, startGame } = this.props;
				
		return (
			<Modal key="beatyourfriend-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="beatyourfriend-dialog">
				<ModalHeader charCode="X" toggle={toggle}>TRY TO BEAT YOUR FRIEND</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="beatyourfriend-dialog__container">
							<div > Your friend played this game for</div>
							<div className="white">3 minutes, 16 seconds</div>
							<div className="">Game mode: Time Challenge</div>
							<div className="">Difficulty: Easy</div>
							<div className="d-flex justify-content-center">
								<div className="span">Balls: Small,</div>
								<div className="span">Nr. 200,</div>
								<div className="span">Speed: Slow</div>
							</div>
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter onClick={startGame} className="game-modal__footer">
					OK
				</ModalFooter>
			</Modal>
		)
	};
};
