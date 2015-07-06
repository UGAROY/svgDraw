/// <reference path="VectorEditor.ts"/>
var VectorEditor;
(function (VectorEditor) {
    function createShape(editor, x, y, type, prop) {
        if (type === "rect") {
            return new VectorEditor.Rect(editor, x, y, prop);
        }
        else if (type === "ellipse") {
            return new VectorEditor.Ellipse(editor, x, y, prop);
        }
        else if (type === "line") {
            return new VectorEditor.SimpleLine(editor, x, y, prop);
        }
        else if (type === "path") {
            return new VectorEditor.Path(editor, x, y, prop);
        }
        else if (type === "text") {
            return new VectorEditor.Text(editor, x, y, prop);
        }
    }
    VectorEditor.createShape = createShape;
})(VectorEditor || (VectorEditor = {}));
//# sourceMappingURL=shapeFactory.js.map