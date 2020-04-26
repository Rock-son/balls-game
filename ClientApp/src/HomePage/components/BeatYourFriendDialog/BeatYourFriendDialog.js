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
		this.getParameter = this.getParameter.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {	
		// trigger only on game end and correct game mode
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}
		return false;
	}

	startGame() {
		const { m: mode, d: difficulty, s: size, q: quantity, sp: speed }= this.newGameSettings;
		this.props.setGameSettings({ mode, difficulty, size, quantity, speed });
		this.props.toggle();
		this.props.toggleGameDialog();
	}

	getParameter(paramName) {
		var searchString = window.location.search.substring(1),
			i, val, params = searchString.split("&");
	  
		for (i=0;i<params.length;i++) {
		  val = params[i].split("=");
		  if (val[0] == paramName) {
			return val[1];
		  }
		}
		return null;
	}

	render() {
		const { isOpen, toggle } = this.props;

		let params;
		if (window.location.search === "") {
			return "";
		} else {
			params = this.getParameter("settings");
			if (!params) {
				return "";
			}
		}
		
		const myCrypto = new SimpleCryptoJS("/*TODO: add additional logic*/");
		const urlCipherString = decodeURI(params);
		const dataObject = JSON.parse(myCrypto.decrypt(urlCipherString));
		if (dataObject == null || dataObject == "") {
			return "";
		}

		this.newGameSettings = dataObject;
		const { m: mode, d: difficulty, s: size, q: quantity, sp: speed, m: minutes, sc: seconds } = dataObject;
		// fallback in case of wrong settings
		if (mode == null || difficulty == null || size == null || quantity == null || speed == null || minutes == null || seconds == null ) {
			this.newGameSettings = { m: 0, d: 2, s: 8, q: 600, sp: .6, m: 0, sc: 20 };
		}

		return (
			<Modal key="beatyourfriend-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={toggle} centered={true} fade={true} className="beatyourfriend-dialog">
				<ModalHeader charCode="X" toggle={toggle}>TRY TO BEAT YOUR FRIEND</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="beatyourfriend-dialog__container">
							<div > Your friend played this game for</div>
							<div className="white">{minutes} minutes, {seconds} seconds</div>
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
