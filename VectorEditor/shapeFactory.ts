/// <reference path="VectorEditor.ts"/>

module VectorEditor {
    export function createShape(editor: Editor, x: number, y: number, type: string, prop: any): IShape {
        if (type === "rect") {
            return new Rect(editor, x, y, prop);
        }
    }
} 