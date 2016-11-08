'use strict';
var toCamelCase = require('to-camel-case');

const allowedStyles = ['solid', 'dotted', 'dashed'];
const widthKeywords = ['none', 'thin', 'medium', 'thick'];
const widthKeywordValues = { none: 0, thin: 1, medium: 3, thick: 5 };

const styleProps = [
  'borderStyle',
  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle'
];
const widthProps = [
  // 'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth'
];

const colorHexMatch = /^#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})?/;
const colorFuncMatch = /^(?:rgb|hsl)a?/;
function isColorFunc(val) {
  return val.search(colorFuncMatch) > -1;
}

function fixWidthKeywords(val) {
  if (widthKeywords.indexOf(val) > -1) {
    return widthKeywordValues[val] + 'px';
  }
  return val;
}

module.exports = function (keys) {
  var values = keys[0].value.split(' ');

  // uppercase the keys to make this code easier to write
  var property = toCamelCase(keys[0].key);
  var length = values.length;

  // handle borderWidth, borderStyle and borderColor
    // which can accept up to 4 values
    // if only 1 value, then leave alone
  if (length === 1 && (property === 'borderWidth' || property === 'borderStyle' || property === 'borderColor')) {
    return keys;
  }

  keys = [];

  // join rgb/hsl colors which got split on accident
  // TODO: might values[0] or values[1] be a color func?
  if (values[2] && isColorFunc(values[2])) {
    values[2] = values.slice(2).join(' ');
  }

  if (styleProps.indexOf(property) > -1) {
    // React Native only supports one style for all sides
    // honors the first declared style for borderStyle: 1 2 3 4
    // TODO: this ends up honoring the last declared style
      // if borderTopStyle declaration comes after borderStyle
      // how to know if borderStyle was already set?
    keys.push({
      key: 'borderStyle',
      value: values[0]
    });
  } else if (widthProps.indexOf(property) > -1) {
    keys.push({
      key: property,
      value: fixWidthKeywords(values[0])
    });
  } else if (property === 'borderWidth' || property === 'borderColor') {
    const type = property.substr('border'.length);

    if (type === 'Width') {
      values.forEach((val, index) => {
        values[index] = fixWidthKeywords(val);
      });
    }

    if (length === 2) {
      ['Top', 'Bottom'].forEach(function (side) {
        keys.push({
          key: `border${side}${type}`,
          value: values[0]
        });
      });
      ['Right', 'Left'].forEach(function (side) {
        keys.push({
          key: `border${side}${type}`,
          value: values[1]
        });
      });
    }

    if (length === 3) {
      keys.push({
        key: `borderTop${type}`,
        value: values[0]
      });
      ['Left', 'Right'].forEach(function (side) {
        keys.push({
          key: `border${side}${type}`,
          value: values[1]
        });
      });
      keys.push({
        key: `borderBottom${type}`,
        value: values[2]
      });
    }

    if (length === 4) {
      ['Top', 'Right', 'Bottom', 'Left'].forEach(function (side, index) {
        keys.push({
          key: `border${side}${type}`,
          value: values[index]
        });
      });
    }
  } else {
    // @see https://developer.mozilla.org/en-US/docs/Web/CSS/border
    // border: 1px;
    // border: 2px dotted;
    // border: medium dashed green;
    // TODO: border: dashed green;
    const width = fixWidthKeywords(values[0]);
    const style = values[1];
    const color = values[2];

    keys.push({
      key: `${property}Width`,
      value: width
    });

    if (style) {
      keys.push({
        key: 'borderStyle',
        value: style
      });
    }

    if (color) {
      keys.push({
        key: `${property}Color`,
        value: color
      });
    }
  }

  return keys;
};
