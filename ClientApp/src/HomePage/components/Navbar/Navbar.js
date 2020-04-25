import React from 'react'
import { Button, Navbar, Nav, NavbarToggler,
	Collapse, NavItem, NavLink, NavbarText } from "reactstrap";

import "./navbar.scss";

export const NavBar = props => {
	const { onMouseMove, onWheel, toggleNavbarItemsExpand, isNavbarExpanded, toggleNavbarVisibility, isNavbarVisible, contagious, healed, toggleStaySafeDialog,
		healthy, isGameActive, gamePaused, toggleSimulationDialog, toggleShareDialog, toggleGameDialog, toggleAboutDialog, clockTime, gameTimeDifficultyInSeconds,
		simulationSettings: { healedAfter, showTime, showStats }, gameSettings: { delayInSeconds, mode, difficulty }, gameEnded, toggleDialog } = props;

	// count in the in-game start delay
	let formattedSeconds, seconds, minutes;
	const currentSeconds = clockTime.getSeconds();
	const shouldCountdownBeVisible = clockTime.getTime() < 4000;
	

	// OPEN TIME - countup mode
	const delayedSeconds = (clockTime.getTime() / 1000) - delayInSeconds;
	if (isGameActive && mode === 0) {
		minutes = delayedSeconds < 4 ? "0" : new Date(clockTime.getTime() - delayInSeconds*1000).getMinutes();
		seconds = delayedSeconds % 60;
		formattedSeconds = seconds < 0 ? "00" : seconds < 10 ? "0" + seconds : seconds;
	} 
	// TIME CHALLENGE - countdown mode
	else if (isGameActive && mode === 1) {
		const positiveSeconds = delayedSeconds < 0 ? 0 : delayedSeconds;
		const coundownTime = new Date((gameTimeDifficultyInSeconds[difficulty]*60 - positiveSeconds) * 1000);
		minutes = coundownTime.getMinutes();
		seconds = coundownTime.getSeconds();
		formattedSeconds = seconds < 0 ? "00" : seconds < 10 ? "0" + seconds : seconds;
		if (gameEnded) {
			minutes = "0";
			formattedSeconds = "00";
		}
	} else {
		minutes = clockTime.getMinutes();
		seconds = currentSeconds;
		formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
	}

	// start countdown on game start
	const gameStartCountdownTime = (delayedSeconds < 0) ? (-delayedSeconds) : "";
	return(
		<>
		<Navbar
			onPointerMove={onMouseMove} 
			onWheel={onWheel} 
			onClick={toggleDialog} 
			dark className={`main__navbar ${!isNavbarVisible && "hidden"} d-inline-flex justify-content-between`} 
			>
			<Navbar dark className="col-6 main__navbar__left d-inline-flex justify-content-between" expand="xl" >
				<div className="caption">
					<div className="bold">ViralBalls</div>
					<div className="ordinary">{isGameActive ? "Game" : "Simulator"}</div>
				</div>
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
						<NavLink data="game" className="navbar__nav__link " onClick={toggleGameDialog}>Play game</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="d-none d-sm-block disabled stick">|</NavLink>
					</NavItem>
					<NavItem>
						<NavLink data="game" className="navbar__nav__link" onClick={toggleStaySafeDialog}>Stay Safe</NavLink>
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
						<NavLink className="navbar__nav__link" onClick={toggleAboutDialog}>About</NavLink>
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
			<Navbar dark className="col-6 main__navbar__right d-inline-flex justify-content-end" >
				<Nav className="navbar__nav right" navbar>
					<NavItem className="d-inline-flex justify-content-between">
						<NavbarText className="countdownkings countdownkings__text">Stay safe. For more visit&nbsp;</NavbarText>
						<NavLink
							className="countdownkings countdownkings__link"
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
						<NavbarText className="stats__healed">{showStats && healedAfter > 0 ? `Healed: ${healed}` : ""}</NavbarText>
						<NavbarText className="stats__timer">{showTime ? `${minutes}:${formattedSeconds}` : ""}</NavbarText>
					</NavItem>
				</Nav>
			</Navbar>
			<div className={`game-start-countdown ${isGameActive && !gamePaused && shouldCountdownBeVisible ? "visible" : ""}`}>{gameStartCountdownTime}</div>
		</Navbar>
		<Button
				className={`main__navbar__toggler ${isNavbarVisible ? "hidden" : "activated"}`}
				onClick={toggleNavbarVisibility}
				disabled={isNavbarVisible}
				>
					<svg x="0px" y="0px" width="21" height="11">
						<polygon class="arrow" points="10.44,10.39 0.44,4.39 0.44,-0.02 10.44,5.98 20.44,-0.02 20.44,4.39 "/>
					</svg>
		</Button>
	</>
	);
};