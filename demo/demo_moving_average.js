let discreteFilterCharacterize = require("../")
let gnuplot = require("gnu-plot")
let utils = require("../src/utils")

let samplingFrequency = 50
let filterFrequency = 1

let filterTaps = samplingFrequency*filterFrequency

let samplingDuration = 5 / filterFrequency

let frequencyMin = 1/samplingDuration, frequencyMax = samplingFrequency/2



function genMovingAverage(taps){
	let fifo = new Array(taps).fill(0)
	return function(data, step){
		fifo.shift()
		fifo.push(data)
		let sum = fifo.reduce((acc,curr)=> (acc + curr), 0)
		let average = sum / fifo.length
		return average
	}
}


let result = discreteFilterCharacterize.bode(
	() => genMovingAverage(filterTaps),
	{
		frequencies: {
			min: frequencyMin,
			max: frequencyMax,
		},
		sampling: {
			type: "fixed", // /!\ needed for sample based filters
			fixed: {
				frequency: samplingFrequency,
				duration: samplingDuration,
			},
		},
	}
)

let resultsConverted  = result.map((e) => [
	e[0],
	utils.dB.fromRatio(e[1]),
	e[2] / (Math.PI*2) * 360, // convert to degrees
])

let plot = gnuplot()
plot.set({
	xlabel : "\"Frequency (Hz)\"",

	ylabel : "\"Magnitude (dB)\"",
	ytics : "nomirror",

	y2label: "\"Phase (°)\"",
	y2range: "[0:] reverse",
	y2tics : true,

	grid   : "xtics",
	logscale:"x 10",
}).plot([
	{
		title: "magnitude",
		axes: "x1y1",
		data: resultsConverted.map((e) => [
			e[0],
			e[1],
		]),
	},{
		title: "phase",
		axes: "x1y2",
		data: resultsConverted.map((e) => [
			e[0],
			e[2],
		]),
	}
])

