// webpack config object

// copy-webpack allows for static files to be easily added to /dist during build
const CopywebpackPlugin = require("copy-webpack-plugin");

// path to the CesiumJS source code
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";

// path module is built-in to node
const path = require("path");

// webpack imported as a devdependency
const webpack = require("webpack");

// used for injecting webpack bundle into html page
const HtmlWebpackPlugin = require("html-webpack-plugin");

// in module.rules, the "test" specifies filetypes and "use" specifies loaders to use
// (see package.json for loaders)
module.exports = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    // Needed to compile multiline strings in Cesium
    // (by default, webpack injects tabs)
    sourcePrefix: "",
  },
  // "amd" is asynch module definition
  // the standard "toUrl" method will not work with Cesium
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
    ],
  },
  // adding a webpack alias for Cesium
  resolve: {
    alias: {
      // CesiumJS module name
      cesium: path.resolve(__dirname, cesiumSource),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopywebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" },
        { from: path.join(cesiumSource, "Assets"), to: "Assets" },
        { from: path.join(cesiumSource, "Widgets"), to: "Widgets" },
      ],
    }),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify(""),
    }),
  ],
  // development server options
  devServer: {
    contentBase: path.join(__dirname, "dist"),
  },
};
