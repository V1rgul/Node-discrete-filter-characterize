let dftEasy = require("dft-easy")
let utils = require("../utils")

function genFilteredData(filterGenerator, options, f){
	let filter = filterGenerator()
	let sampling = options.sampling.fn(f)
	// console.log(sampling)

	let filteredData = []
	for(let t=0; t<sampling.duration; t+=sampling.step){
		let d = Math.cos(t*2*Math.PI*f)
		filteredData.push([t, filter(d, sampling.step, t)])
	}
	// console.log(filteredData)
	return filteredData
}

function bodeFrequency(filterGenerator, options, f){
	let dataFiltered = genFilteredData(filterGenerator, options, f)

	let result = dftEasy(dataFiltered, {
		window     : options.dftWindow,
		frequencies: {list:[f]},
	})[0]

	// console.log("result", result)

	return result
}

function doBode(filterGenerator, options){
	let resultsByFrequency = options.frequencies.list.map(function(f){
		return bodeFrequency(filterGenerator, options, f)
	})
	return resultsByFrequency
}

module.exports = doBode
