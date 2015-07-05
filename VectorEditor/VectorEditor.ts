module VectorEditor {
    export interface IShape {
        resize(width: number, height: number): void;
        remove(): void;
        showTracker(): void;
        hideTracker(): void;
        postCreate(): void;
    }
}