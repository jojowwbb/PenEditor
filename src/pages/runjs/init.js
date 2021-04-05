export default {
	css: `body{
        background:#36404a;
        width:100%;
        height:100%;
    }
    .blend{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
    }
    h3{
        color:#fff;
    }
    p{
        color:rgba(255,255,255,0.75);
    }`,
	html: `<div id="root"></div>`,
	javascript: `function App() {
        console.log('Pen Editor');
        console.info('a simple code editor');
        console.warn('a simple code editor');
        console.error('a simple code editor');
        return (
            <div className="blend">
                <h3>Pen Editor</h3>
                <p>a simple code editor</p>
            </div>
        );
    }
    ReactDOM.render(<App />, document.getElementById("root"));
`,
};
