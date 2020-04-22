export const sizeOptions = [
	{ type: "Small", value: 5 },
	"|",
	{ type: "Medium", value: 8 },
	"|",
	{ type: "Large", value: 10 },
];
export const quantityValues = {
	"5": [ 100, "|", 200, "|", 300, "|", 400, "|", 500, "|", 700, "|", 800, "|", 1000 ],
	8: [ 100, "|", 200, "|", 300, "|", 400, "|", 500, "|", 600, "|", 700, "|", 800 ],
	"10": [  50, "|", 100,"|", 150, "|", 200, "|", 300, "|", 400, "|", 500 ]
};
export const speedOptions = [
	{ type: "Slow", value: .3 },
	"|",
	{ type: "Medium", value: .6 },
	"|",
	{ type: "Fast", value: 1 },
];
export const healedOptions = [
	0,
	"|",
	10000,
	"|",
	20000,
	"|",
	30000,
	"|",
	60000,
	"|"
];
export const healedSpeedVals = {
	"0.3": 30000,
	"0.6": 20000,
	"1" : 10000
};
export const booleanOptions = [
	{ type: "yes", value: true },
	"|",
	{ type: "no", value: false }
];