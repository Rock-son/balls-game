import React from "react";   
import { Button } from "reactstrap";

import "./quarantineButtons.scss";

export class QuarantineButtons extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.quarantineButtonsActive !== this.props.quarantineButtonsActive) {
			return true;
		}
		return false;
	}
	// TODO: all logic for button handling!

	render() {
		const { quarantineButtonsActive, setQuarantineInMotion } = this.props;
		
		return (
			<>
				<Button
					onClick={setQuarantineInMotion}
					className={`btn btn-success quarantine__btn quarantine__btn--left-top ${!quarantineButtonsActive && "disabled"}`}>
						Quarantine
				</Button>
				<Button
					onClick={setQuarantineInMotion}
					className={`btn btn-success quarantine__btn quarantine__btn--left-bottom ${!quarantineButtonsActive && "disabled"}`}>
						Quarantine
				</Button>
				<Button
					onClick={setQuarantineInMotion}
					className={`btn btn-success quarantine__btn quarantine__btn--right-top ${!quarantineButtonsActive && "disabled"}`}>
						Quarantine
				</Button>
				<Button
					onClick={setQuarantineInMotion}
					className={`btn btn-success quarantine__btn quarantine__btn--right-bottom ${!quarantineButtonsActive && "disabled"}`}>
						Quarantine
				</Button>
			</>
		);
	}
}