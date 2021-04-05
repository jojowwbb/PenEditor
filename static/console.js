"use strict";

function _jj_code_is(obj, type) {
  return Object.prototype.toString.call(obj) === "[object ".concat(type, "]");
}

function _jj_code_time() {
  var n = new Date();
  return "".concat(n.toLocaleDateString(), " ").concat(n.getHours(), ":").concat(n.getMinutes(), ":").concat(n.getSeconds(), ":").concat(n.getMilliseconds());
}

function _jj_code_parseOutput(place, arr, type) {
  var index = -1;
  var result = "<div class=\"log-wrap\"><span class=\"log-type__".concat(type, "\">").concat(_jj_code_time(), " [ ").concat(type, " ]:</span>");
  place.map(function (str) {
    if (str == "%s") {
      index = index + 1;
      result += "<span class=\"log-str\">".concat(arr[index].toString(), "</span>");
    } else if (str == "%f" || str == "%d") {
      index = index + 1;
      result += "<span class=\"log-str\">".concat(Number(arr[index]), "</span>");
    } else if (str == "%o") {
      index = index + 1;

      if (_jj_code_is(arr[index], "Object")) {
        result += "<span class=\"log-str\">".concat(JSON.stringify(arr[index]), "</span>");
      } else if (_jj_code_is(arr[index], "Function")) {
        result += "<span class=\"log-str\">".concat(arr[index].toString(), "</span>");
      }
    } else {
      result += "<span class=\"log-str\">".concat(str, "</span>");
    }
  });
  result += "</div>";
  return result;
}

function genOutput(str, rest, type) {
  var output = "";

  if (typeof str === "string") {
    output = _jj_code_parseOutput(str.split(/(%s|%f|%o|%d)/), rest, type);
  } else {
    var objstr = "";

    if (_jj_code_is(str, "Object")) {
      objstr = "<span class=\"log-str\">".concat(JSON.stringify(str), "</span>");
    } else {
      objstr = "<span class=\"log-str\">".concat(str.toString(), "</span>");
    }

    output = "<div class=\"log-wrap\"><span class=\"log-type__".concat(type, "\">").concat(_jj_code_time(), " [ ").concat(type, " ]:</span><span class=\"log-str\">").concat(objstr, "</span></div>");
  }

  return output;
}

var console = {
  sendMessage: function sendMessage(type, data) {
    window.parent.postMessage({
      type: type,
      data: data
    }, "*");
  },
  log: function log(str) {
    var type = "log";

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    console.sendMessage(type, genOutput(str, rest, type));
  },
  error: function error(str) {
    var type = "error";

    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    console.sendMessage(type, genOutput(str, rest, type));
  },
  info: function info(str) {
    var type = "info";

    for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      rest[_key3 - 1] = arguments[_key3];
    }

    console.sendMessage(type, genOutput(str, rest, type));
  },
  warn: function warn() {}
};