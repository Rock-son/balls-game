export const modeOptions = [
	{ type: "Keep Uninfected", value: 0 },
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
	{ type: "Small", value: 5 },
	"|",
	{ type: "Medium", value: 8 },
	"|",
	{ type: "Large", value: 10 },
];
// depend on size and difficulty: easy: 0, medium: 1, hard: 2
export const quantityValues = {
	"5": [ 100, "|", 200, "|", 300, "|", 400, "|", 500, "|", 700, "|", 800, "|", 1000 ],
	8: [ 100, "|", 200, "|", 300, "|", 400, "|", 500, "|", 600, "|", 700, "|", 800 ],
	"10": [  50, "|", 100,"|", 150, "|", 200, "|", 300, "|", 400, "|", 500, "|", 600 ]
};
export const quantityDiffVals = {
	0: {
		"5": { min: 100, max: 1000},
		8: { min: 100, max: 800},
		"10": { min: 50, max: 600},
	},
	1: {
		"5": { min: 300, max: 1000},
		8: { min: 300, max: 800},
		"10": { min: 150, max: 600},
	},
	2: {
		"5": { min: 700, max: 1000},
		8: { min: 600, max: 800},
		"10": { min: 300, max: 600},}
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

export const speedToString = {
	0.3: "slow",
	0.6: "medium",
	1: "fast"
}
export const sizeToString = {
	5: "small",
	8: "medium",
	10: "large"
}