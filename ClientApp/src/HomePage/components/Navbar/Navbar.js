import React, { useState } from 'react'
import { Button, Navbar, Nav, NavbarToggler,
	Collapse, NavItem, NavLink, NavbarText } from "reactstrap";

import "./navbar.scss";

export const NavBar = props => {
	const { toggleNavbarItemsExpand, isNavbarExpanded, toggleNavbarVisibility, isNavbarVisible, contagious,
		healthy, isGameActive, gamePaused, toggleSimulationDialog, toggleShareDialog, toggleGameDialog, clockTime,
		simulationSettings: { showTime, showStats }, gameSettings: { delayInSeconds } } = props;

	// count in the in-game start delay
	let formattedSeconds, seconds, minutes;
	const currentSeconds = clockTime.getSeconds();
	const shouldCountdownBeVisible = clockTime.getTime() < 4000;

	// this is the only place where seconds are mishandled
	const delayedSeconds = (clockTime.getTime() / 1000) - delayInSeconds;
	if (isGameActive) {
		minutes = delayedSeconds < 4 ? "0" : new Date(clockTime.getTime() - delayInSeconds*1000).getMinutes();
		seconds = delayedSeconds % 60;
		formattedSeconds = seconds < 0 ? "00" : seconds < 10 ? "0" + seconds : seconds;
	} else {
		minutes = clockTime.getMinutes();
		seconds = currentSeconds;
		formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
	}

	// start countdown on game start
	const gameStartCountdownTime = (delayedSeconds < 0) ? (-delayedSeconds) : "";
	return(
		<Navbar dark className={`main__navbar ${!isNavbarVisible && "hidden"} d-inline-flex justify-content-between`} >
			<Button
				className={`main__navbar__toggler ${isNavbarVisible && "hidden"}`}
				onClick={toggleNavbarVisibility}
				disabled={isNavbarVisible}
				>
					<img src="dropdown-arrow.svg" alt="hide/unhide navbar"></img>
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
					<NavItem className="navbar__nav__link caption"><strong>ViralBalls</strong>
						<span className="ordinary">{isGameActive ? "Game" : "Simulator"}</span>
					</NavItem>
				</Nav>
				</Collapse>
			</Navbar>
			<Navbar dark className="col-6 main__navbar__right d-inline-flex justify-content-end" >
				<Nav className="navbar__nav right" navbar>
					<NavItem className="d-inline-flex justify-content-between">
						<NavbarText className="countdown-link">Stay safe. For more visit&nbsp;</NavbarText>
						<NavLink
							className="countdown-link"
							href="https://www.countdownkings.com/"
							target="_blank"
							rel="nooperner noreferrer"
						>
							CountdownKings.com
						</NavLink>
					</NavItem>
					<NavItem className={`stats ${!isNavbarVisible ? "drop" : ""}`}>
						<NavbarText className="stats__infected">{showStats ? `Infected: ${contagious}` : ""}</NavbarText>
						<NavbarText className="stats__healthy">{showStats ? `Healthy: ${healthy}` : ""}</NavbarText>
						<NavbarText className="stats__timer">{showTime ? `${minutes}:${formattedSeconds}` : ""}</NavbarText>
					</NavItem>
				</Nav>
			</Navbar>
			<div className={`game-start-countdown ${isGameActive && !gamePaused && shouldCountdownBeVisible ? "visible" : ""}`}>{gameStartCountdownTime}</div>
		</Navbar>
	);
};