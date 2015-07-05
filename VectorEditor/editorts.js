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
                "strokeOpacity": 1,
                "fillOpacity": 1,
                "text": Text
            };

            this.mode = "select";
            this.action = "";

            this.shapes = [];
            this.onHitXy = [0, 0];

            this.registerMouseEvents();
        }
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
            if (this.mode === "select") {
            } else {
                var position = VectorEditor.getRelativePositionToWindow(this.container), x = event.clientX - position[0], y = event.clientY - position[1];
                var shape = VectorEditor.createShape(this.paper, x, y, this.mode, this.prop);
                this.shapes.push(shape);

                // Cache the mouse down position
                this.onHitXy = [x, y];
            }
        };

        Editor.prototype.onMouseMove = function (event) {
            if (this.mode === "select") {
            } else {
                var position = VectorEditor.getRelativePositionToWindow(this.container), x = event.clientX - position[0], y = event.clientY - position[1], shape = this.currentShape;
                shape.resize(x - this.onHitXy[0], y - this.onHitXy[1]);
            }
        };

        Editor.prototype.onMouseUp = function (event) {
            if (this.mode === "select" || this.mode === "delete") {
            } else {
                if (this.currentShape.blank()) {
                    this.currentShape.remove();
                }
            }
        };
        return Editor;
    })();
    VectorEditor.Editor = Editor;
})(VectorEditor || (VectorEditor = {}));
//# sourceMappingURL=editorts.js.map
