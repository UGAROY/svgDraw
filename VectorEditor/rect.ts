/// <reference path="VectorEditor.ts"/>

module VectorEditor {
    export class Rect implements IShape {
        shape: RaphaelElement;
        trackerSet: RaphaelSet;
        editor: Editor;
        paper: RaphaelPaper;

        offset: number;
        originX: number;
        originY: number;
        currentWidth: number;
        currentHeight: number;
        currentTransformation: string;

        constructor(editor: Editor, x: number, y: number, prop: any) {
            this.editor = editor;
            this.paper = editor.paper;
            this.shape = this.paper.rect(x, y, 0, 0);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();

            this.offset = 5;

            // Add drag event listeners to shape
            this.shape.drag((dx: number, dy: number): any => {
                this.shape.transform(this.currentTransformation);
                this.shape.transform(Raphael.format("...T{0}, {1}", dx, dy));
                // Update the tracker as well
                this.trackerSet.transform(this.currentTransformation);
                this.trackerSet.transform(Raphael.format("...T{0}, {1}", dx, dy));
            }, (): any => {
                // TODO: here we have to call a function in the parent container
                // Figure out a better way to do this
                this.editor.unSelectAll();
                this.showTracker();
                this.currentTransformation = this.shape.transform();
            }, (): any => {});
        }

        addTracker(): void {
            var box = this.shape.getBBox();
            this.trackerSet = this.paper.set();
            this.trackerSet.push(
                this.paper.rect(box.x - this.offset, box.y - this.offset,
                    box.width + 2 * this.offset, box.height + 2 * this.offset),
                this.paper.circle((box.x + box.x2) / 2, box.y - this.offset * 3, 5),
                this.paper.rect(box.x2 + this.offset / 2, box.y2 + this.offset / 2, 7.5, 7.5)
            );
            this.trackerSet[1].attr("fill", "#FFFFFF");
            this.trackerSet[2].attr("fill", "#FFFFFF");

            // Add event handlers
            this.trackerSet[1].mouseover(function () { this.attr("fill", "red") });
            this.trackerSet[2].mouseover(function () { this.attr("fill", "red") });
            this.trackerSet[1].mouseout(function () { this.attr("fill", "white") });
            this.trackerSet[2].mouseout(function () { this.attr("fill", "white") });

            // Add drag event listeners to scale tracker
            this.trackerSet[2].drag((dx: number, dy: number): any => {
                var scaleX = (this.currentWidth + dx) / this.currentWidth,
                    scaleY = (this.currentHeight + dy) / this.currentHeight;
                console.log(this.originX, this.originY, scaleX, scaleY);
                this.shape.transform(this.currentTransformation);
                this.shape.transform(Raphael.format("...S{0}, {1}, {2} {3}", scaleX, scaleY, this.originX, this.originY));
                // Update the tracker as well
                this.trackerSet.transform(this.currentTransformation);
                this.trackerSet[0].transform(Raphael.format("...S{0}, {1}, {2} {3}", scaleX, scaleY, this.originX, this.originY));
            }, (): any => {
                var box = this.shape.getBBox();
                this.originX = (box.x + box.x2) / 2;
                this.originY = (box.y + box.y2) / 2;
                this.currentWidth = box.width;
                this.currentHeight = box.height;
                this.currentTransformation = this.shape.transform();
                }, (): any => { });

            this.trackerSet.hide();
        }

        resize(width: number, height: number): void {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("width", width);
            this.shape.attr("height", height);
        }

        postCreate(): void {
            var box = this.shape.getBBox();
            if (box.width === 0 || box.height === 0) {
                this.shape.remove();
            } else {
                this.addTracker();
            }
        }

        remove(): void {
            this.shape.remove();
        }

        showTracker(): void {
            this.trackerSet.show();

            // Make sure the shape is on top of the trackerSet
            this.trackerSet.toFront();
            this.shape.toFront();
        }

        hideTracker(): void {
            this.trackerSet.hide();
        }

    }
}