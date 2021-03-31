import React, { useEffect, useCallback, useRef, useState } from "react";
import { saveAs } from "file-saver";
import GitHubButton from "react-github-btn";
import init from "./init";

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

import "./bulma.min.css";
import "./index.less";

import logo from "./editor.png";

emmet(CodeMirror);

function createNode(htmlStr) {
	var div = document.createElement("div");
	div.innerHTML = htmlStr;
	return div.childNodes[0];
}

let codeMirrorCommonOption = {
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
};

export default (params) => {
	let [mode, setMode] = useState("js");

	let staticRef = useRef({
		js: null,
		css: null,
		html: null,
		lib: ["static/console.js", "static/babel.min.js", "https://unpkg.com/react/umd/react.development.js", "https://unpkg.com/react-dom/umd/react-dom.development.js"],
	});

	
	useEffect(() => {

		window.addEventListener("message", function (data) {
			if (data.data && ["log", "error", "info"].includes(data.data.type)) {
				let console = document.getElementById("console");
				console.appendChild(createNode(data.data.data));
				console.scrollTop = console.scrollHeight;
			}
		});

		staticRef.current.js = CodeMirror.fromTextArea(document.getElementById("js"), {
			mode: "javascript", //编辑器语言
			...codeMirrorCommonOption,
		});
		staticRef.current.js.setOption("value", init.javascript);

		staticRef.current.html = CodeMirror.fromTextArea(document.getElementById("html"), {
			mode: "htmlmixed",
			...codeMirrorCommonOption,
		});
		staticRef.current.html.setOption("value", init.html);

		staticRef.current.css = CodeMirror.fromTextArea(document.getElementById("css"), {
			mode: "css", //编辑器语言
			...codeMirrorCommonOption,
		});
		staticRef.current.css.setOption("value", init.css);
		onRun();
	}, []);

	const change = useCallback((e) => {
		let name = e.target.name;
		setMode(name);
	}, []);

	const onDownload = useCallback(() => {
		let lib = "";
		staticRef.current.lib.map((item) => {
			lib += `<script src="${item}"></script>`;
		});
		let reset = `html {
			width: 100%;
			height: 100%;
		}
		body {
			width: 100%;
			height: 100%;
			margin: 0;
		}`;
		var html = `
				<!DOCTYPE html>
		<html lang="en">
			<head><style>${reset}</style><style>${staticRef.current.css.getValue()}</style></head>
			<body>${staticRef.current.html.getValue()}${lib}<script>${staticRef.current.js.getValue()}</script></body>
		</html>`;

		var blob = new Blob([html], { type: "text/html; charset=utf-8" });
		saveAs(blob, `PenEditor-${new Date().getTime()}.html`);
	}, []);

	const onFormat = useCallback((type) => {
		let editor = staticRef.current[type];
		editor.execCommand("selectAll");
		editor.autoFormatRange(editor.getCursor(true), editor.getCursor(false));
	}, []);

	const onLoad = useCallback(() => {
		let iframe = document.getElementById("preview"),
			html = staticRef.current.html.getValue(),
			css = staticRef.current.css.getValue(),
			js = staticRef.current.js.getValue();

		var preview;
		if (iframe.contentDocument) {
			preview = iframe.contentDocument;
		} else if (iframe.contentWindow) {
			preview = iframe.contentWindow.document;
		} else {
			preview = iframe.document;
		}
		let lib = "";
		staticRef.current.lib.map((item) => {
			lib += `<script src="${item}"></script>`;
		});
		preview.open();
		preview.write(`${lib}${html}<script  type="text/babel" data-presets="react">${js}</script>`);
		preview.close();
		preview.head.innerHTML = `
			<link rel="stylesheet" href="./static/view.css">
			<style>${css}</style>
		`;
	}, []);

	const onRun = useCallback(() => {
		let iframe = document.getElementById("preview");
		iframe.contentWindow.location.reload(true);
	}, []);

	return (
		<div className="runjs">
			<div className="runjs__header">
				<nav className="navbar" role="navigation" aria-label="main navigation">
					<div class="navbar-brand" style={{ alignItems: "center" }}>
						<a style={{ height: 36 }} target="_blank" href="https://github.com/jojowwbb/PenEditor">
							<img style={{ height: 36 }} src={logo} alt="" />
						</a>
					</div>
					<div id="navbarBasicExample" class="navbar-menu">
						<div class="navbar-start">
							<a class={mode == "html" ? "navbar-item selected" : "navbar-item"} name="html" onClick={change}>
								Html
							</a>
							<a class={mode == "css" ? "navbar-item selected" : "navbar-item"} name="css" onClick={change}>
								Css
							</a>
							<a class={mode == "js" ? "navbar-item selected" : "navbar-item"} name="js" onClick={change}>
								JavaScript
							</a>
						</div>
						<div class="navbar-end">
							<div class="navbar-item">
								<input
									onKeyDown={(e) => {
										if (e.keyCode == 13) {
											staticRef.current.lib.push(e.target.value);
											e.target.value = "";
										}
									}}
									style={{ width: 480 }}
									class="input"
									type="text"
									placeholder="cdn js"
								/>
							</div>
							<div class="navbar-item">
								<div class="buttons">
									<a
										class="button is-primary"
										onClick={() => {
											onFormat("js");
											onFormat("html");
											onFormat("css");
										}}>
										Format
									</a>
									<a class="button is-primary" onClick={onDownload}>
										Download
									</a>
									<a class="button is-success" onClick={onRun}>
										Run
									</a>
									<div style={{ width: 100, textAlign: "right" }}>
										<GitHubButton href="https://github.com/jojowwbb/PenEditor" data-show-count="true" aria-label="Star jojowwbb/PenEditor on GitHub">
											Star
										</GitHubButton>
									</div>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</div>
			<div className="runjs__editor">
				<div id="html-wrap" style={{ visibility: mode == "html" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="html"></textarea>
				</div>
				<div id="css-wrap" style={{ visibility: mode == "css" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="css"></textarea>
				</div>
				<div id="js-wrap" style={{ visibility: mode == "js" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="js"></textarea>
				</div>
			</div>
			<div className="runjs__preview">
				<iframe onLoad={onLoad} id="preview" src="./static/view.html" seamless width="100%" height="100%"></iframe>
			</div>
			<div className="runjs__console" id="console"></div>
		</div>
	);
};
