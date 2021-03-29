const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");

let plugins = [];

function absolute(dir) {
	return path.resolve(__dirname, dir);
}
function assetsPath(_path) {
	return path.posix.join("assets", _path);
}

if (process.env.NODE_ENV == "production") {
	//需要做打包分析时、用个插件
	plugins = [new BundleAnalyzerPlugin(), new CleanWebpackPlugin()];
	//plugins = [new CleanWebpackPlugin()];
} else if (process.env.NODE_ENV == "development") {
	// const vendorManifest = require("./dist/json/vendor-manifest.json");
	// plugins = [new webpack.DllReferencePlugin({ manifest: vendorManifest })];
}

plugins = plugins.concat([
	new MiniCssExtractPlugin({
		filename: "styles/[name].[hash].css",
		chunkFilename: "styles/[id].[hash].css",
	}),
	new CopyWebpackPlugin([
		{
			from: "./favicon.ico",
			to: "favicon.ico",
		},
	]),
	new CopyWebpackPlugin([
		{
			from: "static",
			to: "static",
		},
	]),
	new HtmlWebpackPlugin({
		chunks:['app'],
		title: "PenEditor",
		favicon: path.resolve("favicon.ico"),
		template: "./src/template.html",
	}),
]);

module.exports = {
	entry: {
		app: "./src/index.js",
	},
	mode: process.env.NODE_ENV,
	
	output: {
		filename: "modules/[name].[hash].js",
		publicPath: "./",
		path: path.resolve(__dirname, "dist"),
	},
	devtool: process.env.NODE_ENV == "production" ? "" : "source-map",
	devServer: {
		host: "127.0.0.1",
		port: 8099,
		contentBase: "./dist",
	},
	resolve: {
		extensions: [".js", ".json", ".jsx", ".less", ".css"],
	},
	optimization: {
		minimizer: process.env.NODE_ENV == "production" ? [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})] : [],
		splitChunks: {
			chunks: "all",
			minChunks: 2,
		},
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "../",
						},
					},
					{ loader: "css-loader" },
					{
						loader: "less-loader",
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "../",
						},
					},
					{ loader: "css-loader" },
				],
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader?cacheDirectory=true",
					},
				],
			},
			{
				test: /\.(webp|png|jpe?g|gif|svg|ttf|woff|eot)(\?.*)?$/,
				loader: "file-loader",
				options: {
					name: assetsPath("images/[name].[hash:7].[ext]"),
				},
			},
		],
	},
	plugins: plugins,
};
