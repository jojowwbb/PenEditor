function _jj_code_is(obj, type) {
	return Object.prototype.toString.call(obj) === `[object ${type}]`;
}

function _jj_code_time() {
	let n = new Date();
	return `${n.toLocaleDateString()} ${n.getHours()}:${n.getMinutes()}:${n.getSeconds()}:${n.getMilliseconds()}`;
}

function _jj_code_parseOutput(place, arr, type) {
	let index = -1;
	let result = `<div class="log-wrap"><span class="log-type__${type}">${_jj_code_time()} [ ${type} ]:</span>`;
	place.map((str) => {
		if (str == "%s") {
			index = index + 1;
			result += arr[index].toString();
		} else if (str == "%f" || str == "%d") {
			index = index + 1;
			result += Number(arr[index]);
		} else if (str == "%o") {
			index = index + 1;
			if (_jj_code_is(arr[index], "Object")) {
				result += JSON.stringify(arr[index]);
			} else if (_jj_code_is(arr[index], "Function")) {
				result += arr[index].toString();
			}
		} else {
			result += str;
		}
	});
	result += "</div>";
	return result;
}

function _jj_code_genOutput(str, rest, type) {
	let output = "";
	if (typeof str === "string") {
		output = _jj_code_parseOutput(str.split(/(%s|%f|%o|%d)/), rest, type);
	} else {
		let objstr = "";
		if (_jj_code_is(str, "Object")) {
			objstr = `<span class="log-str">${str.message ? str.message : JSON.stringify(str)}</span>`;
		} else {
			objstr = `<span class="log-str">${str.message ? str.message : str.toString()}</span>`;
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
		console.sendMessage(type, _jj_code_genOutput(str, rest, type));
	},
	error: function (str, ...rest) {
		let type = "error";
		console.sendMessage(type, _jj_code_genOutput(str, rest, type));
	},
	info: function (str, ...rest) {
		let type = "info";
		console.sendMessage(type, _jj_code_genOutput(str, rest, type));
	},
	warn: function (str, ...rest) {
		let type = "warn";
		console.sendMessage(type, _jj_code_genOutput(str, rest, type));
	},
};

window.addEventListener("error", function (error) {
	console.error(error);
});
