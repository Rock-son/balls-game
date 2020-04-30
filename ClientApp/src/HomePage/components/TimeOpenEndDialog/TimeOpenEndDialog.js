import React from "react";
import SimpleCryptoJS from "simple-crypto-js";
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, Container, Button } from "reactstrap";
import { speedToString, sizeToString } from "../GameDialog/gameOptions";

import "./timeOpenEndDialog.scss";

export class TimeOpenEndDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isCopied: false
		}
		this.copyToClipboard = this.copyToClipboard.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {	
				
		// starightforward - in case simulation is active, this component should not update
		if (!nextProps.isGameActive) {
			return false;
		}
		// trigger only on game end and correct game mode
		if (nextProps.gameEnded !== this.props.gameEnded && nextProps.gameSettings["mode"] === 0 ) {
			return true;
		}
		// trigger on game end, correct game mode and copied link
		if (nextProps.gameEnded && nextProps.gameSettings["mode"] === 0 && this.state.isCopied !== nextState.isCopied) {
			return true;
		}
		return false;
	}

	copyToClipboard() {
		const myCrypto = new SimpleCryptoJS("/*TODO: add additional logic*/");
		const { gameSettings: { mode, difficulty, size, quantity, speed, delayInSeconds }, clockTime } = this.props;
		const correctedTime = new Date(clockTime.getTime() - delayInSeconds * 1000);
		const shortenedSettings = {
			m: mode,
			d: difficulty,
			s: size,
			q: quantity,
			sp: speed,
			min: correctedTime.getMinutes(),
			sc: correctedTime.getSeconds()
		};
		const encryptedGameSettings = myCrypto.encrypt(JSON.stringify(shortenedSettings));
		navigator.permissions.query({name: "clipboard-write"})
			.then(result => {
				if (result.state === "granted" || result.state === "prompt") {
					navigator.clipboard.writeText(`https://www.viralballs.com?settings=${encodeURIComponent(encryptedGameSettings)}`);
					this.setState({ isCopied: true });
					setTimeout(() => {
						this.setState({ isCopied: false });
					}, 2000);				
				}
		 	});
	}


	render() {
		const { gameEnded, closeGameEndDialog, clockTime, gameSettings } = this.props;		
		const shouldDialogOpen = gameEnded && gameSettings["mode"] === 0;
		const correctedClockTime = new Date(clockTime.getTime() - gameSettings["delayInSeconds"]*1000);

		return (		
			<Modal key="game-open-end" zIndex={shouldDialogOpen ? 1000: -1} toggle={closeGameEndDialog} isOpen={shouldDialogOpen} centered={true} fade={true} className="game-open-end">
				<ModalHeader charCode="X" toggle={closeGameEndDialog}>GAME FINSHED</ModalHeader>
				<ModalBody>
					<Row>
						<Container className="text">
							<div className="grey">You managed to play the game for</div>
							<div className="white">{`${correctedClockTime.getMinutes()} minutes ${correctedClockTime.getSeconds()} seconds`}</div>
							<div className="grey stats d-flex justify-content-between">
								<div className="span">Size: {sizeToString[gameSettings["size"]]}</div>
								<div className="span">Nr.: {gameSettings["quantity"]}</div>
								<div className="span">Speed: {speedToString[gameSettings["speed"]]}</div>
							</div>

						</Container>
					</Row>
					<Row>
						<Container className="link">
							<div className="link__header">Share this game with your friends</div>
							<div className="grey">(link will include same settings as you had)</div>
						{ this.state.isCopied ?
							<div className="link__copied">Link copied <span role="img" aria-label="smiley face">&#128515;</span></div> 
							:
							<Button onClick={this.copyToClipboard} >Copy link</Button>
						}
						</Container>
					</Row>
				</ModalBody>
				<ModalFooter onClick={closeGameEndDialog} className="game-modal__footer">
					&gt;&gt;&gt;&nbsp;&nbsp; PLAY AGAIN &nbsp;&nbsp;&lt;&lt;&lt;
				</ModalFooter>
		</Modal>
	)};
};
