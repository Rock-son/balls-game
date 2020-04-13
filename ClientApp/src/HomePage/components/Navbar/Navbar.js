import React from 'react'
import { Button, Navbar, Nav, NavbarToggler,
	Collapse, NavItem, NavLink, NavbarText } from "reactstrap";


export const NavBar = props => {
	const { toggleNavbarItemsExpand, isNavbarExpanded, toggleNavbarVisibility, isNavbarVisible, contagious, healthy,
			toggleSimulationDialog, toggleShareDialog, toggleGameDialog, clockTime, simulationSettings: { showTime, showStats } } = props;
	const seconds = clockTime.getSeconds();
	const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

	return(
		<Navbar dark className={`main__navbar ${!isNavbarVisible && "hidden"} d-inline-flex justify-content-between`} >
			<Button 
				className={`main__navbar__toggler ${isNavbarVisible && "hidden"}`}
				onClick={toggleNavbarVisibility} 
				disabled={isNavbarVisible}
				>
					<svg height="15" width="20">
						<path d="M-2 2 l12 12 M10 15 l12 -13 Z" fill="none" strokeWidth="5" stroke="white"/>
					</svg>
			</Button>
			<Navbar dark className="col-6 main__navbar__left d-inline-flex justify-content-between" expand="sm">
				<NavbarToggler onClick={toggleNavbarItemsExpand} />
				<Collapse isOpen={isNavbarExpanded} navbar>
				<Nav className="navbar__nav left" navbar>
					<NavItem>
						<NavLink className="navbar__nav__link" onClick={toggleSimulationDialog}>Simulate</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block disabled stick">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink data="game" className="navbar__nav__link" onClick={toggleGameDialog}>Play game</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block disabled stick">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink data="game" className="navbar__nav__link" >Stay Safe</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block disabled stick">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="navbar__nav__link" onClick={toggleShareDialog}>Share</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block disabled stick">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="navbar__nav__link" >About</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block disabled stick">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="navbar__nav__link" onClick={toggleNavbarVisibility}>Hide</NavLink>
					</NavItem>
				</Nav>
				</Collapse>
			</Navbar>
			<Navbar dark className="col-6 main__navbar__right d-inline-flex justify-content-between" >
				<Nav className="navbar__nav caption" navbar>
					<NavItem>TheCovidSimulator</NavItem>
				</Nav>
				<Nav className="navbar__nav right" navbar>
					<NavItem className=" d-inline-flex justify-content-between">
						<NavbarText>Stay safe. For more visit&nbsp;</NavbarText>
						<NavLink 
							href="https://www.countdownkings.com/"
							target="_blank"
							rel="nooperner noreferrer"	
						>
							CountdownKings.com
						</NavLink>
					</NavItem>
					<NavItem className={`stats ${!isNavbarVisible && "drop"}`}>
						{
							showStats ? 
							<>
								<NavbarText className="stats__infected">Infected:&nbsp;{contagious}</NavbarText>
								<NavbarText className="stats__healthy">Healthy:&nbsp;{healthy}</NavbarText>	
							</>
							:
							""
						}
					</NavItem>
					<NavItem className={`timer ${!isNavbarVisible && "drop"}`}>
						{
							showTime ? `${clockTime.getMinutes()}:${formattedSeconds}` : ""
						}
					</NavItem>
				</Nav>
			</Navbar>
		</Navbar>
	);
};