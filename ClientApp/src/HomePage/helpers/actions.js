export function pause() {
	if (this.simulationApp && this.simulationApp.ticker && this.simulationApp.ticker.started) {
		return this.simulationApp.ticker.stop();
	}
};

export function unPause() {
	if (this.simulationApp) {
		return this.simulationApp.ticker.start();
	}
};

export function stop() {
	if (this.simulationApp) {
		this.simulationApp.destroy();
		this.simulationApp = null
		console.log("this.simulat", this.simulationApp);
		
		return;
	}
};

export { start } from "./start";