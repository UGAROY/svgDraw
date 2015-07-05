/// <reference path="VectorEditor.ts"/>
var VectorEditor;
(function (VectorEditor) {
    function createShape(editor, x, y, type, prop) {
        if (type === "rect") {
            return new VectorEditor.Rect(editor, x, y, prop);
        }
    }
    VectorEditor.createShape = createShape;
})(VectorEditor || (VectorEditor = {}));
//# sourceMappingURL=shapeFactory.js.map