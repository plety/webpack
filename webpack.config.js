//引入两个模块在后面用，path用来解析路径
const path = require('path');
const webpack = require('webpack');
//Plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //入口文件，这个很重要
    entry: {
        common:path.resolve(__dirname, './js/common.js'),
        home: path.resolve(__dirname, './js/home.js'),
        list: path.resolve(__dirname, './js/list.js')
    },
    //输出文件，当入口文件有多个，并且分别打包，filename使用[name].js,这样就可以根据入口文件名字给输出文件命名
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js'
    },
    //这里主要是各种loader的配置，webpack只能解析js，所以对于其他中类的文件就需要各种loader来解析，但是也很方便。
    //test中是正则表达式，用来匹配不同的文件，loader就是解析相关文件所需要的解析器，option是一些其他选项
    module: {
        rules: [
            // {
            //     test: /\.vue$/,
            //     loader: 'vue-loader',
            //     options: {}
            // },
            //对于css最好style-loader和css-loader都写上，还要注意书写顺序，关系到解析顺序，尤其是使用sass和less，webpack是从右到左加载loader的。
            // {
            //     test: /\.css$/,
            //     loader: 'style-loader!css-loader',
            // },
            {
// use:指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader
// fallback:编译后用什么loader来提取css文件

                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true //css压缩
                        }
                    }]
                }),
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "url-loader?limit=1024&name=./[name].[ext]?[hash]"
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    //这里打包后可以把所有的字体库都放在fonts文件夹中
                    name: 'fonts/[hash].[ext]'
                }
            }]
    },
    //
    plugins: [
        /**
         * (webpack.)开头的是webpack自带插件,不需要npm install，其他的需要
         * */

        //1,公用模块插件 CommonsChunkPlugin
        // 提取公用模块以cdn方式插入页面
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),

        //2,提取文本插件 ExtractTextPlugin
        //该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
        new ExtractTextPlugin('./css/style.css'),

        //3,全局变量插件 ProvidePlugin
        //这个可以使jquery变成全局变量，不用在自己文件require('jquery')了
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),

        //4,js压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        //5,创建html插件，可以用来创建vue的多页面
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: 'template/html/home.html',
            title:'home',
            excludeChunks:['list']
        }),
        new HtmlWebpackPlugin({
            // favicon: 'path/to/yourfile.ico',
            filename: 'list.html',
            template: 'template/html/list.html',
            title:'list',
            //文件压缩 (HtmlWebpackPlugin自带)
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeAttributeQuotes: true, // 移除属性的引号
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            hash: true,
            cache: true, //内容变化才会生成新文件
            // jade: 'path/to/yourfile.jade', //可以使用其他模版 need jade-loader
            // chunksSortMode: none | auto| function，默认auto； 允许指定的thunk在插入到html文档前进行排序。处理依赖
            //chunks 不写chunks默认为引用所有js文件
            chunks: ['vendor','list']
        }),
    ],

    // resolve: {
    //     alias: {
    //         //这里是关于vue，官方下载的模板是vue/dist/vue.common.js,但是使用vue-router用到了template，所以记得更改
    //         'vue$': 'vue/dist/vue.js'
    //     }
    // },
    //这里是关于热加载的配置
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    //这里是表示打包时使用source-map，打包之后调试会直接跳到source-map中，再也不用看压缩代码。
    devtool: '#eval-source-map'
};
