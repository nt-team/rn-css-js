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
                parseResult = _utils2.default.outputReactFriendlyStyle(_styleSheet, outPut, prettyPrint, literalObject, useEs6, tsAble);
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
    }]);

    return ReactNativeCss;
}();

exports.default = ReactNativeCss;