/* eslint-disable import/no-extraneous-dependencies,global-require */

const path = require("path");
const { DefinePlugin } = require("webpack");

const HtmlPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const FaviconsPlugin = require("favicons-webpack-plugin");

const pkg = require("./package.json");

const isDev = process.env.NODE_ENV !== "production";

const config = {
  devtool: isDev
    ? "eval-source-map"
    : false,
  mode: isDev
    ? "development"
    : "production",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: isDev
      ? "js/[name].js"
      : "js/[contenthash].min.js",
    chunkFilename: isDev
      ? "js/[name].js"
      : "js/[contenthash].min.js",
    publicPath: process.env.DEPLOY
      ? "/har-viewer/"
      : "/",
    pathinfo: false,
  },
  performance: { hints: false },
  resolve: {
    extensions: [".js", ".vue"],
    symlinks: false,
  },
  optimization: {
    concatenateModules: true,
    runtimeChunk: "single",
    chunkIds: isDev
      ? "named"
      : "deterministic",
    moduleIds: isDev
      ? "named"
      : "deterministic",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: module => {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
  plugins: [
    new DefinePlugin({
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      APP: JSON.stringify(pkg.description),
      AUTHOR_NAME: JSON.stringify(pkg.author.name),
      AUTHOR_URL: JSON.stringify(pkg.author.url),
      DEBUG: isDev,
      HOMEPAGE: JSON.stringify(pkg.homepage),
      LICENSE: JSON.stringify(pkg.license),
      SW_URL: JSON.stringify(process.env.DEPLOY
        ? "/har-viewer/service-worker.js"
        : "/service-worker.js"),
      VERSION: JSON.stringify(pkg.version),
    }),
    new HtmlPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      hash: !isDev,
      minify: !isDev,
      scriptLoading: "defer",
    }),
    new FaviconsPlugin({
      logo: path.resolve("./src/assets/icon.svg"),
      favicons: {
        appShortName: "HAR Viewer",
        appName: "HTTP Archive Viewer",
        developerName: "Erik Bender",
        developerURL: "https://develerik.dev",
        background: "#e4e9f2",
        theme_color: "#3f51b5",
        version: pkg.version,
        icons: {
          coast: false,
          yandex: false,
        },
      },
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [{
      test: /\.s?[ac]ss$/,
      use: [
        isDev
          ? "style-loader"
          : require("mini-css-extract-plugin").loader,
        {
          loader: "css-loader",
          options: {
            importLoaders: 2,
            sourceMap: isDev,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: isDev,
            postcssOptions: {
              plugins: [
                require("postcss-import"),
                require("postcss-preset-env"),
                ...(isDev ? [] : [require("cssnano")]),
              ],
            },
          },
        },
        {
          loader: "sass-loader",
          options: {
            implementation: require("sass"),
            sassOptions: {
              fiber: require("fibers"),
            },
            sourceMap: isDev,
          },
        },
      ],
    }, {
      test: /\.svg$/,
      type: "asset/resource",
      generator: {
        filename: isDev
          ? "img/[name][ext]"
          : "img/[contenthash][ext]",
      },
    }, {
      test: /\.woff2?$/,
      type: "asset/resource",
      generator: {
        filename: isDev
          ? "fonts/[name][ext]"
          : "fonts/[contenthash][ext]",
      },
    }, {
      test: /\.vue$/,
      use: "vue-loader",
    }],
  },
};

if (isDev) {
  config.devServer = {
    hot: true,
    host: "0.0.0.0",
    historyApiFallback: true,
    transportMode: "ws",
  };
} else {
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const TerserPlugin = require("terser-webpack-plugin");
  const WorkboxPlugin = require("workbox-webpack-plugin");

  config.plugins.push(new CleanWebpackPlugin());
  config.plugins.push(new MiniCssExtractPlugin({
    filename: "css/[contenthash].min.css",
    chunkFilename: "css/[contenthash].min.css",
  }));
  config.plugins.push(new WorkboxPlugin.GenerateSW({
    clientsClaim: true,
    skipWaiting: true,
  }));

  config.optimization.minimizer = [
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        ecma: 2021,
        compress: {
          drop_console: true,
          global_defs: {
            DEBUG: false,
          },
        },
        output: {
          beautify: false,
          comments: false,
          indent_level: 2,
        },
      },
    }),
  ];

  if (process.env.ANALYZE) {
    const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

    config.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: path.resolve(__dirname, "report.html"),
      defaultSizes: "parsed",
      openAnalyzer: false,
    }));
  }
}

module.exports = config;
