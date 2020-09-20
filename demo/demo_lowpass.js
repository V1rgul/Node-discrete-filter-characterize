let discreteFilterCharacterize = require("../")
let gnuplot = require("gnu-plot")
let utils = require("../src/utils")


function genLowPass(f){
	let acc = 0, RC = 1/(2*Math.PI*f)
	return function(data, step){
		let a = step / (RC+step)
		acc = (1-a)*acc + (a)*data
		return acc
	}
}


let result = discreteFilterCharacterize.bode(() => genLowPass(1), {
	//frequencies:{number:4},
	nyquistMargin: {
		frequency: 8,
		duration: 4,
	},
})

// console.log("result", result)

let resultsConverted  = result.map((e) => [
	e[0],
	utils.dB.fromRatio(e[1]),
	( (e[2] / (Math.PI*2))+.5) * 360, // convert to degrees
])

let plot = gnuplot()
plot.set({
	xlabel : "\"Frequency (Hz)\"",

	ylabel : "\"Magnitude (dB)\"",
	ytics : "nomirror textcolor 2",

	y2label: "\"Phase (°)\"",
	y2range: "[0:] reverse",
	y2tics : true,

	grid   : "xtics",
	logscale:"x 10",
}).plot([
	{
		title: "magnitude",
		axes: "x1y1",
		data: result.map((e) => [
			e[0],
			utils.dB.fromRatio(e[1])
		]),
	},{
		title: "phase",
		axes: "x1y2",
		data: result.map((e) => [
			e[0],
			(function(){ // convert to degrees
				let t = e[2] / (Math.PI*2)
				// if(t<0) t += .5
				return t*360
			})()
		]),
	}
])

