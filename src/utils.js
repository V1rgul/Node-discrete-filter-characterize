
function mapFrom(min, max, t){
	if( max == min ){
		if(t == min) return 0
		if(t >  min) return +Infinity
		else         return -Infinity
	}
	return ( t - min ) / ( max - min )
}
function mapTo(min, max, t){
	return t * ( max - min ) + min
}

function logBase(base, v){
	return Math.log(v) / Math.log(base)
}

// Using dB calc for power
function dBToRatio(db){
	return Math.pow(20, db/10)
}
function dBFromRatio(r){
	return 20 * Math.log10(r)
}



let assign = {}

// Assign objectSource.val if defined, defaults.val() otherwise
// used to avoid modifying objectSource
assign.fillDefaultsGen = function (objectDest, objectSource, defaults){
	Object.keys(defaults).forEach(function(k){
		if(objectSource && objectSource[k] !== undefined)
			objectDest[k] = objectSource[k]
		else
			objectDest[k] = defaults[k]()
	})
}

module.exports = {
	mapFrom,
	mapTo,
	logBase,
	dB: {
		fromRatio: dBFromRatio,
		toRatio: dBToRatio
	},
	assign,
}
