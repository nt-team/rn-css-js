

var Rncs = require('./index.js').default;
var cssOpera = new Rncs();
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');

var glob = require("glob");


// var specialReactNative = {
//     'transform': function (value) {
//         // todo fix
//         return value;
//     },
//     // fix react-native
//     __$$: function (property, value) {
//         switch (property){
//             case 'shadow-radius':
//             case 'elevation':
//             case 'margin-horizontal':
//             case 'margin-vertical':
//             case 'padding-horizontal':
//             case 'padding-vertical':
//             case 'text-shadow-radius':
//                 return parseFloat(value.replace(/px|\s*/g, ''));
//                 break;
//
//         }
//         return void (0);
//     }
// }


export default class Project{
    constructor( options = {} ) {
        this.options = Object.assign({
            inputPut: '',        // 编译文件路径匹配格式
            outPut:(outPut) => {return outPut},           // 输出文件路径转换函数
            watch: true,         // 是否进行监控
            prettyPrint: true,   // 是否进行格式化打印
            suffix: 'js',        // 输出文件格式
            useEs6: true,        // 以es6输出
            tsAble:false,        // 是否支持typescript
            literalObject: true, // 不包括reactnative StyleSheet处理
            specialParse: []     // 特殊处理
        }, options);

        this.options.suffix = this.options.suffix[0] !== '.' ? '.' + this.options.suffix : this.options.suffix;


        ['parseCSS','watchAction'].forEach((item)=>{
            this[item] = this[item].bind(this)
        });
        let parseCSS = this.parseCSS;
        let watchAction = this.watchAction;


        this._callback = (function (err, fileList) {
            if (err) {
                console.log(err);
                return;
            }
            fileList.forEach((item)=> {
                parseCSS({input: item})
            });
            watchAction(this.options.inputPut)
        }).bind(this)

    }

    inputTranOut(inputPath) {

        let outPut =  path.join(
                path.dirname(inputPath),
                path.basename(inputPath, path.extname(inputPath))
            ) + this.options.suffix;

        typeof this.options.outPut === 'function' &&
            (outPut = this.options.outPut(outPut));
        return outPut;
    }

    /**
     * 监控文件 【增删改】 变化
     */
    watchAction (watchPath){

        if( !this.options.watch ) return;

        var watcher = chokidar.watch(watchPath, {
            ignored: /[\/\\]\./,
            persistent: true,
            ignoreInitial: true
        }).on('change',  (filePath) => {
            console.log(filePath, 'has been changed ');
            this.parseCSS({
                input: filePath
            });
        }).on('add',  (filePath) => {
            console.log(filePath, 'has been added ');
            this.parseCSS({
                input: filePath
            });
        }).on('unlink',  (filePath) => {
            console.log(filePath, 'has been unlink ');
            fs.unlink(this.inputTranOut(path.resolve(process.cwd(), filePath), this.options.suffix))
        });
        console.log(' ============= react-native-css-scss run watch =============');
        return watcher
    }

    parseCSS(options) {
        let input = options.input,
            output = options.output,
            callback = options.callback;

        var reInput = path.resolve(process.cwd(), input);
        if (!output) {
            output = this.inputTranOut(reInput, this.options.suffix);
        }
        try {

            var cssresult = cssOpera.parse({
                inputPut: reInput,
                outPut: output,
                prettyPrint: this.options.prettyPrint,
                literalObject: this.options.literalObject,
                cb () {
                    callback && callback.apply(null, arguments);
                    console.log(input, 'compile is ok √')
                },
                useEs6: this.options.useEs6,
                specialParse: this.options.specialParse,
                tsAble: this.options.tsAble
            })

        } catch (err) {
            console.log(err)
        }
    }


    run (){
        glob(this.options.inputPut, {cwd: process.cwd(), mark: true}, this._callback);
    }


}




