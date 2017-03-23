"use strict";
var core_1 = require('@angular/core');
var node_menu_service_1 = require('./node-menu.service');
var menu_types_1 = require('./menu.types');
var options_types_1 = require('../options.types');
var event_utils_1 = require('../utils/event.utils');
var NodeMenuComponent = (function () {
    function NodeMenuComponent(renderer, nodeMenuService) {
        this.renderer = renderer;
        this.nodeMenuService = nodeMenuService;
        this.menuItemSelected = new core_1.EventEmitter();
        this.disposersForGlobalListeners = [];
    }
    NodeMenuComponent.prototype.ngOnInit = function () {
        this.availableMenuItems = options_types_1.MenuOptions.getNodeMenuItems(this.menuOptions, this.node);
        if (this.type === 'left') {
            this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'click', this.setEventListeners.bind(this)));
        }
        else {
            this.setEventListeners();
        }
    };
    NodeMenuComponent.prototype.ngOnDestroy = function () {
        this.disposersForGlobalListeners.forEach(function (dispose) { return dispose(); });
    };
    NodeMenuComponent.prototype.setEventListeners = function () {
        this.disposersForGlobalListeners.forEach(function (dispose) { return dispose(); });
        this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'keyup', this.closeMenu.bind(this)));
        this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'mousedown', this.closeMenu.bind(this)));
    };
    NodeMenuComponent.prototype.onMenuItemSelected = function (e, selectedMenuItem) {
        if (event_utils_1.isLeftButtonClicked(e)) {
            if (selectedMenuItem.action !== undefined) {
                this.menuItemSelected.emit({ nodeMenuItemAction: selectedMenuItem.action });
            }
        }
    };
    NodeMenuComponent.prototype.closeMenu = function (e) {
        var mouseClicked = e instanceof MouseEvent;
        var escapePressed = e instanceof KeyboardEvent && event_utils_1.isEscapePressed(e);
        if (escapePressed || mouseClicked) {
            var nodeMenuEvent = {
                sender: e.target,
                action: menu_types_1.MenuAction.Close
            };
            this.nodeMenuService.nodeMenuEvents$.next(nodeMenuEvent);
        }
    };
    NodeMenuComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'node-menu',
                    template: "\n    <div class=\"node-menu\">\n      <ul class=\"node-menu-content\">\n        <li class=\"node-menu-item\" *ngFor=\"let menuItem of availableMenuItems\"\n            (click)=\"onMenuItemSelected($event, menuItem)\">\n          <div class=\"node-menu-item-icon {{menuItem.cssClass}}\"></div>\n          <span class=\"node-menu-item-value\">{{menuItem.name}}</span>\n        </li>\n      </ul>\n    </div>\n  "
                },] },
    ];
    NodeMenuComponent.ctorParameters = function () { return [
        { type: core_1.Renderer, decorators: [{ type: core_1.Inject, args: [core_1.Renderer,] },] },
        { type: node_menu_service_1.NodeMenuService, decorators: [{ type: core_1.Inject, args: [node_menu_service_1.NodeMenuService,] },] },
    ]; };
    NodeMenuComponent.propDecorators = {
        'menuOptions': [{ type: core_1.Input },],
        'type': [{ type: core_1.Input },],
        'node': [{ type: core_1.Input },],
        'menuItemSelected': [{ type: core_1.Output },],
    };
    return NodeMenuComponent;
}());
exports.NodeMenuComponent = NodeMenuComponent;
//# sourceMappingURL=node-menu.component.js.map