/// <reference path="VectorEditor.ts"/>

module VectorEditor {
    export function createShape(editor: Editor, x: number, y: number, type: string, prop: any): IShape {
        if (type === "rect") {
            return new Rect(editor, x, y, prop);
        } else if (type === "ellipse") {
            return new Ellipse(editor, x, y, prop);
        } else if (type === "line") {
            return new SimpleLine(editor, x, y, prop);
        } else if (type === "path") {
            return new Path(editor, x, y, prop);
        } else if (type === "text") {
            return new Text(editor, x, y, prop);
        }
    }
} 