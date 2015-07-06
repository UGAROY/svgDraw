/// <reference path="VectorEditor.ts"/>

module VectorEditor {
    export class SimpleLine implements IShape {
        shape: RaphaelElement;
        trackerSet: RaphaelSet;

        editor: Editor;
        paper: RaphaelPaper;

        offset: number;
        originX: number;
        originY: number;
        currentRotaion: number;
        currentTransformation: string;

        constructor(editor: Editor, x: number, y: number, prop: any) {
            this.editor = editor;
            this.paper = editor.paper;
            this.shape = this.paper.path(Raphael.format("M{0},{1}", x, y));
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
                this.syncTracker();
            }, (): any => {
                    if (this.editor.mode !== "select") {
                        return;
                    }
                    // TODO: here we have to call a function in the parent container
                    // Figure out a better way to do this
                    this.editor.unSelectAll();
                    this.showTracker();
                    this.currentTransformation = this.shape.transform();
                }, (): any => { });
        }

        addTracker(): void {
            var box = this.shape.getBBox();
            this.trackerSet = this.paper.set();
            this.trackerSet.push(
                this.paper.rect(box.x - this.offset, box.y - this.offset,
                    box.width + 2 * this.offset, box.height + 2 * this.offset),
                this.paper.circle((box.x + box.x2) / 2, box.y - this.offset * 3, 5)
                );
            this.trackerSet[1].attr("fill", "#FFFFFF");
            this.trackerSet.attr("stroke-dasharray", "-");

            // Add event handlers
            this.trackerSet[1].mouseover(function () { this.attr("fill", "red") });
            this.trackerSet[1].mouseout(function () { this.attr("fill", "white") });

            // Add rotate event listeners to rotat tracker
            this.trackerSet[1].drag((dx: number, dy: number, x: number, y: number): any => {
                var rad = Math.atan2(y - this.originY, x - this.originX),
                    deg = ((rad * (180 / Math.PI) + 90) % 360 + 360) % 360;
                this.shape.transform(this.currentTransformation);
                this.shape.transform(Raphael.format("...R{0},{1},{2}", deg - this.currentRotaion, this.originX, this.originY));
                this.syncTracker();
            }, (): any => {
                    var box = this.shape.getBBox();
                    this.originX = (box.x + box.x2) / 2;
                    this.originY = (box.y + box.y2) / 2;
                    this.currentRotaion = this.shape.matrix.split().rotate;
                    this.currentTransformation = this.shape.transform();
                }, (): any => {

                });

            this.trackerSet.hide();
        }

        resize(width: number, height: number): void {
            var pathSplit = Raphael.parsePathString(this.shape.attr("path"));
            pathSplit.splice(1);
            this.shape.attr("path", Raphael.format("{0}L{1},{2}", pathSplit.toString(), pathSplit[0][1] + width, pathSplit[0][2] + height));
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

        syncTracker(): void {
            this.trackerSet.transform(this.shape.transform());
        }

    }
}