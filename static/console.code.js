function _jj_code_is(obj, type) {
	return Object.prototype.toString.call(obj) === `[object ${type}]`;
}

function _jj_code_time(){
	let n=new Date();
	return `${n.toLocaleDateString} ${n.getHours()}:${n.getMinutes()}:${n.getSeconds()}:${n.getMilliseconds()}`
}

function _jj_code_parseOutput(place, arr, type) {
	let index = -1;
	let result = `<div class="log-wrap"><span class="log-type__${type}">${_jj_code_time()} [ ${type} ]:</span>`;
	place.map((str) => {
		if (str == "%s") {
			index = index + 1;
			result += `<span class="log-str">${arr[index].toString()}</span>`;
		} else if (str == "%f" || str == "%d") {
			index = index + 1;
			result += `<span class="log-str">${Number(arr[index])}</span>`;
		} else if (str == "%o") {
			index = index + 1;
			if (_jj_code_is(arr[index], "Object")) {
				result += `<span class="log-str">${JSON.stringify(arr[index])}</span>`;
			} else if (_jj_code_is(arr[index], "Function")) {
				result += `<span class="log-str">${arr[index].toString()}</span>`;
			}
		} else {
			result += `<span class="log-str">${str}</span>`;
		}
	});
	result += "</div>";
	return result;
}

function genOutput(str, rest, type) {
	let output = "";
	if (typeof str === "string") {
		output = _jj_code_parseOutput(str.split(/(%s|%f|%o|%d)/), rest, type);
	} else {
		let objstr = "";
		if (_jj_code_is(str, "Object")) {
			objstr = `<span class="log-str">${JSON.stringify(str)}</span>`;
		} else {
			objstr = `<span class="log-str">${str.toString()}</span>`;
		}

		output = `<div class="log-wrap"><span class="log-type__${type}">${_jj_code_time()} [ ${type} ]:</span><span class="log-str">${objstr}</span></div>`;
	}
	return output;
}

var console = {
	sendMessage: function (type, data) {
		window.parent.postMessage(
			{
				type: type,
				data: data,
			},
			"*"
		);
	},
	log: function (str, ...rest) {
		let type = "log";
		console.sendMessage(type, genOutput(str, rest, type));
	},
	error: function (str, ...rest) {
		let type = "error";
		console.sendMessage(type, genOutput(str, rest, type));
	},
	info: function (str, ...rest) {
		let type = "info";
		console.sendMessage(type, genOutput(str, rest, type));
	},
	warn: function () {},
};
