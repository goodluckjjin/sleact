import path from "path";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== "production";

const config: webpack.Configuration = {
  name: "sleact",
  mode: isDevelopment ? "development" : "production",
  devtool: !isDevelopment ? "hidden-source-map" : "eval",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@hooks": path.resolve(__dirname, "hooks"),
      "@components": path.resolve(__dirname, "components"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@utils": path.resolve(__dirname, "utils"),
      "@typings": path.resolve(__dirname, "typings"),
    },
  },
  entry: {
    app: "./client",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { browsers: ["last 2 chrome versions"] },
                debug: isDevelopment,
              },
            ],
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
          // 아래 env는 hotload 추가시 필요
          env: {
            development: {
              plugins: [
                "@emotion",
                {
                  sourceMap: true,
                },
                require.resolve("react-refresh/babel"),
              ],
            },
            production: {
              plugins: ["@emtion"],
            },
          },
        },
        exclude: path.join(__dirname, "node_modules"),
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      //ts와 webpack을 동시에 돌아가게 함
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? "development" : "production" }),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist/",
  },
  devServer: {
    // WebpackDevServer.Configuration
    historyApiFallback: true, // react-router
    port: 3090,
    devMiddleware: { publicPath: "/dist/" },
    static: { directory: path.resolve(__dirname) },
    // proxy: {
    //   '/api/': {
    //     target: 'http://localhost:3095',
    //     changeOrigin: true,
    //     ws: true,
    //   },
    // },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
if (!isDevelopment && config.plugins) {
  // config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
