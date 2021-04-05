import React, { useEffect, useCallback, useRef, useState } from "react";
import { saveAs } from "file-saver";
import Tooltip from "react-tooltip-lite";
import init from "./init";

import "./bulma.min.css";
import "./index.less";

import logo from "./editor.png";

import { initCodeEditor, createNode } from "./lib";

import { IconJavascript, IconHtml, IconCss, IconSave, IconFormat, IconRun } from "./icon";

export default () => {
	let [mode, setMode] = useState("js");
	let [isAuto, setAuto] = useState(false);

	let staticRef = useRef({
		isAuto: false,
		js: null,
		css: null,
		html: null,
		lib: ["https://unpkg.com/babel-standalone/babel.min.js", "https://unpkg.com/react/umd/react.development.js", "https://unpkg.com/react-dom/umd/react-dom.development.js"],
	});

	const onDownload = useCallback(() => {
		let lib = ``;
		staticRef.current.lib.map((item) => {
			lib += `<script src="${item}"></script>`;
		});
		let reset = ``;
		var html = `
				<!DOCTYPE html>
		<html lang="en">
			<head><style>${reset}</style><style>${staticRef.current.css.getValue()}</style></head>
			<body>${staticRef.current.html.getValue()}${lib}<script type="text/babel" data-presets="react">${staticRef.current.js.getValue()}</script></body>
		</html>`;

		var blob = new Blob([html], { type: "text/html; charset=utf-8" });
		saveAs(blob, `PenEditor-${new Date().getTime()}.html`);
	}, []);

	const onFormat = useCallback((type) => {
		let editor = staticRef.current[type];
		editor.execCommand("selectAll");
		editor.autoFormatRange(editor.getCursor(true), editor.getCursor(false));
		editor.execCommand("goDocEnd");
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
		let lib = `<script src="static/console.js"></script>`;
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

	const onAutoRun = useCallback(() => {
		console.log(staticRef.current.isAuto);
		if (staticRef.current.isAuto) {
			onRun();
		}
	}, [isAuto]);

	useEffect(() => {
		window.addEventListener("message", function (data) {
			if (data.data && ["log", "error", "info",'warn'].includes(data.data.type)) {
				let console = document.getElementById("console");
				console.appendChild(createNode(data.data.data));
				console.scrollTop = console.scrollHeight;
			}
		});

		staticRef.current.js = initCodeEditor(document.getElementById("js"), "javascript", init.javascript, onAutoRun);
		staticRef.current.html = initCodeEditor(document.getElementById("html"), "htmlmixed", init.html, onAutoRun);
		staticRef.current.css = initCodeEditor(document.getElementById("css"), "css", init.css, onAutoRun);

		onFormat("js");
		onFormat("css");
		onFormat("html");

		onRun();
	}, []);

	return (
		<div className="runjs">
			<div className="runjs__header">
				<div class="nav center" style={{ paddingLeft: 20, width: 240 }}>
					<img style={{ height: 36 }} src={logo} alt="" />
					<div style={{ width: 40 }}></div>
					<Tooltip content="JS Editor">
						<div class={mode == "js" ? "tool-icon selected" : "tool-icon"} onClick={() => setMode("js")}>
							<IconJavascript></IconJavascript>
						</div>
					</Tooltip>
					<Tooltip content="Html Editor">
						<div class={mode == "html" ? "tool-icon selected" : "tool-icon"} onClick={() => setMode("html")}>
							<IconHtml></IconHtml>
						</div>
					</Tooltip>
					<Tooltip content="Css Editor">
						<div class={mode == "css" ? "tool-icon selected" : "tool-icon"} name="css" onClick={() => setMode("css")}>
							<IconCss></IconCss>
						</div>
					</Tooltip>
				</div>
				<div class="tool center" style={{ flex: 1 }}>
					<input
						onKeyDown={(e) => {
							if (e.keyCode == 13) {
								staticRef.current.lib.push(e.target.value);
								e.target.value = "";
							}
						}}
						placeholder="cdn js"
						type="text"
						style={{ width: 400 }}
					/>
					<label class="checkbox">
						<input
							checked={isAuto}
							onChange={(e) => {
								staticRef.current.isAuto = e.currentTarget.checked;
								setAuto(e.currentTarget.checked);
							}}
							type="checkbox"
							style={{ marginRight: 5 }}
						/>
						Auto Run
					</label>
				</div>
				<div class="menu" style={{ flex: 1 }}>
					<Tooltip content="Save as html file">
						<div class="tool-icon" onClick={onDownload}>
							<IconSave></IconSave>
						</div>
					</Tooltip>
					<Tooltip content="Format code">
						<div
							class="tool-icon"
							onClick={() => {
								onFormat("js");
								onFormat("html");
								onFormat("css");
							}}>
							<IconFormat></IconFormat>
						</div>
					</Tooltip>
					<Tooltip content="Run code">
						<div class="tool-icon" onClick={onRun}>
							<IconRun></IconRun>
						</div>
					</Tooltip>
				</div>
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
