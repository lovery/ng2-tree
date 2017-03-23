"use strict";
var core_1 = require('@angular/core');
var menu_service_1 = require('./menu.service');
var menu_types_1 = require('./menu.types');
var options_types_1 = require('../options.types');
var event_utils_1 = require('../utils/event.utils');
var tree_types_1 = require('../tree.types');
var MenuComponent = (function () {
    function MenuComponent(renderer, menuService) {
        this.renderer = renderer;
        this.menuService = menuService;
        this.menuItemSelected = new core_1.EventEmitter();
        this.disposersForListeners = [];
        this.disposersForGlobalListeners = [];
        this.isMenuVisible = false;
    }
    MenuComponent.prototype.ngOnInit = function () {
        this.isMenuVisible = false;
        this.menuOptions = new options_types_1.MenuOptions(this.menuOptions);
        this.availableMenuItems = options_types_1.MenuOptions.getMainMenuItems(this.menuOptions, this.rootNode);
        this.disposersForListeners.push(this.renderer.listen(this.button.nativeElement, 'click', this.showMenu.bind(this)));
    };
    MenuComponent.prototype.ngOnDestroy = function () {
        this.disposersForGlobalListeners.forEach(function (dispose) { return dispose(); });
    };
    MenuComponent.prototype.onMenuItemSelected = function (e, selectedMenuItem) {
        console.log('in onMenuItemSelected');
        if (event_utils_1.isLeftButtonClicked(e)) {
            console.log('in onMenuItemSelected first if');
            if (selectedMenuItem.action !== undefined) {
                console.log('in onMenuItemSelected second if');
                console.log(selectedMenuItem);
                switch (selectedMenuItem.action.name) {
                    case menu_types_1.MenuItemAction.NewLeaf.name:
                        console.log('in MenuItemAction.NewLeaf.name');
                        if (!this.rootNode.children || !this.rootNode.children.push) {
                            this.rootNode.children = [];
                        }
                        var newNode = { value: '', systems: this.rootNode.systems };
                        newNode.systems.status = tree_types_1.TreeStatus.New;
                        this.rootNode.children.push(newNode);
                        break;
                    case menu_types_1.MenuItemAction.NewNode.name:
                        console.log('in MenuItemAction.NewNode.name');
                        if (!this.rootNode.children || !this.rootNode.children.push) {
                            this.rootNode.children = [];
                        }
                        var newNode = { value: '', systems: this.rootNode.systems };
                        newNode.systems.status = tree_types_1.TreeStatus.New;
                        newNode.children = [];
                        this.rootNode.children.push(newNode);
                        break;
                    default:
                        console.log('in MenuItemAction.Custom.name');
                        selectedMenuItem.actionFunction({ rootNode: this.rootNode });
                }
            }
        }
    };
    MenuComponent.prototype.fireCloseMenu = function (e) {
        var mouseClicked = e instanceof MouseEvent;
        var escapePressed = e instanceof KeyboardEvent && event_utils_1.isEscapePressed(e);
        if (escapePressed || mouseClicked) {
            var isLocalElementClicked = false;
            for (var i = 0; i < this.button.nativeElement.children.length; i++) {
                isLocalElementClicked = isLocalElementClicked || this.button.nativeElement.children[i] === e.target;
            }
            console.log(isLocalElementClicked);
            if (!isLocalElementClicked) {
                this.closeMenu(e);
            }
        }
    };
    MenuComponent.prototype.closeMenu = function (e) {
        if (this.isMenuVisible) {
            console.log('close');
            this.isMenuVisible = !this.isMenuVisible;
            this.disposersForListeners.forEach(function (dispose) { return dispose(); });
            this.disposersForListeners = [];
            this.disposersForListeners.push(this.renderer.listen(this.button.nativeElement, 'click', this.showMenu.bind(this)));
            this.menuContent.nativeElement.className = this.menuContent.nativeElement.className.replace('expanded', 'collapsed');
            this.buttonIcon.nativeElement.className = this.buttonIcon.nativeElement.className.replace('expanded', 'collapsed');
            this.disposersForGlobalListeners.forEach(function (dispose) { return dispose(); });
            this.disposersForGlobalListeners = [];
        }
    };
    MenuComponent.prototype.showMenu = function (e) {
        if (event_utils_1.isLeftButtonClicked(e)) {
            console.log('showMenu');
            this.disposersForListeners.forEach(function (dispose) { return dispose(); });
            this.disposersForListeners = [];
            this.disposersForListeners.push(this.renderer.listen(this.button.nativeElement, 'click', this.closeMenu.bind(this)));
            this.menuContent.nativeElement.className = this.menuContent.nativeElement.className.replace('collapsed', 'expanded');
            this.buttonIcon.nativeElement.className = this.buttonIcon.nativeElement.className.replace('collapsed', 'expanded');
            this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'keydown', this.fireCloseMenu.bind(this)));
            this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'click', this.fireCloseMenu.bind(this)));
            this.isMenuVisible = !this.isMenuVisible;
        }
    };
    MenuComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'menu',
                    template: "\n  <div [ngClass]=\"menuOptions.menuClass\">\n    <button #button class=\"menu-button\">\n      <div #buttonIcon class=\"collapsed\"></div>\n      <span>Menu</span>\n    </button>\n    <ul #menuContent class=\"menu-content collapsed\">\n      <li class=\"menu-item\" *ngFor=\"let menuItem of availableMenuItems\"\n          (click)=\"onMenuItemSelected($event, menuItem)\">\n        <div class=\"menu-item-icon\" [ngClass]=\"menuItem.cssClass\"></div>\n        <span>{{menuItem.name}}</span>\n      </li>\n    </ul>\n  </div>\n  "
                },] },
    ];
    MenuComponent.ctorParameters = function () { return [
        { type: core_1.Renderer, decorators: [{ type: core_1.Inject, args: [core_1.Renderer,] },] },
        { type: menu_service_1.MenuService, decorators: [{ type: core_1.Inject, args: [menu_service_1.MenuService,] },] },
    ]; };
    MenuComponent.propDecorators = {
        'menuOptions': [{ type: core_1.Input },],
        'rootNode': [{ type: core_1.Input },],
        'menuItemSelected': [{ type: core_1.Output },],
        'menuContent': [{ type: core_1.ViewChild, args: ['menuContent',] },],
        'button': [{ type: core_1.ViewChild, args: ['button',] },],
        'buttonIcon': [{ type: core_1.ViewChild, args: ['buttonIcon',] },],
    };
    return MenuComponent;
}());
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map