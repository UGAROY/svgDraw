var VectorEditor;
(function (VectorEditor) {
    function getRelativePositionToWindow(elem) {
        var pos = elem.offset();
        var bodyScrollTop = $(window).scrollTop();
        var bodyScrollLeft = $(window).scrollLeft();
        return [
            pos.left - bodyScrollLeft,
            pos.top - bodyScrollTop
        ];
    }
    VectorEditor.getRelativePositionToWindow = getRelativePositionToWindow;
})(VectorEditor || (VectorEditor = {}));
//# sourceMappingURL=util.js.map