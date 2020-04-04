export function pause() {
	if (this.simulationApp) {
		return this.simulationApp.ticker.stop();
	}
};

export function unPause() {
	if (this.simulationApp) {
		return this.simulationApp.ticker.start();
	}
};

export function stop() {
	if (this.simulationApp && this.simulationApp.ticker) {
		console.log("wtf else");
		
		return this.simulationApp.ticker.destroy();
	}
};

export { start } from "./start";