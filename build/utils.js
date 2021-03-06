'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'arrayContains',
        value: function arrayContains(value, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (value === arr[i]) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'clean',
        value: function clean(string) {
            return string.replace(/\r?\n|\r/g, "");
        }
    }, {
        key: 'readFile',
        value: function readFile(file, cb) {
            _fs2.default.readFile(file, "utf8", cb);
        }
    }, {
        key: 'readFileSync',
        value: function readFileSync(file) {
            return _fs2.default.readFileSync(file, "utf8");
        }
    }, {
        key: 'pasteTs',
        value: function pasteTs(style, indentation, tsAble) {
            var blankStr = '    ';
            // let tsType = [{
            //         match: '__view',
            //         suffix:'as React.ViewStyle'
            //     },
            //     {
            //         match: '__text',
            //         suffix:'as React.TextStyle'
            //     }
            // ];

            var pasteResult = [];

            pasteResult.push('{');

            indentation && pasteResult.push('\n');

            Object.keys(style).forEach(function (item) {
                var key = item,
                    tsSuffix = '',
                    sData = style[item];

                // tsType.forEach((ts)=>{
                //     let idx = item.indexOf(ts.match);
                //
                //     if( idx !== -1 ){
                //         key = item.slice(0, idx);
                //         tsSuffix  = ts.suffix
                //     }
                // })

                tsAble && (tsSuffix = ' as any');

                pasteResult.push(blankStr + key + ':');

                var secoundObj = {};
                Object.keys(sData).forEach(function (skey) {
                    if (_typeof(sData[skey]) === 'object') {
                        secoundObj[skey] = sData[skey];
                        delete sData[skey];
                    }
                });

                var jsonStr = JSON.stringify(style[item], null, indentation + blankStr.length);
                pasteResult.push(jsonStr.slice(0, -1));

                if (Object.keys(secoundObj).length > 0) {

                    pasteResult[pasteResult.length - 1] = pasteResult[pasteResult.length - 1].replace(/\n$/, ',');

                    var secoundJsonStr = JSON.stringify(secoundObj, null, indentation + blankStr.length);
                    pasteResult.push(secoundJsonStr.slice(1, -1).replace(/\n$/, ''));
                    pasteResult.push(tsSuffix);
                    // tsSuffix && pasteResult.push(' as any')
                    pasteResult.push(',\n');
                }

                pasteResult.push(blankStr + '}');

                pasteResult.push(tsSuffix);
                pasteResult.push(',');
                indentation && pasteResult.push('\n');
            });
            pasteResult.push('}');
            return pasteResult.join('');
        }

        // create dir for loop

    }, {
        key: 'createMkdir',
        value: function createMkdir(dirpath, mode, callback) {
            _fs2.default.exists(dirpath, function (exists) {
                if (exists) {
                    callback(dirpath);
                } else {
                    //尝试创建父目录，然后再创建当前目录
                    Utils.createMkdir(_path2.default.dirname(dirpath), mode, function () {
                        _fs2.default.mkdir(dirpath, mode, callback);
                    });
                }
            });
        }
    }, {
        key: 'outputReactFriendlyStyle',
        value: function outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject, es6Able, tsAble) {
            var indentation = prettyPrint ? 4 : 0;
            var jsonOutput = Utils.pasteTs(style, indentation, tsAble);
            var output;

            if (es6Able) {

                output = 'import {StyleSheet} from \'react-native\'; \nexport default StyleSheet.create(' + jsonOutput + ');';

                if (literalObject) {
                    output = 'export default ' + jsonOutput;
                }
            } else {
                output = "module.exports = ";
                output += literalObject ? '' + jsonOutput : 'require(\'react-native\').StyleSheet.create(' + jsonOutput + ');';
            }

            // Write to file
            if (outputFile) {
                Utils.createMkdir(_path2.default.dirname(outputFile), '0777', function () {
                    _fs2.default.writeFileSync(outputFile, output);
                });
            }

            return output;
        }
    }, {
        key: 'contains',
        value: function contains(string, needle) {
            var search = string.match(needle);
            return search && search.length > 0;
        }
    }]);

    return Utils;
}();

exports.default = Utils;