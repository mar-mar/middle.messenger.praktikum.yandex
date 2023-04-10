const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app-chat.bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Чат",
            favicon: "./static/images/favicon.ico",
            template: "./src/index.html"
        })
    ],
    resolve: {
        extensions: [".ts", ".js", ".json", ".hbs", ".pcss"],
        fallback: { crypto: false }
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "tsconfig.json")
                        }
                    }
                ],
                exclude: /(node_modules)/
            },
            {
                test: /\.hbs$/i,
                use: [{
                    loader: "handlebars-loader",
                    options: {
                        configFile: path.resolve(__dirname, "handlebars.config.js")
                    }
                }]
            },
            {
                test: /\.pcss$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1
                        }
                    },
                    "postcss-loader"
                ]
            },
            // изображения
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|)$/i,
                type: "asset/resource"
            },
            // шрифты и SVG
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: "asset/inline"
            }
        ]
    },

    devServer: {
        static: path.join(__dirname, "dist"),
        historyApiFallback: true,
        compress: true,
        hot: true,
        port: 4000
    }
};
