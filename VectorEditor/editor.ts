module VectorEditor {

    export class Editor {
        container: JQuery;
        paper: RaphaelPaper;
        prop: any;
        mode: string;
        action: string;
        shapes: IShape[];

        startMouseEvent: boolean;
        onHitXy: number[];

        currentShape: IShape;

        constructor(element: HTMLElement) {

            this.container = $(element);
            this.paper = Raphael(element, $(element).width(), $(element).height());

            this.prop = {
                "strokeWidth": 1,
                "stroke": "#000000",
                "fill": "#000000",
                "stroke-opacity": 1,
                "fill-opacity": 1,
                "text": Text
            }
            
            this.mode = "select";
            this.action = "";

            this.shapes = [];
            this.onHitXy = [0, 0];

            this.registerMouseEvents();
        }

        setMode(mode): void {
            if (mode !== "select") {
                this.unSelectAll();
            }
            this.mode = mode;
        }

        // UnSelect all the shapes
        unSelectAll(): void {
            this.shapes.forEach((shape) => {
                shape.hideTracker();
            });
        }

        // Register Mouse Events
        private registerMouseEvents(): void {
            this.container.bind("mousedown", (event: JQueryEventObject) => {
                this.onMouseDown(event);
            });
            this.container.bind("mouseup", (event: JQueryEventObject) => {
                this.onMouseUp(event);
            });
            this.container.bind("mousemove", (event: JQueryEventObject) => {
                this.onMouseMove(event);
            });
        }

        private onMouseDown(event: JQueryEventObject): void {
            var position = getRelativePositionToWindow(this.container),
                x = event.clientX - position[0],
                y = event.clientY - position[1];
            if (this.mode === "select") {
                if (event.target.tagName === "svg") {
                    this.unSelectAll();
                    return;
                }
            } else {
                var shape = createShape(this, x, y, this.mode, this.prop);
                this.shapes.push(shape);
                this.currentShape = shape;
                // Cache the mouse down position
                this.onHitXy = [x, y];
            }

            this.startMouseEvent = true;
        }

        private onMouseMove(event: JQueryEventObject): void {
            if (!this.startMouseEvent) {
                return;
            }
            if (this.mode === "select") {

            } else {
                var position = getRelativePositionToWindow(this.container),
                    x = event.clientX - position[0], y = event.clientY - position[1],
                    shape = this.currentShape;
                shape.resize(x - this.onHitXy[0], y - this.onHitXy[1]);
            }
        }

        private onMouseUp(event: JQueryEventObject): void {
            if (this.mode === "select" || this.mode === "delete") {

            } else {
                this.currentShape.postCreate();
                this.currentShape = null;
            }
            this.startMouseEvent = false;
        }

    }
}