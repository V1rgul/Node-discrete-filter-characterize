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


	options.sampling = {}
	let genSamplingNyquist = function genSamplingNyquist(){
		options.sampling.nyquist = {}
		utils.assign.fillDefaultsGen(
			options.sampling.nyquist,
			optionsUser.sampling && optionsUser.sampling.nyquist || {},
			{
				marginFrequency: () => 8,
				marginDuration : () => 4,
			}
		)
	}

	if(optionsUser.sampling && optionsUser.sampling.fn){
		/**
		 * User provided sampling calculation
		 * @param f frequency currently analyzed
		 * @return {step, duration} sampling period, sampling duration
		 */
		options.sampling.fn = optionsUser.sampling.fn
	} else if(optionsUser.sampling && optionsUser.sampling.type === "fixed") {
		// use static sampling

		options.sampling.fixed = {}
		options.sampling.type = "fixed"
		utils.assign.fillDefaultsGen(options.sampling.fixed, optionsUser.sampling && optionsUser.sampling.fixed || {}, {
			frequency: function(){
				genSamplingNyquist()
				return options.sampling.nyquist.marginFrequency * options.frequencies.list[options.frequencies.list.length-1]
			},
			duration : function(){
				genSamplingNyquist()
				return options.sampling.nyquist.marginDuration / options.frequencies.list[0]
			},
		})
		options.sampling.fn = function(f){
			return {
				step    : 1/options.sampling.fixed.frequency,
				duration: options.sampling.fixed.duration
			}
		}
	} else {
		// use dynamic sampling by default because it is faster

		options.sampling.type = "nyquist"
		genSamplingNyquist()
		options.sampling.fn = function(f){
			return {
				step    : 1/(f*options.sampling.nyquist.marginFrequency),
				duration: options.sampling.nyquist.marginDuration/f,
			}
		}
	}

	// console.log("optionsUser", optionsUser)
	// console.log("options", options)
	options.constructed = true
	return options
}


function main(filterGenerators, optionsUser){
	let options = constructOptions(optionsUser, true)

	return bode(filterGenerators, options)
}


main.constructOptions = constructOptions
module.exports = main
