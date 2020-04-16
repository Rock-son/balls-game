import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container, Nav, NavLink } from "reactstrap";

import "./gameEndDialog.scss";

export class GameEndDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		// starightforward - in case simulation is active, this component should not update
		if (!nextProps.isGameActive) {
			return false;
		}
		if (nextProps.gameEnded !== this.props.gameEnded) {
			return true;
		}
		return false;
	}


	render() {
		const { gameEnded, closeGameEndDialog, didPlayerWin } = this.props;		
		return (		
			<Modal key="game-end" zIndex={gameEnded ? 1000: -1} isOpen={gameEnded} centered={true} fade={true} className="game-end">
				<ModalBody>
					<Row>
						<Container className={`game-end-modal ${didPlayerWin ? "game-end-modal--won" : "game-end-modal--lost"}`}>
							<div className="game-end-modal__text__container">
								<div className="game-end-modal__text__container__notif">{didPlayerWin ? "WON!" : "LOST!" }</div>
								<div
									className="game-end-modal__text__container__btn"
									tabindex="0"
									role="button"
									onClick={closeGameEndDialog}
									className="game-end-modal__text__container__btn">
										{didPlayerWin ? "OK" : "Start over"}
								</div>
							</div>
						</Container>
					</Row>
				</ModalBody>
		</Modal>
	)};
};
