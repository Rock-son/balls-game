import React from "react";   
import { Row, Modal, ModalHeader, ModalBody, Container, NavLink } from "reactstrap";

import { instructions } from "./staySafeInstructions";
import { page0, page1, page2, page3, page4, page5, page6, page7 } from "./staySafeComponents";
import "./staySafeDialog.scss";
import image0 from "../../assets/01-stay-safe.png";
import image1 from "../../assets/02-stay-safe-avoid-crowds.png";
import image2 from "../../assets/03-stay-safe-supply.png";
import image3 from "../../assets/04-stay-safe-sufficient.png";
import image4 from "../../assets/05-stay-safe-immunity.png";
import image5 from "../../assets/06-stay-safe-social.png";
import image6 from "../../assets/07-stay-safe-other-ideas.png";
import image7 from "../../assets/08-stay-safe-conclude.png";
const imageArr = [image0, image1, image2, image3, image4, image5, image6, image7];
const pageArr = [page0, page1, page2, page3, page4, page5, page6, page7];

export class StaySafeDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { page: 0, pageTurn: false, maxPage: instructions.length -1 };

		this.movePage = this.movePage.bind(this);
		this.closeDialog = this.closeDialog.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.isOpen !== this.props.isOpen || nextState.page !== this.state.page || nextState.pageTurn !== this.state.pageTurn) {			
			return true;
		}
		return false;
	}
	closeDialog(e) {
		this.setState({ page: 0 });
		this.props.toggle();
	}

	movePage(e) {
		e.preventDefault();
		if (this.state.page === this.state.maxPage) {
			return this.closeDialog();
		}
		this.setState({ pageTurn: true });
		setTimeout(() => this.setState({ pageTurn: false }), 1000);
		setTimeout(() => {
		this.setState(prevState => {
			if (prevState.maxPage === prevState.page) {
				return { page: 0 };
			}
			return { page: prevState.page + 1}
		});
	}, 500);
}


	render() {
		const { isOpen, toggle } = this.props;		
		const Page = pageArr[this.state.page];

		return (
			<Modal key="staysafe-dialog" zIndex={isOpen ? 1000: -1} isOpen={isOpen} toggle={this.closeDialog} centered={false} fade={true} className="staysafe-dialog">
				<ModalHeader charCode="X" toggle={this.closeDialog}></ModalHeader>
				<ModalBody className="d-flex">
					<Row>
						<Container className="staysafe-dialog__container">
							<img className="staysafe-dialog__container__image" src={imageArr[this.state.page]} alt={instructions[this.state.page].imageName} />
							<h3 className="staysafe-dialog__container__caption">{instructions[this.state.page].caption}</h3>
							<Page />
						</Container>
					</Row>
					<NavLink
						className="staysafe-dialog__btn"
						onClick={this.movePage}
						tabIndex="0"
						role="button"
					>
					{this.state.page === this.state.maxPage ? "CLOSE" : "NEXT"}
					</NavLink>
					<div
						className={`dialog-fadein ${this.state.pageTurn? "visible" : ""}`}
						tabIndex="-1"
						role="presentation" />
				</ModalBody>
			</Modal>
		)
	};
};
