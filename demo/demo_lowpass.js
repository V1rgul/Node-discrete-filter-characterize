let discreteFilterCharacterize = require("../")
let gnuplot = require("gnu-plot")
let utils = require("../src/utils")


function genExponentialSmoothing(f){
	let acc = 0, RC = 1/(2*Math.PI*f)
	return function(data, step){
		let a = step / (RC+step)
		acc = (1-a)*acc + (a)*data
		return acc
	}
}


let result = discreteFilterCharacterize.bode(
	() => genExponentialSmoothing(1),
	{
		sampling:{
			nyquist: {
				marginFrequency:200, // this gets the phase to 89°. Useful if you need a lot of precision in the phase
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

