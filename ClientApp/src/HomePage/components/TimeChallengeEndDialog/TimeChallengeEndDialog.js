import React from "react";   
import { Row, Modal, ModalBody, Container } from "reactstrap";

import "./timeChallengeEndDialog.scss";

export class TimeChallengeEndDialog extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		// starightforward - in case simulation is active, this component should not update
		if (!nextProps.isGameActive) {
			return false;
		}
		if (nextProps.gameEnded !== this.props.gameEnded && nextProps.gameSettings["mode"] === 1) {			
			return true;
		}
		return false;
	}

	render() {
		const { gameEnded, didPlayerWin, closeGameEndDialog, gameSettings: { mode } } = this.props;
		const shouldDialogOpen = gameEnded && mode === 1;
		return (		
			<Modal key="game-time-challenge-end" zIndex={shouldDialogOpen ? 1000: -1} isOpen={shouldDialogOpen} centered={true} fade={true} className="game-end">
				<ModalBody>
					<Row>
						<Container className={`game-end-modal ${didPlayerWin ? "game-end-modal--won" : "game-end-modal--lost"}`}>
							<div className="game-end-modal__text__container">
								<div className="game-end-modal__text__container__notif">{didPlayerWin ? "WON!" : "LOST!" }</div>
								<div
									className="game-end-modal__text__container__btn"
									tabIndex="0"
									role="button"
									onClick={closeGameEndDialog}>
										{didPlayerWin ? "OK" : "Start over"}
								</div>
							</div>
						</Container>
					</Row>
				</ModalBody>
		</Modal>
	)};
};
