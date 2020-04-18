import React from 'react';
import { Container, Row } from 'reactstrap';

import instructions from "../HowToPlayDialog/howToPlayInstructions";

export const InstructionsPopover = (props) => {
	const { isOpen, mode, modeType } = props;

  	return (
		<Container className={`popover ${isOpen ? "visible" : ""}`}>
			<Row className="popover-title">
				{modeType}
			</Row>
			<Row classID="popover-body">
				{instructions[mode].map(instruction =>
					<div className="popover-body-item">{instruction}</div>
				)}
			</Row>
			<span className="arrow"></span>
		</Container>
	);
}
