export default {
	css: `.blend {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
} 
.blend img {
    position: absolute;
    height: 100%;
    width: 100%;
}
.blend h1 { 
    font-size: 120px;
    mix-blend-mode: overlay;
}`,
	html: `<div class="blend">
    <img src="https://cdn.pixabay.com/photo/2016/12/11/12/02/bled-1899264_960_720.jpg" />
    <h1>Pen Editor</h1>
</div>`,
	javascript: `function main(){
    console.log('hello world');
}
main();`,
};
