"use strict";
var _ = require('lodash');
var FoldingType = (function () {
    function FoldingType(_cssClass) {
        this._cssClass = _cssClass;
        this._nodeType = this._cssClass.replace(/-(.)/, function (original, match) { return match.toUpperCase(); });
    }
    Object.defineProperty(FoldingType.prototype, "cssClass", {
        get: function () {
            return this._cssClass;
        },
        enumerable: true,
        configurable: true
    });
    FoldingType.prototype.getCssClass = function (nodeOptions) {
        if (_.get(nodeOptions, 'cssClasses.' + this._nodeType) !== undefined) {
            return nodeOptions.cssClasses[this._nodeType];
        }
        return this._cssClass;
    };
    FoldingType.Expanded = new FoldingType('node-expanded');
    FoldingType.Collapsed = new FoldingType('node-collapsed');
    FoldingType.Leaf = new FoldingType('node-leaf');
    return FoldingType;
}());
exports.FoldingType = FoldingType;
(function (TreeStatus) {
    TreeStatus[TreeStatus["New"] = 0] = "New";
    TreeStatus[TreeStatus["Modified"] = 1] = "Modified";
    TreeStatus[TreeStatus["EditInProgress"] = 2] = "EditInProgress";
})(exports.TreeStatus || (exports.TreeStatus = {}));
var TreeStatus = exports.TreeStatus;
//# sourceMappingURL=tree.types.js.map