/// <reference path="VectorEditor.ts"/>
var VectorEditor;
(function (VectorEditor) {
    var Rect = (function () {
        function Rect(editor, x, y, prop) {
            var _this = this;
            this.editor = editor;
            this.paper = editor.paper;
            this.shape = this.paper.rect(x, y, 0, 0);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.offset = 5;
            // Add drag event listeners to shape
            this.shape.drag(function (dx, dy) {
                _this.shape.transform(_this.currentTransformation);
                _this.shape.transform(Raphael.format("...T{0}, {1}", dx, dy));
                // Update the tracker as well
                _this.trackerSet.transform(_this.currentTransformation);
                _this.trackerSet.transform(Raphael.format("...T{0}, {1}", dx, dy));
            }, function () {
                // TODO: here we have to call a function in the parent container
                // Figure out a better way to do this
                _this.editor.unSelectAll();
                _this.showTracker();
                _this.currentTransformation = _this.shape.transform();
            }, function () { });
        }
        Rect.prototype.addTracker = function () {
            var _this = this;
            var box = this.shape.getBBox();
            this.trackerSet = this.paper.set();
            this.trackerSet.push(this.paper.rect(box.x - this.offset, box.y - this.offset, box.width + 2 * this.offset, box.height + 2 * this.offset), this.paper.circle((box.x + box.x2) / 2, box.y - this.offset * 3, 5), this.paper.rect(box.x2 + this.offset / 2, box.y2 + this.offset / 2, 7.5, 7.5));
            this.trackerSet[1].attr("fill", "#FFFFFF");
            this.trackerSet[2].attr("fill", "#FFFFFF");
            // Add event handlers
            this.trackerSet[1].mouseover(function () { this.attr("fill", "red"); });
            this.trackerSet[2].mouseover(function () { this.attr("fill", "red"); });
            this.trackerSet[1].mouseout(function () { this.attr("fill", "white"); });
            this.trackerSet[2].mouseout(function () { this.attr("fill", "white"); });
            // Add drag event listeners to scale tracker
            this.trackerSet[2].drag(function (dx, dy) {
                var scaleX = (_this.currentWidth + dx) / _this.currentWidth, scaleY = (_this.currentHeight + dy) / _this.currentHeight;
                console.log(_this.originX, _this.originY, scaleX, scaleY);
                _this.shape.transform(_this.currentTransformation);
                _this.shape.transform(Raphael.format("...S{0}, {1}, {2} {3}", scaleX, scaleY, _this.originX, _this.originY));
                // Update the tracker as well
                _this.trackerSet.transform(_this.currentTransformation);
                _this.trackerSet[0].transform(Raphael.format("...S{0}, {1}, {2} {3}", scaleX, scaleY, _this.originX, _this.originY));
            }, function () {
                var box = _this.shape.getBBox();
                _this.originX = (box.x + box.x2) / 2;
                _this.originY = (box.y + box.y2) / 2;
                _this.currentWidth = box.width;
                _this.currentHeight = box.height;
                _this.currentTransformation = _this.shape.transform();
            }, function () { });
            this.trackerSet.hide();
        };
        Rect.prototype.resize = function (width, height) {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("width", width);
            this.shape.attr("height", height);
        };
        Rect.prototype.postCreate = function () {
            var box = this.shape.getBBox();
            if (box.width === 0 || box.height === 0) {
                this.shape.remove();
            }
            else {
                this.addTracker();
            }
        };
        Rect.prototype.remove = function () {
            this.shape.remove();
        };
        Rect.prototype.showTracker = function () {
            this.trackerSet.show();
            // Make sure the shape is on top of the trackerSet
            this.trackerSet.toFront();
            this.shape.toFront();
        };
        Rect.prototype.hideTracker = function () {
            this.trackerSet.hide();
        };
        return Rect;
    })();
    VectorEditor.Rect = Rect;
})(VectorEditor || (VectorEditor = {}));
//# sourceMappingURL=rect.js.map