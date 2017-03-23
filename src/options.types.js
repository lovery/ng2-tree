"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var menu_types_1 = require('./menu/menu.types');
var _ = require('lodash');
var MenuItem = (function () {
    function MenuItem() {
    }
    MenuItem.proccessItems = function (menuItems) {
        for (var _i = 0, menuItems_1 = menuItems; _i < menuItems_1.length; _i++) {
            var menuItem = menuItems_1[_i];
            if (menuItem.actionFunction !== undefined) {
                menuItem.action = new menu_types_1.MenuItemAction('Custom', menuItem.actionFunction);
            }
            else if (menuItem.actionName !== undefined) {
                menuItem.action = menu_types_1.MenuItemAction[menuItem.actionName];
            }
        }
        return menuItems;
    };
    return MenuItem;
}());
exports.MenuItem = MenuItem;
var MenuOptions = (function () {
    function MenuOptions(base) {
        this.options = base === undefined ? undefined : base.options;
        this.style = base === undefined ? '' : base.style;
    }
    MenuOptions.getMainMenuItems = function (menuOptions, tree) {
        if (_.get(menuOptions, 'options', undefined) === undefined) {
            return [
                {
                    name: 'New Leaf',
                    action: menu_types_1.MenuItemAction.NewLeaf,
                    cssClass: _.get(tree, 'options.cssClasses.leafIcon', 'new-leaf')
                },
                {
                    name: 'New Node',
                    action: menu_types_1.MenuItemAction.NewNode,
                    cssClass: _.get(tree, 'options.cssClasses.nodeIcon', 'new-node')
                }
            ];
        }
        return MenuItem.proccessItems(menuOptions.options);
    };
    MenuOptions.getNodeMenuItems = function (menuOptions, tree) {
        if (menuOptions === undefined || menuOptions.options === undefined) {
            return [
                {
                    name: 'New Leaf',
                    action: menu_types_1.MenuItemAction.NewLeaf,
                    cssClass: _.get(tree, 'options.cssClasses.leafIcon', 'new-leaf')
                },
                {
                    name: 'New Node',
                    action: menu_types_1.MenuItemAction.NewNode,
                    cssClass: _.get(tree, 'options.cssClasses.nodeIcon', 'new-node')
                },
                {
                    name: 'Rename',
                    action: menu_types_1.MenuItemAction.Rename,
                    cssClass: 'rename'
                },
                {
                    name: 'Remove',
                    action: menu_types_1.MenuItemAction.Remove,
                    cssClass: 'remove'
                }
            ];
        }
        return MenuItem.proccessItems(menuOptions.options);
    };
    Object.defineProperty(MenuOptions.prototype, "menuClass", {
        get: function () {
            if (this.style !== undefined && this.style.menu !== undefined) {
                return this.style.menu;
            }
            return 'menu';
        },
        enumerable: true,
        configurable: true
    });
    return MenuOptions;
}());
exports.MenuOptions = MenuOptions;
var Options = (function () {
    function Options() {
        this.rightMenu = true;
        this.leftMenu = false;
        this.expanded = true;
    }
    return Options;
}());
exports.Options = Options;
var TreeOptions = (function (_super) {
    __extends(TreeOptions, _super);
    function TreeOptions() {
        _super.apply(this, arguments);
        this.mainMenu = false;
        this.selectEvent = true;
        this.editOnDouleClick = false;
        this.expandEmptyNode = true;
        this.lazyLoading = false;
    }
    return TreeOptions;
}(Options));
exports.TreeOptions = TreeOptions;
var TreeModelOptions = (function (_super) {
    __extends(TreeModelOptions, _super);
    function TreeModelOptions() {
        _super.apply(this, arguments);
        this.static = false;
        this.drag = true;
        this.selected = false;
        this.applyToSubtree = true;
    }
    TreeModelOptions.convert = function (base) {
        if (base === undefined) {
            return {
                static: false,
                drag: true,
                applyToSubtree: true
            };
        }
        else {
            var result = new TreeModelOptions();
            result = Object.assign(result, base);
            result.selected = false;
            return result;
        }
    };
    TreeModelOptions.merge = function (sourceA, sourceB) {
        var defaults = { static: false, drag: true, applyToSubtree: true };
        if (_.get(sourceB, 'options.applyToSubtree') === false) {
            defaults.applyToSubtree = false;
            return _.defaults({}, _.get(sourceA, 'options'), _.get(defaults, ''));
        }
        return _.defaults({}, _.get(sourceA, 'options'), _.get(sourceB, 'options'), _.get(defaults, ''));
    };
    TreeModelOptions.getOptions = function (sourceA, sourceB, treeOptions) {
        var defaults = _.defaultsDeep({}, TreeModelOptions.convert(treeOptions));
        var resultOptions;
        if (_.get(sourceB, 'options.applyToSubtree') === false) {
            defaults.applyToSubtree = false;
            resultOptions = _.defaultsDeep({}, _.get(sourceA, 'options'), defaults);
        }
        else {
            resultOptions = _.defaultsDeep({}, _.get(sourceA, 'options'), _.get(sourceB, 'options'), defaults);
            if (_.get(sourceB, 'options.selected', false)) {
                resultOptions.selected = false;
            }
        }
        return resultOptions;
    };
    return TreeModelOptions;
}(Options));
exports.TreeModelOptions = TreeModelOptions;
//# sourceMappingURL=options.types.js.map