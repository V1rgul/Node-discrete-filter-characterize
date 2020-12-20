# Node-discrete-filter-characterize

## Exemple

```js
function genExponentialSmoothing(frequency){
	let acc = 0, RC = 1/(2*Math.PI*frequency)
	return function(data, step){
		let a = step / (RC+step)
		acc = (1-a)*acc + (a)*data
		return acc
	}
}

let result = discreteFilterCharacterize.bode( () => genExponentialSmoothing(1) )
```
![demo/demo_lowpass.js output screeshot](/demo/demo_lowpass.png)



Please see the [Demo Folder](/demo/)


