/// <reference path="VectorEditor.ts"/>
var VectorEditor;
(function (VectorEditor) {
    var Path = (function () {
        function Path(editor, x, y, prop) {
            var _this = this;
            this.editor = editor;
            this.paper = editor.paper;
            this.shape = this.paper.path(Raphael.format("M{0},{1}", x, y));
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.offset = 5;
            // Add drag event listeners to shape
            this.shape.drag(function (dx, dy) {
                if (_this.editor.mode !== "select") {
                    return;
                }
                _this.shape.transform(_this.currentTransformation);
                _this.shape.transform(Raphael.format("...T{0}, {1}", dx, dy));
                _this.syncTracker();
            }, function () {
                if (_this.editor.mode !== "select") {
                    return;
                }
                // TODO: here we have to call a function in the parent container
                // Figure out a better way to do this
                _this.editor.unSelectAll();
                _this.showTracker();
                _this.currentTransformation = _this.shape.transform();
            }, function () { });
        }
        Path.prototype.addTracker = function () {
            var _this = this;
            var box = this.shape.getBBox();
            this.trackerSet = this.paper.set();
            this.trackerSet.push(this.paper.rect(box.x - this.offset, box.y - this.offset, box.width + 2 * this.offset, box.height + 2 * this.offset), this.paper.circle((box.x + box.x2) / 2, box.y - this.offset * 3, 5));
            this.trackerSet[1].attr("fill", "#FFFFFF");
            this.trackerSet.attr("stroke-dasharray", "-");
            // Add event handlers
            this.trackerSet[1].mouseover(function () { this.attr("fill", "red"); });
            this.trackerSet[1].mouseout(function () { this.attr("fill", "white"); });
            // Add rotate event listeners to rotat tracker
            this.trackerSet[1].drag(function (dx, dy, x, y) {
                var rad = Math.atan2(y - _this.originY, x - _this.originX), deg = ((rad * (180 / Math.PI) + 90) % 360 + 360) % 360;
                _this.shape.transform(_this.currentTransformation);
                _this.shape.transform(Raphael.format("...R{0},{1},{2}", deg - _this.currentRotaion, _this.originX, _this.originY));
                _this.syncTracker();
            }, function () {
                var box = _this.shape.getBBox();
                _this.originX = (box.x + box.x2) / 2;
                _this.originY = (box.y + box.y2) / 2;
                _this.currentRotaion = _this.shape.matrix.split().rotate;
                _this.currentTransformation = _this.shape.transform();
            }, function () {
            });
            this.trackerSet.hide();
        };
        Path.prototype.resize = function (width, height) {
            var pathSplit = Raphael.parsePathString(this.shape.attr("path"));
            this.shape.attr("path", Raphael.format("{0}L{1},{2}", pathSplit.toString(), pathSplit[0][1] + width, pathSplit[0][2] + height));
        };
        Path.prototype.postCreate = function () {
            var box = this.shape.getBBox();
            if (box.width === 0 || box.height === 0) {
                this.shape.remove();
            }
            else {
                this.addTracker();
            }
        };
        Path.prototype.remove = function () {
            this.shape.remove();
        };
        Path.prototype.showTracker = function () {
            this.trackerSet.show();
            // Make sure the shape is on top of the trackerSet
            this.trackerSet.toFront();
            this.shape.toFront();
        };
        Path.prototype.hideTracker = function () {
            this.trackerSet.hide();
        };
        Path.prototype.syncTracker = function () {
            this.trackerSet.transform(this.shape.transform());
        };
        return Path;
    })();
    VectorEditor.Path = Path;
})(VectorEditor || (VectorEditor = {}));
//# sourceMappingURL=Path.js.map