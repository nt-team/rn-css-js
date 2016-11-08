module.exports = function(keys) {
    var fullValue = keys[0].value;
    fullValue = fullValue.replace(/rgb(.+)/, function(a, b) {
        return "rgb" + b.replace(/\s/g, "");
    });
    fullValue = fullValue.replace(/hsb(.+)/, function(a, b) {
        return "hsb" + b.replace(/\s/g, "");
    });
    fullValue = fullValue.replace(/rgba(.+)/, function(a, b) {
        return "rgba" + b.replace(/\s/g, "");
    });

    var values = fullValue.split(' '),
        property = keys[0].key;

    var length = values.length;
    keys = [];

    if (length === 1 && values[0] == "none") {
        keys.push({
            key: "shadowColor",
            value: "transparent"
        }, {
            key: "shadowOffset",
            value: {
                width: 0,
                height: 0
            }
        }, {
            key: "shadowOpacity",
            value: 0
        }, {
            key: "shadowRadius",
            value: 0
        });
    }

    else if (length === 4 && values[0] != "inset") {
        var color, opacity;
        if (values[3].indexOf("rgba") !== 0) {
            color = values[3];
            opacity = 1;
        } else {
            colorRaw = values[3].replace(/\s/g, "").replace("rgba(", "").replace(")", "").split(",");
            color = "rgb("+colorRaw[0]+","+colorRaw[1]+","+colorRaw[2]+")";
            opacity = colorRaw[3];
        }

        keys.push({
            key: "shadowColor",
            value: color
        }, {
            key: "shadowOffset",
            value: {
                width: values[0],
                height: values[1]
            }
        }, {
            key: "shadowOpacity",
            value: opacity
        }, {
            key: "shadowRadius",
            value: values[2]
        });
    }

    return keys;
}
