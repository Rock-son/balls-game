import React from 'react'
import { Navbar, Nav, NavbarToggler,
	Collapse, NavItem, NavLink, NavbarText } from "reactstrap";


export const NavBar = props => {
	const { toggleNavItems, isNavBarOpen, toggleSimulationModal, toggleShareModal } = props;
	return(
		<Navbar dark className="main__navbar d-inline-flex justify-content-between" >
			<Navbar dark className="col-6 main__navbar__left d-inline-flex justify-content-between" expand="sm">
				<NavbarToggler onClick={toggleNavItems} />
				<Collapse isOpen={isNavBarOpen} navbar>
				<Nav className="navbar__nav left" navbar>
					<NavItem>
						<NavLink onClick={toggleSimulationModal} className="navbar__nav__link">Simulate</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block navbar__nav__separator">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="navbar__nav__link">Play game</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block navbar__nav__separator">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink onClick={toggleShareModal} className="navbar__nav__link">Share</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block navbar__nav__separator">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="navbar__nav__link">Hide</NavLink>
					</NavItem>
				</Nav>
				</Collapse>
			</Navbar>
			<Navbar dark className="col-6 main__navbar__right d-inline-flex justify-content-between" >
				<Nav className="navbar__nav caption" navbar>
					<NavItem>TheCovidSimulator</NavItem>
				</Nav>
				<Nav className="navbar__nav right " navbar>
					<NavItem className=" d-inline-flex justify-content-between">
						<NavbarText>Stay safe. For more visit&nbsp;</NavbarText>
						<NavLink href="https://www.countdownkings.com/">CountdownKings.com</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		</Navbar>
	);
};