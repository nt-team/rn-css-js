module.exports = function(keys) {
    var values = keys[0].value.split(" ");
    return [{
        key: "flex",
        value: values[0]
    }];
}
