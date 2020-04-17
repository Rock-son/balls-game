import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container } from "reactstrap";
import instructions from "./howToPlayInstructions";

import "./howToPlayDialog.scss";

export class HowToPlayDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}

	render() {
		const { isOpen, toggle, gameSettings, startGame } = this.props;
				
		return (
			<Modal key="howtoplay-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="howtoplay-dialog">
				<ModalHeader charCode="X" toggle={toggle}>HOW TO PLAY: <span className="bold">{gameSettings["mode"] ? "KEEP UNINFECTED" : "TIME CHALLENGE"}</span></ModalHeader>
				<ModalBody>
					<Row>
						<Container className="howtoplay-dialog__text">
							<ul className="list">
								{instructions[gameSettings["mode"]].map( instruction => {
									return <li className="list__item">{instruction}</li>;
								})}
							</ul>
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter onClick={startGame} className="game-modal__footer">
					&gt;&gt;&gt;&nbsp;&nbsp; START &nbsp;&nbsp;&lt;&lt;&lt;
				</ModalFooter>
			</Modal>
		)
	};
};
