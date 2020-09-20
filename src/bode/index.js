let bode = require("./bode")
let utils = require("../utils")
let dftEasy = require ("dft-easy")


function constructOptions(optionsUser, useConstructed){
	optionsUser = optionsUser || {}
	if(useConstructed && optionsUser.constructed) return optionsUser

	let options = {}
	utils.assign.fillDefaultsGen(options, optionsUser, {
		dftWindow: () => dftEasy.windows.Hann()
	})

	options.nyquistMargin = {}
	utils.assign.fillDefaultsGen(options.nyquistMargin, optionsUser.nyquistMargin, {
		frequency: () => 8,
		duration : () => 4,
	})


	options.frequencies = {
		list: (optionsUser.frequencies && optionsUser.frequencies.list) || {}
	}
	if(!Array.isArray(options.frequencies.list)){
		utils.assign.fillDefaultsGen(options.frequencies, optionsUser.frequencies, {
			min    : () => 1e-3,
			max    : () => 1e3,
			number : () => 4096,
			logBase: () => 10,
		})

		options.frequencies.list = new Array(options.frequencies.number)
		let logMin = utils.logBase(options.frequencies.logBase, options.frequencies.min)
		let logMax = utils.logBase(options.frequencies.logBase, options.frequencies.max)

		for(let i=0; i<options.frequencies.number; i++){
			let tLinear = i/(options.frequencies.number-1)
			let tLog = utils.mapTo(logMin, logMax, tLinear)
			let f = Math.pow(options.frequencies.logBase, tLog)
			options.frequencies.list[i] = f
		}
	}

	options.constructed = true
	return options
}


function main(filterGenerators, optionsUser){
	let options = constructOptions(optionsUser, true)

	return bode(filterGenerators, options)
}


main.constructOptions = constructOptions
module.exports = main
