module VectorEditor {
    export function getRelativePositionToWindow(elem: JQuery) {
        var pos = elem.offset();
        var bodyScrollTop = $(window).scrollTop();
        var bodyScrollLeft = $(window).scrollLeft();
        return [
            pos.left - bodyScrollLeft,
            pos.top - bodyScrollTop
        ];
    }
}