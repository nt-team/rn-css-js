'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Handle = require('./Handle');

var _Handle2 = _interopRequireDefault(_Handle);

var _utils = require('./utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var format = require('./properties/all'),
    margingAndPadding = require('./properties/marginAndPadding'),
    border = require('./properties/border'),
    boxShadow = require('./properties/boxShadow'),
    flex = require('./properties/flex'),
    transform = require('./properties/transform'),
    lineHeight = require('./properties/lineHeight'),
    final = require('./saveAll');

var ReactNativeCss = function () {
    function ReactNativeCss() {
        _classCallCheck(this, ReactNativeCss);
    }

    _createClass(ReactNativeCss, [{
        key: 'parse',
        value: function parse(options) {
            var inputPut = options.inputPut,
                outPut = options.outPut,
                _options$prettyPrint = options.prettyPrint,
                prettyPrint = _options$prettyPrint === undefined ? false : _options$prettyPrint,
                _options$literalObjec = options.literalObject,
                literalObject = _options$literalObjec === undefined ? false : _options$literalObjec,
                cb = options.cb,
                _options$useEs = options.useEs6,
                useEs6 = _options$useEs === undefined ? false : _options$useEs,
                specialParse = options.specialParse,
                tsAble = options.tsAble;


            var parseResult = void 0;
            if (_utils2.default.contains(inputPut, /scss/)) {
                var _require$renderSync = require('node-sass').renderSync({
                    file: inputPut,
                    outputStyle: 'compressed'
                }),
                    css = _require$renderSync.css;

                var cssStr = css.toString();
                var styleSheet = this.toJSS(cssStr, specialParse);
                parseResult = _utils2.default.outputReactFriendlyStyle(styleSheet, outPut, prettyPrint, literalObject, useEs6, tsAble);

                if (cb) {
                    cb(styleSheet, cssStr);
                }
            } else {
                var data = _utils2.default.readFileSync(inputPut);
                var _styleSheet = this.toJSS(data, specialParse);
                parseResult = _utils2.default.outputReactFriendlyStyle(_styleSheet, output, prettyPrint, literalObject, useEs6, tsAble);
                if (cb) {
                    cb(_styleSheet, data);
                }
            }

            return parseResult;
        }
    }, {
        key: 'toJSS',
        value: function toJSS(stylesheetString) {
            var specialParse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


            var handle = new _Handle2.default(_utils2.default.clean(stylesheetString), specialParse);

            handle.use(['margin', 'padding'], margingAndPadding);
            handle.use(['border', 'border-top', 'borderTop', 'border-bottom', 'borderBottom', 'border-left', 'borderLeft', 'border-right', 'borderRight', 'border-width', 'borderWidth', 'border-top-width', 'borderTopWidth', 'border-right-width', 'borderRightWidth', 'border-bottom-width', 'borderBottomWidth', 'border-left-width', 'borderLeftWidth', 'border-style', 'borderStyle', 'border-top-style', 'borderTopStyle', 'border-right-style', 'borderRightStyle', 'border-bottom-style', 'borderBottomStyle', 'border-left-style', 'borderLeftStyle', 'border-color', 'borderColor'], border);
            handle.use(['box-shadow', 'boxShadow'], boxShadow);
            handle.use(['flex'], flex);
            handle.use(['transform'], transform);
            handle.use(['line-height'], lineHeight);
            handle.use(format);

            handle.final(final);

            specialParse.forEach && specialParse.forEach(function (special) {
                if (special && special.func) {
                    if (special.properties && Array.isArray(special.properties)) {
                        handle.use(special.properties, special.func);
                    } else {
                        handle.use(special.properties, special.func);
                    }
                }
            });

            return handle.do();
        }
        //
        // toJSS(stylesheetString, specialReactNative) {
        //     const directions = ['top', 'right', 'bottom', 'left'];
        //     const changeArr = ['margin', 'padding', 'border-width', 'border-radius'];
        //     const numberize = ['width', 'height', 'font-size', 'line-height'].concat(directions);
        //     //special properties and shorthands that need to be broken down separately
        //     const specialProperties = {};
        //     ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'].forEach(name=> {
        //         specialProperties[name] = {
        //             regex: /^\s*([0-9]+)(px)?\s+(solid|dotted|dashed)?\s*([a-z0-9#,\(\)\.\s]+)\s*$/i,
        //             map: {
        //                 1: `${name}-width`,
        //                 3: name == 'border' ? `${name}-style` : null,
        //                 4: `${name}-color`
        //             }
        //         }
        //     });
        //
        //     directions.forEach((dir) => {
        //         numberize.push(`border-${dir}-width`);
        //         changeArr.forEach((prop) => {
        //             numberize.push(`${prop}-${dir}`);
        //         })
        //     });
        //
        //     //map of properties that when expanded use different directions than the default Top,Right,Bottom,Left.
        //     const directionMaps = {
        //         'border-radius': {
        //             'Top': 'top-left',
        //             'Right': 'top-right',
        //             'Bottom': 'bottom-right',
        //             'Left': 'bottom-left'
        //         }
        //     };
        //
        //     //Convert the shorthand property to the individual directions, handles edge cases, i.e. border-width and border-radius
        //     function directionToPropertyName(property, direction) {
        //         let names = property.split('-');
        //         names.splice(1, 0, directionMaps[property] ? directionMaps[property][direction] : direction);
        //         return toCamelCase(names.join('-'));
        //     }
        //
        //     // CSS properties that are not supported by React Native
        //     // The list of supported properties is at https://facebook.github.io/react-native/docs/style.html#supported-properties
        //     const unsupported = ['display'];
        //
        //     let {stylesheet} = ParseCSS(utils.clean(stylesheetString));
        //
        //     let JSONResult = {};
        //
        //     for (let rule of stylesheet.rules) {
        //         if (rule.type !== 'rule') continue;
        //
        //         for (let selector of rule.selectors) {
        //             selector = selector.replace(/\.|#/g, '');
        //             let styles = (JSONResult[selector] = JSONResult[selector] || {});
        //
        //             let declarationsToAdd = [];
        //
        //             for (let declaration of rule.declarations) {
        //
        //                 if (declaration.type !== 'declaration') continue;
        //
        //                 let value = declaration.value;
        //                 let property = declaration.property;
        //                 if (specialProperties[property]) {
        //                     let special = specialProperties[property],
        //                         matches = special.regex.exec(value)
        //                     if (matches) {
        //                         if (typeof special.map === 'function') {
        //                             special.map(matches, styles, rule.declarations)
        //                         } else {
        //                             for (let key in special.map) {
        //                                 if (matches[key] && special.map[key]) {
        //                                     rule.declarations.push({
        //                                         property: special.map[key],
        //                                         value: matches[key],
        //                                         type: 'declaration'
        //                                     })
        //                                 }
        //                             }
        //                         }
        //                         continue;
        //                     }
        //                 }
        //
        //                 // 传入特殊处理
        //                 if( specialReactNative && typeof specialReactNative[property] === 'function' ){
        //                     styles[toCamelCase(property)] = specialReactNative[property](value);
        //                     continue
        //                 }
        //
        //                 if(specialReactNative && typeof specialReactNative.__$$ === 'function' ){
        //                     let spectialVal = specialReactNative.__$$(property, value);
        //                     if(void(0) !== spectialVal) {
        //                         styles[toCamelCase(property)] = spectialVal;
        //                         continue
        //                     };
        //                 }
        //
        //                 if (utils.arrayContains(property, unsupported)) continue;
        //
        //                 if (utils.arrayContains(property, numberize)) {
        //                     var value = value.replace(/px|\s*/g, '');
        //                     styles[toCamelCase(property)] = parseFloat(value);
        //                 }
        //
        //                 else if (utils.arrayContains(property, changeArr)) {
        //                     var baseDeclaration = {
        //                         type: 'description'
        //                     };
        //
        //                     var values = value.replace(/px/g, '').split(/[\s,]+/);
        //
        //                     values.forEach(function (value, index, arr) {
        //                         arr[index] = parseInt(value);
        //                     });
        //
        //                     var length = values.length;
        //
        //                     if (length === 1) {
        //
        //                         styles[toCamelCase(property)] = values[0]
        //
        //                     }
        //
        //                     if (length === 2) {
        //
        //                         for (let prop of ['Top', 'Bottom']) {
        //                             styles[directionToPropertyName(property, prop)] = values[0];
        //                         }
        //
        //                         for (let prop of ['Left', 'Right']) {
        //                             styles[directionToPropertyName(property, prop)] = values[1];
        //                         }
        //                     }
        //
        //                     if (length === 3) {
        //
        //                         for (let prop of ['Left', 'Right']) {
        //                             styles[directionToPropertyName(property, prop)] = values[1];
        //                         }
        //
        //                         styles[directionToPropertyName(property, 'Top')] = values[0];
        //                         styles[directionToPropertyName(property, 'Bottom')] = values[2];
        //                     }
        //
        //                     if (length === 4) {
        //                         ['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
        //                             styles[directionToPropertyName(property, prop)] = values[index];
        //                         });
        //                     }
        //                 }
        //                 else {
        //                     if (!isNaN(declaration.value) && property !== 'font-weight') {
        //                         declaration.value = parseFloat(declaration.value);
        //                     }
        //
        //                     styles[toCamelCase(property)] = declaration.value;
        //                 }
        //             }
        //         }
        //     }
        //     return JSONResult
        // }

    }]);

    return ReactNativeCss;
}();

exports.default = ReactNativeCss;