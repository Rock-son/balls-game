import { resetSettings as gameResetSettings } from "../game/gameState";
import { quantityValues } from "../../components/SimulationDialog/simulationOptions";

export const simulationSettings = {
	isSimulationActive: true,
	// canvas state
	simulationRestarting: false,
	simulationPaused: false,
	simulationStopped: false,
	pauseStartedAt: null,
	pausedTime: 0,
	// modals - popups
	simulationSettingsOpen: false,
	// SETTINGS
	simulationSettings: {
		size: 8,
		speed: .6,
		quantity: 300,
		healedAfter: 0,
		staysHealed: false,
		showTime: true,
		showStats: true,
		autorestart: true
	}
}
export function toggleSimulationPause() {
	return this.state.simulationPaused && !this.state.simulationStopped ? this.unpause() : this.pause();
}
export function stopStartSimulation() {
	 // CONTINUE
	if (this.state.simulationPaused && !this.state.simulationStopped) {
		this.toggleSimulationDialog();
	// START
	} else {	
		this.setState({ gameRestarting: true });
		setTimeout(() => this.setState({ gameRestarting: false }), 1000);
		setTimeout(() => {
			this.stop();
			this.startSimulation(true);
			this.setState(prevState => ({
				pausedTime: 0,
				pauseStartedAt: null,
				clockTime: new Date(0),
				simulationStopped: false,
				simulationPaused: false,
				startButtonText: "CONTINUE SIMULATION",
				simulationSettingsOpen: false,
				healthy: prevState.simulationSettings["quantity"] - 1, contagious: 1,
				// reset game settings but leave gameActive for active quarantine buttons
				...gameResetSettings,
				isGameActive: true,
				gamePaused: true,
				gameStopped: true,
				quarantineButtonsActive: false, // only for testing purposes
				availableQuarantines: []
			}));
		}, 400);
		// quarantine buttons will be reset if there are any
		setTimeout(() => {
			this.setState({ isGameActive: false });
		}, 500);
	}
}
export function simulationRestart() {
	// fade out-in effect
	this.setState({ simulationRestarting: true });
	setTimeout(() => this.setState({ simulationRestarting: false }), 1000);
	setTimeout(() => {
		this.stop();
		this.startSimulation(true);
		this.setState(prevState => ({
			clockTime: new Date(0),
			simulationStopped: false,
			simulationPaused: false,
			pausedTime: 0,
			pauseStartedAt: null,
			startButtonText: "CONTINUE SIMULATION",
			simulationSettingsOpen: false,
			healthy: prevState.simulationSettings["quantity"] - 1,
			contagious: 1,
			healed: 0
		}));
	}, 400);

}
export function setSimulationSettings(e) {
	let targetData, parsedData;
	// triggered on event
	if (e.currentTarget) {
		targetData = e.currentTarget.getAttribute("data-option");
		parsedData = JSON.parse(targetData) || {};
	} else {
		// triggered directly from dialog
		parsedData = e;
		this.setState({ gameRestarting: false });
		clearTimeout(this.gameTimeoutId);	
	}
	// change settings according to valid size / numbers values
	if (parsedData["size"]) {
		const minQuantity = quantityValues[parsedData["size"]][0] || 0;
		const maxQuantity = quantityValues[parsedData["size"]].slice(-1)[0] || 1000;
		
		// if quantity is greater or smaller than it should be according to size
		if (this.state.simulationSettings["quantity"] > maxQuantity) {
			parsedData["quantity"] = maxQuantity;
		}
		if (this.state.simulationSettings["quantity"] < minQuantity ) {
			parsedData["quantity"] = minQuantity;
		}
	}
	
	// fade in only on change (size, speed or quantity of balls)
	if (parsedData["size"] || parsedData["speed"] || parsedData["quantity"]) {
		setTimeout(() => this.setState({ gameRestarting: true }), 100);
		this.gameTimeoutId = setTimeout(() => this.setState({ gameRestarting: false }), 1200);
		setTimeout(() => {
			this.setState(prevState => {
				const newSimulationSettings = {...prevState.simulationSettings, ...parsedData};
				// only reset simulation for size and quantity - for preview
				if (parsedData["size"] || parsedData["quantity"] || parsedData["speed"]) {
					this.stop();
					this.startSimulation(false, newSimulationSettings);
					return ({ 
						simulationSettings: newSimulationSettings, 
						clockTime: new Date(0), 
						healthy: newSimulationSettings["quantity"] - 1,
						contagious: 1, 
						healed: 0, 
						simulationStopped: true, 
						simulationPaused: true, 
						startButtonText: "START SIMULATION" 
					});
				}
				return ({ simulationSettings: newSimulationSettings });
			});
		}, 500);
	} else {
		this.setState(prevState => {
			const newSimulationSettings = {...prevState.simulationSettings, ...parsedData};
			// only reset simulation for size and quantity - for preview
			if (parsedData["size"] || parsedData["quantity"] || parsedData["speed"]) {
				this.stop();
				this.startSimulation(false, newSimulationSettings);
				return ({ 
					simulationSettings: newSimulationSettings, 
					clockTime: new Date(0), 
					healthy: newSimulationSettings["quantity"] - 1,
					contagious: 1, 
					healed: 0, 
					simulationStopped: true, 
					simulationPaused: true, 
					startButtonText: "START SIMULATION" 
				});
			}
			return ({ simulationSettings: newSimulationSettings });
		});
	}
}
export function toggleSimulationDialogAfterNoRestart(e) {
	e && e.preventDefault();
	e && e.stopPropagation();
	this.setState(prevState => {
		return ({
			simulationSettingsOpen: !prevState.simulationSettingsOpen,
			simulationPaused: !prevState.simulationPaused,
			simulationStopped: true,
			startButtonText: "START SIMULATION",
			isSimulationActive: true,
			isGameActive: false,
			gamePaused: true,
			gameStopped: true
		})
	});
}

export function toggleSimulationDialog(e) {
	e && e.preventDefault();
	e && e.stopPropagation();
	// IF GAME ACTIVE
	if (this.state.isGameActive) {
		this.setState({ gameRestarting: true });
		setTimeout(() => this.setState({ gameRestarting: false }), 1000);
		setTimeout(() => {
			this.stop();
			this.startSimulation(false);
			// delete url params if they exist	
			if (window.location.search !== "") {
				window.history.replaceState({}, document.title, "/");
			}
			// only when clicking on navbar link -> stop game and show simulation dialog
			this.setState(prevState => {
				return ({
					simulationSettingsOpen: true,
					simulationPaused: true,
					startButtonText: "START SIMULATION",
					quarantineButtonsActive: false,
					isSimulationActive: true,
					isGameActive: false,
					gamePaused: true,
					gameStopped: true
				})
			});
		}, 400);
	// IF SIMULATION ACTIVE - PAUSE
	} else {
		this.toggleSimulationPause();
		this.setState(prevState => {
			// if simulation was paused - sum time up, if not - pausedTime stays the same
			const isPauseBeginningForHealing = prevState.simulationSettings["healedAfter"] > 0 && !prevState.simulationPaused;
			return ({
				pauseStartedAt: isPauseBeginningForHealing ? new Date().getTime() : null,
				pausedTime: prevState.pauseStartedAt == null ? 0 : new Date().getTime() - prevState.pauseStartedAt,
				simulationSettingsOpen: !prevState.simulationSettingsOpen,
				simulationPaused: !prevState.simulationPaused,
				startButtonText: prevState.simulationStopped ? "START SIMULATION" : "CONTINUE SIMULATION",
				isSimulationActive: true,
				isGameActive: false,
				gamePaused: true,
				gameStopped: true
			})
		});
	}
}