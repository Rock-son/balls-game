export function pause() {
	if (this.simulationApp) {
		return this.simulationApp.ticker.stop();
	}
	else if (this.gameApp) {
		return this.gameApp.ticker.stop();

	}
};

export function unPause() {
	if (this.simulationApp) {
		return this.simulationApp.ticker.start();
	}
	else if (this.gameApp) {
		return this.gameApp.ticker.start();
	}
};

export function stop() {
	if (this.simulationApp) {
		// https://pixijs.download/dev/docs/PIXI.Application.html#destroy
		// (everything should be destroyed when not needed —> garbage collector)
		// removes children, but leaves canvas element
		this.simulationApp.destroy(true);
		this.simulationApp = null;
	}
	else if (this.gameApp) {
		// https://pixijs.download/dev/docs/PIXI.Application.html#destroy
		// (everything should be destroyed when not needed —> garbage collector)
		// removes children, but leaves canvas element
		this.gameApp.destroy(true);
		this.gameApp = null;
	}
};

export { startSimulation } from "./simulation/startSimulation";
export { startGame } from "./game/startGame";