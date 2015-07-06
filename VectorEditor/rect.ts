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
        currentRotaion: number;
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
                if (this.editor.mode !== "select") {
                    return;
                }
                this.shape.transform(this.currentTransformation);
                this.shape.transform(Raphael.format("...T{0}, {1}", dx, dy));
                this.syncTracker(dx, dy);
            }, (): any => {
                if (this.editor.mode !== "select") {
                    return;
                }
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

            // Add rotate event listeners to rotat tracker
            this.trackerSet[1].drag((dx: number, dy: number, x:number, y: number): any => {
                var rad = Math.atan2(y - this.originY, x - this.originX),
                    deg = ((rad * (180 / Math.PI) + 90) % 360 + 360) % 360;
                this.shape.transform(this.currentTransformation);
                this.shape.transform(Raphael.format("...R{0},{1},{2}", deg - this.currentRotaion, this.originX, this.originY));
                this.syncTracker(0, 0, deg);
            }, (): any => {
                var box = this.shape.getBBox();
                this.originX = (box.x + box.x2) / 2;
                this.originY = (box.y + box.y2) / 2;
                this.currentRotaion = this.shape.matrix.split().rotate;
                this.currentTransformation = this.shape.transform();
            }, (): any => {

            });

            // Add drag event listeners to scale tracker
            this.trackerSet[2].drag((dx: number, dy: number): any => {
                if (this.currentWidth + dx < 0 || this.currentHeight + dy < 0) {
                    return;
                }
                this.shape.attr("width", this.currentWidth + dx);
                this.shape.attr("height", this.currentHeight + dy);
                // Update the tracker as well
                this.syncTracker();
            }, (): any => {
                var box = this.shape.getBBox(true);
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

        syncTracker(dx: number = 0, dy: number = 0, rotate: number = 0): void {
            var matrix = this.shape.matrix.split(),
                box = this.shape.getBBox();

            if (rotate !== 0) {
                this.trackerSet.transform(Raphael.format("r{0},{1},{2}", matrix.rotate, this.originX, this.originY));
                return;
            } else if (dx !== 0 && dy !== 0) {
                this.trackerSet[0].transform(this.currentTransformation);
                this.trackerSet[0].transform(Raphael.format("...T{0},{1}", dx, dy));
            } 
            
            this.trackerSet[0].attr("width", this.shape.attr("width") + 2 * this.offset);
            this.trackerSet[0].attr("height", this.shape.attr("height") + 2 * this.offset);
            this.trackerSet[1].attr("cx", (box.x + box.x2) / 2);
            this.trackerSet[1].attr("cy", box.y - this.offset * 3);
            this.trackerSet[2].attr("x", box.x2 + this.offset / 2);
            this.trackerSet[2].attr("y", box.y2 + this.offset / 2);



        }

    }
}