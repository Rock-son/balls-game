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
		// https://pixijs.download/dev/docs/PIXI.Application.html#destroy
		// (everything should be destroyed when not needed —> garbage collector)
		// removes children, but leaves canvas element
		this.simulationApp.destroy(false, { stageOptions: { children: true }});
		this.simulationApp = null;
	}
};

export { start } from "./start";