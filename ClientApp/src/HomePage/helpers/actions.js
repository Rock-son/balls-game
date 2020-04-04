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
	if (this.simulationApp) {
		this.simulationApp.destroy(false, { stageOptions: { children: true }});
		this.simulationApp = null;
	}
};

export { start } from "./start";