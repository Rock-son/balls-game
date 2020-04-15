export const modeOptions = [
	{ type: "Open Time", value: 0 },
	"|",
	{ type: "Time Challenge", value: 1 }
];
export const difficultyOptions = [
	{ type: "Easy", value: 0 },
	"|",
	{ type: "Medium", value: 1 },
	"|",
	{ type: "Hard", value: 2 },
];
export const sizeOptions = [
	{ type: "Small", value: 2.5 },
	"|",
	{ type: "Medium", value: 5 },
	"|",
	{ type: "Large", value: 7.5 },
];
// depend on size and difficulty: easy: 0, medium: 1, hard: 2
export const quantityValues = {
	"2.5": [ 100, "|", 200, "|", 300, "|", 400, "|", 500, "|", 700, "|", 800, "|", 1000 ],
	5: [ 100, "|", 200, "|", 300, "|", 400, "|", 500, "|", 600, "|", 700, "|", 800 ],
	"7.5": [  50, "|", 100,"|", 150, "|", 200, "|", 300, "|", 400, "|", 500, "|", 600 ]
};
export const quantityDiffVals = {
	0: {
		"2.5": { min: 100, max: 1000},
		5: { min: 100, max: 800},
		"7.5": { min: 50, max: 600},
	},
	1: {
		"2.5": { min: 300, max: 1000},
		5: { min: 300, max: 800},
		"7.5": { min: 150, max: 600},
	},
	2: {
		"2.5": { min: 700, max: 1000},
		5: { min: 600, max: 800},
		"7.5": { min: 300, max: 600},}
}
// depends on difficulty
export const speedOptions = [
	{ type: "Slow", value: 0.3, difficulty: 0 },
	"|",
	{ type: "Medium", value: .6, difficulty: 1 },
	"|",
	{ type: "Fast", value: 1, difficulty: 2 }
];

export const speedDiffValues = {
	0: .3,
	1: .6,
	2: 1
}
