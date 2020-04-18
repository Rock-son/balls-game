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
					onPointerDown={setQuarantineInMotion}
					className={`btn quarantine__btn quarantine__btn--left-top ${!quarantineButtonsActive && "disabled"}`}>
						QUARANTINE
				</Button>
				<Button
					onPointerDown={setQuarantineInMotion}
					className={`btn quarantine__btn quarantine__btn--left-bottom ${!quarantineButtonsActive && "disabled"}`}>
						QUARANTINE
				</Button>
				<Button
					onPointerDown={setQuarantineInMotion}
					className={`btn quarantine__btn quarantine__btn--right-top ${!quarantineButtonsActive && "disabled"}`}>
						QUARANTINE
				</Button>
				<Button
					onPointerDown={setQuarantineInMotion}
					className={`btn quarantine__btn quarantine__btn--right-bottom ${!quarantineButtonsActive && "disabled"}`}>
						QUARANTINE
				</Button>
			</>
		);
	}
}