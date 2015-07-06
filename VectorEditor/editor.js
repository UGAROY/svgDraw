var VectorEditor;
(function (VectorEditor) {
    var Editor = (function () {
        function Editor(element) {
            this.container = $(element);
            this.paper = Raphael(element, $(element).width(), $(element).height());
            this.prop = {
                "strokeWidth": 1,
                "stroke": "#000000",
                "fill": "#000000",
                "stroke-opacity": 1,
                "fill-opacity": 1,
                "text": "text"
            };
            this.mode = "select";
            this.action = "";
            this.shapes = [];
            this.onHitXy = [0, 0];
            this.registerMouseEvents();
        }
        Editor.prototype.setMode = function (mode) {
            if (mode !== "select") {
                this.unSelectAll();
            }
            this.mode = mode;
        };
        // UnSelect all the shapes
        Editor.prototype.unSelectAll = function () {
            this.shapes.forEach(function (shape) {
                shape.hideTracker();
            });
        };
        // Register Mouse Events
        Editor.prototype.registerMouseEvents = function () {
            var _this = this;
            this.container.bind("mousedown", function (event) {
                _this.onMouseDown(event);
            });
            this.container.bind("mouseup", function (event) {
                _this.onMouseUp(event);
            });
            this.container.bind("mousemove", function (event) {
                _this.onMouseMove(event);
            });
        };
        Editor.prototype.onMouseDown = function (event) {
            var position = VectorEditor.getRelativePositionToWindow(this.container), x = event.clientX - position[0], y = event.clientY - position[1];
            if (this.mode === "select") {
                if (event.target.tagName === "svg") {
                    this.unSelectAll();
                    return;
                }
            }
            else {
                var shape = VectorEditor.createShape(this, x, y, this.mode, this.prop);
                this.shapes.push(shape);
                this.currentShape = shape;
                // Cache the mouse down position
                this.onHitXy = [x, y];
                this.startMouseEvent = true;
            }
        };
        Editor.prototype.onMouseMove = function (event) {
            if (!this.startMouseEvent) {
                return;
            }
            if (this.mode === "select") {
            }
            else {
                var position = VectorEditor.getRelativePositionToWindow(this.container), x = event.clientX - position[0], y = event.clientY - position[1], shape = this.currentShape;
                shape.resize(x - this.onHitXy[0], y - this.onHitXy[1]);
            }
        };
        Editor.prototype.onMouseUp = function (event) {
            if (this.mode === "select" || this.mode === "delete") {
            }
            else {
                this.currentShape.postCreate();
                this.currentShape = null;
                this.startMouseEvent = false;
            }
        };
        return Editor;
    })();
    VectorEditor.Editor = Editor;
})(VectorEditor || (VectorEditor = {}));
//# sourceMappingURL=Editor.js.map