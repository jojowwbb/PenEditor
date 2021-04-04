//code mirror 核心
import * as CodeMirror from "codemirror/lib/codemirror";

import "./formatting";

import "codemirror/lib/codemirror.css";

//主题
import "codemirror/theme/material.css";

//语法支持
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";

//折叠
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldgutter.css";

//括号匹配
import "codemirror/addon/edit/matchbrackets";

//代码补全
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/show-hint.css";

//快捷键方案
import "codemirror/keymap/sublime.js";

//emmet 插件
import emmet from "@emmetio/codemirror-plugin";

emmet(CodeMirror);

function debounce(fn, wait) {
	var timer = null;
	return function () {
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(fn, wait);
	};
}

function handle() {
	console.log(Math.random());
}

export function initCodeEditor(dom, mode, initValue, fn) {
	let editor = CodeMirror.fromTextArea(dom, {
		mode: mode, //编辑器语言
		lineWrapping: true,
		foldGutter: true,
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		matchBrackets: true,
		smartIndent: true,
		indentUnit: 4,
		theme: "material", //编辑器主题
		keymap: "sublime",
		extraKeys: {
			Tab: "emmetExpandAbbreviation",
			Esc: "emmetResetAbbreviation",
			Enter: "emmetInsertLineBreak",
			Ctrl: "autocomplete",
		},
		lineNumbers: true,
	});
	editor.setOption("value", initValue);

	editor.on("changes", debounce(fn, 800));

	return editor;
}

export function createNode(htmlStr) {
	var div = document.createElement("div");
	div.innerHTML = htmlStr;
	return div.childNodes[0];
}
