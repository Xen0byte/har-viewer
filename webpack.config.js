/* eslint-disable import/no-extraneous-dependencies,global-require */

const path = require("path");
const { DefinePlugin } = require("webpack");

const HtmlPlugin = require("html-webpack-plugin");
const ScriptExtHtmlPlugin = require("script-ext-html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

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
    publicPath: "/",
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
      DEBUG: isDev,
      VERSION: JSON.stringify(pkg.version),
    }),
    new HtmlPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      minify: !isDev,
    }),
    new ScriptExtHtmlPlugin({
      defaultAttribute: "defer",
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
      // TODO: https://github.com/vuejs/vue-loader/issues/1729
      /* type: "asset/resource",
      generator: {
        filename: "img/[name][ext]",
      }, */
      use: {
        loader: "file-loader",
        options: {
          name: isDev
            ? "[name].[ext]"
            : "[contenthash].[ext]",
          noquotes: true,
          publicPath: "/img",
          outputPath: "img",
        },
      },
    }, {
      test: /\.(woff2?|eot|ttf)$/,
      // TODO: https://github.com/vuejs/vue-loader/issues/1729
      /* type: "asset/resource",
      generator: {
        filename: "fonts/[name][ext]",
      }, */
      use: {
        loader: "file-loader",
        options: {
          name: isDev
            ? "[name].[ext]"
            : "[contenthash].[ext]",
          noquotes: true,
          publicPath: "/fonts",
          outputPath: "fonts",
        },
      },
    }, {
      test: /\.vue$/,
      use: "vue-loader",
    }],
  },
};

if (isDev) {
  config.devServer = {
    inline: true,
    hot: true,
    host: "0.0.0.0",
    historyApiFallback: true,
    transportMode: "ws",
  };
} else {
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const TerserPlugin = require("terser-webpack-plugin");

  config.plugins.push(new CleanWebpackPlugin());
  config.plugins.push(new MiniCssExtractPlugin({
    filename: "css/[contenthash].min.css",
    chunkFilename: "css/[contenthash].min.css",
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
          comments: false,
          indent_level: 2,
        },
      },
    }),
  ];
}

module.exports = config;
