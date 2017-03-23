"use strict";
var MenuItemAction = (function () {
    function MenuItemAction(name, action) {
        this.name = name;
        this.action = action;
    }
    MenuItemAction.NewNode = new MenuItemAction('NewFolder', undefined);
    MenuItemAction.NewLeaf = new MenuItemAction('NewTag', undefined);
    MenuItemAction.Rename = new MenuItemAction('Rename', undefined);
    MenuItemAction.Remove = new MenuItemAction('Remove', undefined);
    return MenuItemAction;
}());
exports.MenuItemAction = MenuItemAction;
(function (MenuAction) {
    MenuAction[MenuAction["Close"] = 0] = "Close";
})(exports.MenuAction || (exports.MenuAction = {}));
var MenuAction = exports.MenuAction;
//# sourceMappingURL=menu.types.js.map