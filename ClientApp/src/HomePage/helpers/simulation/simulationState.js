import { resetSettings as gameResetSettings } from "../game/gameState";

export const simulationSettings = {
	isSimulationActive: true,
	// canvas state
	simulationRestarting: false,
	simulationPaused: false,
	simulationStopped: false,
	// modals - popups
	simulationSettingsOpen: false,
	// SETTINGS
	simulationSettings: {
		size: 8,
		speed: .6,
		quantity: 300,
		deactivateAfter: 0,
		showTime: true,
		showStats: true,
		autorestart: true
	}
}
export function toggleSimulationPause() {
	return this.state.simulationPaused && !this.state.simulationStopped ? this.unpause() : this.pause();
}
export function stopStartSimulation() {
	if (this.state.simulationPaused && !this.state.simulationStopped) { // CONTINUE
		this.toggleSimulationDialog();
	} else {
		this.stop();						// START
		this.startSimulation(true);
		this.setState(prevState => ({
			clockTime: new Date(0),
			simulationStopped: false,
			simulationPaused: false,
			startButtonText: "CONTINUE SIMULATION",
			simulationSettingsOpen: false,
			healthy: prevState.simulationSettings["quantity"] - 1, contagious: 1,
			// reset game settings
			...gameResetSettings,
			isGameActive: false,
			gamePaused: true,
			gameStopped: true,
			quarantineButtonsActive: false, // only for testing purposes
			availableQuarantines: []
		}));
	}
}
export function simulationRestart() {
	// fade out-in effect
	this.setState({ simulationRestarting: true });
	setTimeout(() => this.setState({ simulationRestarting: false }), 1200);
	setTimeout(() => {
		this.stop();
		this.startSimulation(true);
		this.setState(prevState => ({
			clockTime: new Date(0),
			simulationStopped: false,
			simulationPaused: false,
			startButtonText: "CONTINUE SIMULATION",
			simulationSettingsOpen: false,
			healthy: prevState.simulationSettings["quantity"] - 1,
			contagious: 1
		}));
	}, 600);

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
	}
	this.setState({ simulationRestarting: true });
	setTimeout(() => this.setState({ simulationRestarting: false }), 1000);
	setTimeout(() => {
		this.setState(prevState => {
			const newSimulationSettings = {...prevState.simulationSettings, ...parsedData};
			// only reset simulation for size and quantity - for preview
			if (parsedData["size"] || parsedData["quantity"] || parsedData["speed"]) {
				this.stop();
				this.startSimulation(false, newSimulationSettings);
				return ({ simulationSettings: newSimulationSettings, clockTime: new Date(0), healthy: newSimulationSettings["quantity"] - 1,
						contagious: 1, simulationStopped: true, simulationPaused: true, startButtonText: "START SIMULATION" });
			}
			return ({ simulationSettings: newSimulationSettings });
		});
	}, 400);
}

export function toggleSimulationDialog() {
	if (this.state.isGameActive) {
		this.setState({ gameRestarting: true });
		setTimeout(() => this.setState({ gameRestarting: false }), 1000);
		setTimeout(() => {
			this.stop();
			this.startSimulation(false);
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
	} else {
		// in all other cases toggle
		this.toggleSimulationPause();
		this.setState(prevState => {
			return ({
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