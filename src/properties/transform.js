module.exports = function(keys) {
    var fullValue = keys[0].value;
    // remove spaces that are inside transformation values
    fullValue = fullValue.replace(/\((.+?)\)/g, function(a, b) {
        return "(" + b.replace(/\s/g, "") + ")";
    });
    // the only spaces left should be between transformation values
    var values = fullValue.split(' ');
    var transformations = [];

    for (var i = 0, j = values.length; i < j; i++) {
        var matches = values[i].match(/(.+)\((.+)\)/),
            transformationType = matches[1],
            transformation = matches[2];

        switch (transformationType) {
            case "perspective":
                transformations.push({
                    perspective: parseFloat(transformation)
                })
                break;

            case "rotate":
            case "rotateX":
            case "rotateY":
            case "rotateZ":
                var thisTransformation = {};
                thisTransformation[transformationType] = transformation;
                transformations.push(thisTransformation);
                break;

            case "rotate3d":
            case "rotate3D":
                var thisTransformationValues = transformation.split(",");
                transformations.push(
                    { rotateX: thisTransformationValues[0] },
                    { rotateY: thisTransformationValues[1] },
                    { rotateZ: thisTransformationValues[2] }
                );
                break;

            case "scale":
            case "scaleX":
            case "scaleY":
                var thisTransformation = {};
                thisTransformation[transformationType] = parseFloat(transformation);
                transformations.push(thisTransformation);
                break;

            case "scale3d":
            case "scale3D":
            case "scale2d":
            case "scale2D":
                var thisTransformationValues = transformation.split(",");
                transformations.push(
                    { scaleX: parseFloat(thisTransformationValues[0]) },
                    { scaleY: parseFloat(thisTransformationValues[1]) }
                );
                break;

            case "translateX":
            case "translateY":
                var thisTransformation = {};
                thisTransformation[transformationType] = parseFloat(transformation);
                transformations.push(thisTransformation);
                break;

            case "translate3d":
            case "translate3D":
            case "translate2d":
            case "translate2D":
                var thisTransformationValues = transformation.split(",");
                transformations.push(
                    { translateX: parseFloat(thisTransformationValues[0]) },
                    { translateY: parseFloat(thisTransformationValues[1]) }
                );
                break;
        }
    }

    return [{
        key: "transform",
        value: transformations
    }];

}
