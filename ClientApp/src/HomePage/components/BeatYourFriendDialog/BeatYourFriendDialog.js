import React from "react";
import SimpleCryptoJS from "simple-crypto-js";
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, 
		Container } from "reactstrap";
import { speedToString, sizeToString, modeToString, difficultyToString } from "../GameDialog/gameOptions";
import "./beatYourFriendDialog.scss";

export class BeatYourFriendDialog extends React.Component {
	constructor(props) {
		super(props);
		this.newGameSettings = null;
		this.startGame = this.startGame.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}
	startGame() {
		const { mode, difficulty, size, quantity, speed, clockTime, delayInSeconds } = this.newGameSettings;
		this.props.setGameSettings({ mode, difficulty, size, quantity, speed });
		this.props.toggle();
		this.props.toggleGameDialog();
	}

	render() {
		const { isOpen, toggle } = this.props;
		if (window.location.search === "") {
			return "";
		}
		const myCrypto = new SimpleCryptoJS("/*TODO: add additional logic*/");
		const urlCipherString = decodeURI(window.location.search.slice(1));
		const dataObject = JSON.parse(myCrypto.decrypt(urlCipherString));
		if (dataObject == null || dataObject == "") {
			return "";
		}

		this.newGameSettings = dataObject;
		const { mode, difficulty, size, quantity, speed, clockTime, delayInSeconds } = dataObject;
		const correctedTime = clockTime - delayInSeconds * 1000;
		const newClockTime = new Date(correctedTime);

		return (
			<Modal key="beatyourfriend-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="beatyourfriend-dialog">
				<ModalHeader charCode="X" toggle={toggle}>TRY TO BEAT YOUR FRIEND</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="beatyourfriend-dialog__container">
							<div > Your friend played this game for</div>
							<div className="white">{newClockTime.getMinutes()} minutes, {newClockTime.getSeconds()} seconds</div>
							<div className="">Game mode: {modeToString[mode]}</div>
							<div className="">Difficulty: {difficultyToString[difficulty]}</div>
							<div className="d-flex justify-content-center">
								<div className="span">Balls: {sizeToString[size]},</div>
								<div className="span">Nr. {quantity},</div>
								<div className="span">Speed: {speedToString[speed]}</div>
							</div>
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter onClick={this.startGame} className="game-modal__footer">
					OK
				</ModalFooter>
			</Modal>
		)
	};
};
