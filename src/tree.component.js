"use strict";
var core_1 = require('@angular/core');
var tree_types_1 = require('./tree.types');
var options_types_1 = require('./options.types');
var node_draggable_service_1 = require('./draggable/node-draggable.service');
var node_menu_service_1 = require('./menu/node-menu.service');
var draggable_types_1 = require('./draggable/draggable.types');
var menu_types_1 = require('./menu/menu.types');
var editable_type_1 = require('./editable/editable.type');
var tree_service_1 = require('./tree.service');
var event_utils_1 = require('./utils/event.utils');
var _ = require('lodash');
var type_utils_1 = require('./utils/type.utils');
var TreeInternalComponent = (function () {
    function TreeInternalComponent(nodeMenuService, nodeDraggableService, treeService, element) {
        this.nodeMenuService = nodeMenuService;
        this.nodeDraggableService = nodeDraggableService;
        this.treeService = treeService;
        this.element = element;
        this.nodeExpanded = new core_1.EventEmitter();
        this.nodeCollapsed = new core_1.EventEmitter();
        this.nodeRemoved = new core_1.EventEmitter();
    }
    TreeInternalComponent.prototype.ngOnInit = function () {
        this.indexInParent = 0;
        this.tree.systems = {
            isSelected: false,
            isLeaf: false,
            isExpanded: false,
            isRightMenuVisible: false,
            isLeftMenuVisible: false,
            foldingType: undefined,
            status: undefined,
            indexInParent: this.indexInParent
        };
        this.tree.systems.isLeaf = !Array.isArray(this.tree.children);
        this.tree.options = options_types_1.TreeModelOptions.getOptions(this.tree, this.parentTree, this.options);
        this.tree.systems.isSelected = _.get(this.tree, 'options.selected', false);
        if (this.tree.systems.isSelected) {
            this.treeService.nodeSelected$.next({ node: this.tree });
        }
        if (_.get(this.tree, 'options.rightMenu', true)) {
            this.tree.systems.isRightMenuVisible = false;
            this.rightMenuOptions = _.get(this.tree, 'options.rightMenuOptions', undefined);
            this.setUpRightMenuEventHandler();
        }
        if (_.get(this.tree, 'options.leftMenu', false)) {
            this.tree.systems.isLeftMenuVisible = false;
            this.leftMenuOptions = _.get(this.tree, 'options.leftMenuOptions', undefined);
            this.setUpLeftMenuEventHandler();
        }
        this.setUpNodeSelectedEventHandler();
        this.setUpDraggableEventHandler();
        this.initializeApi();
    };
    TreeInternalComponent.prototype.initializeApi = function () {
        this.tree.api = {
            select: undefined,
            deselect: undefined,
            expand: undefined,
            collapse: undefined,
            service: this.treeService
        };
        this.tree.api.select = function (tree) {
            tree.systems.isSelected = true;
            tree.api.service.nodeSelected$.next({ node: tree });
        };
        this.tree.api.deselect = function (tree) {
            tree.systems.isSelected = false;
        };
        this.tree.api.expand = function (tree) {
            if (tree.systems.foldingType === tree_types_1.FoldingType.Collapsed) {
                tree.systems.foldingType = tree_types_1.FoldingType.Expanded;
                tree.api.service.nodeExpanded$.next({ node: tree });
            }
        };
        this.tree.api.collapse = function (tree) {
            if (tree.systems.foldingType === tree_types_1.FoldingType.Expanded) {
                tree.systems.foldingType = tree_types_1.FoldingType.Collapsed;
                tree.api.service.nodeCollapsed$.next({ node: tree });
            }
        };
    };
    TreeInternalComponent.prototype.onNodeSelected = function (e, tree) {
        if (event_utils_1.isLeftButtonClicked(e)) {
            if (_.get(this, 'options.selectEvent', true)) {
                this.tree.systems.isSelected = true;
                this.treeService.nodeSelected$.next({ node: this.tree });
            }
            else {
                this.switchFoldingType(e, tree);
            }
        }
    };
    TreeInternalComponent.prototype.setUpNodeSelectedEventHandler = function () {
        var _this = this;
        this.treeService.nodeSelected$
            .filter(function (e) { return _this.tree !== e.node; })
            .subscribe(function () { return _this.tree.systems.isSelected = false; });
    };
    TreeInternalComponent.prototype.setUpRightMenuEventHandler = function () {
        var _this = this;
        this.nodeMenuService.nodeMenuEvents$
            .filter(function (e) { return _this.element.nativeElement !== e.sender; })
            .filter(function (e) { return e.action === menu_types_1.MenuAction.Close; })
            .subscribe(function () {
            console.log('close right');
            _this.tree.systems.isRightMenuVisible = false;
        });
    };
    TreeInternalComponent.prototype.setUpLeftMenuEventHandler = function () {
        var _this = this;
        this.nodeMenuService.nodeMenuEvents$
            .filter(function (e) { return _this.element.nativeElement !== e.sender; })
            .filter(function (e) { return e.action === menu_types_1.MenuAction.Close; })
            .subscribe(function () {
            console.log('close left');
            _this.tree.systems.isLeftMenuVisible = false;
            if (_.get(_this, 'leftMenuButton.nativeElement.classList', undefined) !== undefined) {
                _this.leftMenuButton.nativeElement.classList.remove('active');
            }
        });
    };
    TreeInternalComponent.prototype.setUpDraggableEventHandler = function () {
        var _this = this;
        this.nodeDraggableService.draggableNodeEvents$
            .filter(function (e) { return e.action === draggable_types_1.NodeDraggableEventAction.Remove; })
            .filter(function (e) { return e.captured.element === _this.element; })
            .subscribe(function (e) { return _this.onChildRemoved({ node: e.captured.tree }, _this.parentTree); });
        this.nodeDraggableService.draggableNodeEvents$
            .filter(function (e) { return e.action !== draggable_types_1.NodeDraggableEventAction.Remove; })
            .filter(function (e) { return e.target === _this.element; })
            .filter(function (e) { return !_this.hasChild(e.captured.tree); })
            .subscribe(function (e) {
            if (_this.isSiblingOf(e.captured.tree)) {
                return _this.swapWithSibling(e.captured.tree);
            }
            if (_this.isFolder()) {
                return _this.moveNodeToThisTreeAndRemoveFromPreviousOne(e);
            }
            else {
                return _this.moveNodeToParentTreeAndRemoveFromPreviousOne(e);
            }
        });
    };
    TreeInternalComponent.prototype.moveNodeToThisTreeAndRemoveFromPreviousOne = function (e) {
        this.tree.children.push(e.captured.tree);
        this.nodeDraggableService.draggableNodeEvents$.next(_.merge(e, { action: draggable_types_1.NodeDraggableEventAction.Remove }));
        this.treeService.nodeMoved$.next({
            node: e.captured.tree,
            parent: this.tree
        });
    };
    TreeInternalComponent.prototype.moveNodeToParentTreeAndRemoveFromPreviousOne = function (e) {
        this.parentTree.children.splice(this.indexInParent, 0, e.captured.tree);
        this.nodeDraggableService.draggableNodeEvents$.next(_.merge(e, { action: draggable_types_1.NodeDraggableEventAction.Remove }));
        this.treeService.nodeMoved$.next({
            node: e.captured.tree,
            parent: this.parentTree
        });
    };
    TreeInternalComponent.prototype.isEditInProgress = function () {
        return this.tree.systems.status === tree_types_1.TreeStatus.EditInProgress
            || this.tree.systems.status === tree_types_1.TreeStatus.New;
    };
    TreeInternalComponent.prototype.isFolder = function () {
        return !this.tree.systems.isLeaf;
    };
    TreeInternalComponent.prototype.hasChild = function (child) {
        return _.includes(this.tree.children, child);
    };
    TreeInternalComponent.prototype.isSiblingOf = function (child) {
        return this.parentTree && _.includes(this.parentTree.children, child);
    };
    TreeInternalComponent.prototype.swapWithSibling = function (sibling) {
        var siblingIndex = this.parentTree.children.indexOf(sibling);
        var thisTreeIndex = this.parentTree.children.indexOf(this.tree);
        this.parentTree.children[siblingIndex] = this.tree;
        this.parentTree.children[thisTreeIndex] = sibling;
        this.tree.systems.indexInParent = siblingIndex;
        sibling.systems.indexInParent = thisTreeIndex;
        this.treeService.nodeMoved$.next({
            node: this.tree,
            parent: this.parentTree
        });
    };
    TreeInternalComponent.prototype.isNodeExpanded = function () {
        return this.tree.systems.foldingType === tree_types_1.FoldingType.Expanded;
    };
    TreeInternalComponent.prototype.switchFoldingType = function (e, tree) {
        this.handleFoldingType(e.target.parentNode.parentNode, tree);
    };
    TreeInternalComponent.prototype.getNodeIconCssClass = function (node) {
        if (node.systems.foldingType === tree_types_1.FoldingType.Leaf) {
            return _.get(node, 'options.cssClasses.leafIcon', 'node-icon');
        }
        return _.get(node, 'options.cssClasses.nodeIcon', 'node-icon');
    };
    TreeInternalComponent.prototype.getLeftMenuCssClass = function () {
        return _.get(this.tree, 'options.cssClasses.leftMenu', 'node-left-menu');
    };
    TreeInternalComponent.prototype.getFoldingTypeCssClass = function (node) {
        if (!node.systems.foldingType) {
            if (node.children) {
                if (!_.get(node, 'options.expandEmptyNode', true)
                    && (_.get(node, 'options.lazyLoading', false) && !_.get(node, 'hasNodeChildren', false))
                    && node.children.length === 0) {
                    return '';
                }
                if (_.get(node, 'options.expanded') === false) {
                    node.systems.foldingType = tree_types_1.FoldingType.Collapsed;
                }
                else {
                    node.systems.foldingType = tree_types_1.FoldingType.Expanded;
                }
            }
            else {
                node.systems.foldingType = tree_types_1.FoldingType.Leaf;
            }
        }
        return node.systems.foldingType.getCssClass(node.options);
    };
    TreeInternalComponent.prototype.getNextFoldingType = function (node) {
        if (node.systems.foldingType === tree_types_1.FoldingType.Expanded) {
            this.treeService.nodeCollapsed$.next({ node: node });
            this.nodeCollapsed.emit({ node: node });
            return tree_types_1.FoldingType.Collapsed;
        }
        this.treeService.nodeExpanded$.next({ node: node });
        this.nodeExpanded.emit({ node: node });
        return tree_types_1.FoldingType.Expanded;
    };
    TreeInternalComponent.prototype.handleFoldingType = function (parent, node) {
        if (node.systems.foldingType === tree_types_1.FoldingType.Leaf) {
            return;
        }
        node.systems.foldingType = this.getNextFoldingType(node);
    };
    TreeInternalComponent.prototype.onMenuItemSelected = function (e) {
        switch (e.nodeMenuItemAction) {
            case menu_types_1.MenuItemAction.NewLeaf:
                this.onNewSelected(e);
                break;
            case menu_types_1.MenuItemAction.NewNode:
                this.onNewSelected(e);
                break;
            case menu_types_1.MenuItemAction.Rename:
                this.onRenameSelected();
                break;
            case menu_types_1.MenuItemAction.Remove:
                this.onRemoveSelected();
                break;
            default:
                if (typeof e.nodeMenuItemAction.action === 'function') {
                    e.nodeMenuItemAction.action({ node: this.tree, parent: this.parentTree });
                }
        }
    };
    TreeInternalComponent.prototype.onRenameSelected = function () {
        this.tree.systems.status = tree_types_1.TreeStatus.EditInProgress;
        this.tree.systems.isRightMenuVisible = false;
    };
    TreeInternalComponent.prototype.onRemoveSelected = function () {
        this.treeService.nodeRemoved$.next({
            node: this.tree,
            parent: this.parentTree
        });
        this.nodeRemoved.emit({ node: this.tree });
    };
    TreeInternalComponent.prototype.onNewSelected = function (e) {
        if (!this.tree.children || !this.tree.children.push) {
            this.tree.children = [];
        }
        var newNode = { value: '', systems: this.tree.systems };
        newNode.systems.status = tree_types_1.TreeStatus.New;
        if (e.nodeMenuItemAction === menu_types_1.MenuItemAction.NewNode) {
            newNode.children = [];
        }
        this.tree.systems.isLeaf ? this.parentTree.children.push(newNode) : this.tree.children.push(newNode);
        this.tree.systems.isRightMenuVisible = false;
    };
    TreeInternalComponent.prototype.onChildRemoved = function (e, parent) {
        if (parent === void 0) { parent = this.tree; }
        var childIndex = _.findIndex(parent.children, function (child) { return child === e.node; });
        if (childIndex >= 0) {
            parent.children.splice(childIndex, 1);
        }
    };
    TreeInternalComponent.prototype.showLeftMenu = function (e) {
        if (this.tree.options.static) {
            return;
        }
        if (event_utils_1.isLeftButtonClicked(e) && _.get(this.tree, 'options.leftMenu', false)) {
            this.tree.systems.isLeftMenuVisible = !this.tree.systems.isLeftMenuVisible;
        }
        if (this.tree.systems.isLeftMenuVisible) {
            this.leftMenuButton.nativeElement.classList.add('active');
        }
    };
    TreeInternalComponent.prototype.showRightMenu = function (e) {
        if (this.tree.options.static) {
            return;
        }
        if (event_utils_1.isRightButtonClicked(e) && _.get(this.tree, 'options.rightMenu', true)) {
            this.tree.systems.isRightMenuVisible = !this.tree.systems.isRightMenuVisible;
            this.nodeMenuService.nodeMenuEvents$.next({
                sender: this.element.nativeElement,
                action: menu_types_1.MenuAction.Close
            });
            e.preventDefault();
        }
    };
    TreeInternalComponent.prototype.applyNewValue = function (e, node) {
        if (e.action === editable_type_1.NodeEditableEventAction.Cancel) {
            if (type_utils_1.isValueEmpty(e.value)) {
                return this.nodeRemoved.emit({ node: this.tree });
            }
            node.systems.status = tree_types_1.TreeStatus.Modified;
            return;
        }
        if (type_utils_1.isValueEmpty(e.value)) {
            return;
        }
        var nodeOldValue = node.value;
        if (type_utils_1.isRenamable(node.value)) {
            node.value = type_utils_1.applyNewValueToRenamable(node.value, e.value);
        }
        else {
            node.value = e.value;
        }
        if (node.systems.status === tree_types_1.TreeStatus.New) {
            this.treeService.nodeCreated$.next({ node: node, parent: this.parentTree });
        }
        if (node.systems.status === tree_types_1.TreeStatus.EditInProgress) {
            this.treeService.nodeRenamed$.next({
                node: node,
                parent: this.parentTree,
                oldValue: nodeOldValue,
                newValue: node.value
            });
        }
        node.systems.status = tree_types_1.TreeStatus.Modified;
    };
    TreeInternalComponent.prototype.onNodeDoubleClicked = function (e, tree) {
        if (_.get(this, 'options.editOnDouleClick', false)) {
            this.onRenameSelected();
            this.treeService.nodeSelected$.next({ node: tree });
        }
    };
    TreeInternalComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'tree-internal',
                    template: "\n  <ul class=\"tree\" *ngIf=\"tree\">\n    <li>\n      <div class=\"node-container\" (contextmenu)=\"showRightMenu($event)\" [nodeDraggable]=\"element\" [tree]=\"tree\">\n        <div class=\"folding\" (click)=\"switchFoldingType($event, tree)\" [ngClass]=\"getFoldingTypeCssClass(tree)\"></div>\n        <div href=\"#\" class=\"node-value\"\n              *ngIf=\"!isEditInProgress()\"\n              [class.node-selected]=\"tree.systems.isSelected\"\n              (click)=\"onNodeSelected($event, tree)\"\n              (dblclick)=\"onNodeDoubleClicked($event, tree)\">\n          <i [ngClass]=\"getNodeIconCssClass(tree)\"></i>\n          {{tree.value}}\n        </div>\n\n        <input type=\"text\" class=\"node-value\" *ngIf=\"isEditInProgress()\"\n              [nodeEditable]=\"tree.value\"\n              (valueChanged)=\"applyNewValue($event, tree)\"/>\n\n        <div #leftMenuButton [ngClass]=\"getLeftMenuCssClass()\" *ngIf=\"tree.options.leftMenu\" (click)=\"showLeftMenu($event)\"></div>\n        <node-menu [type]=\"'left'\" *ngIf=\"tree.systems.isLeftMenuVisible && tree.options.leftMenu\" (menuItemSelected)=\"onMenuItemSelected($event)\" [menuOptions]=\"leftMenuOptions\" [node]=\"tree\"></node-menu>\n\n      </div>\n\n      <node-menu [type]=\"'right'\" *ngIf=\"tree.systems.isRightMenuVisible\" (menuItemSelected)=\"onMenuItemSelected($event)\" [menuOptions]=\"rightMenuOptions\" [node]=\"tree\"></node-menu>\n\n      <template [ngIf]=\"isNodeExpanded()\">\n        <tree-internal [options]=\"options\" *ngFor=\"let child of tree.children; let position = index\"\n              [parentTree]=\"tree\"\n              [indexInParent]=\"position\"\n              [tree]=\"child\"\n              (nodeRemoved)=\"onChildRemoved($event)\"></tree-internal>\n      </template>\n    </li>\n  </ul>\n  "
                },] },
    ];
    TreeInternalComponent.ctorParameters = function () { return [
        { type: node_menu_service_1.NodeMenuService, decorators: [{ type: core_1.Inject, args: [node_menu_service_1.NodeMenuService,] },] },
        { type: node_draggable_service_1.NodeDraggableService, decorators: [{ type: core_1.Inject, args: [node_draggable_service_1.NodeDraggableService,] },] },
        { type: tree_service_1.TreeService, decorators: [{ type: core_1.Inject, args: [tree_service_1.TreeService,] },] },
        { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
    ]; };
    TreeInternalComponent.propDecorators = {
        'tree': [{ type: core_1.Input },],
        'parentTree': [{ type: core_1.Input },],
        'indexInParent': [{ type: core_1.Input },],
        'options': [{ type: core_1.Input },],
        'nodeExpanded': [{ type: core_1.Output },],
        'nodeCollapsed': [{ type: core_1.Output },],
        'nodeRemoved': [{ type: core_1.Output },],
        'leftMenuButton': [{ type: core_1.ViewChild, args: ['leftMenuButton',] },],
    };
    return TreeInternalComponent;
}());
exports.TreeInternalComponent = TreeInternalComponent;
var TreeComponent = (function () {
    function TreeComponent(treeService) {
        this.treeService = treeService;
        this.nodeCreated = new core_1.EventEmitter();
        this.nodeRemoved = new core_1.EventEmitter();
        this.nodeRenamed = new core_1.EventEmitter();
        this.nodeSelected = new core_1.EventEmitter();
        this.nodeExpanded = new core_1.EventEmitter();
        this.nodeCollapsed = new core_1.EventEmitter();
        this.nodeMoved = new core_1.EventEmitter();
        this.hasMainMenu = false;
    }
    TreeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.treeService.nodeRemoved$.subscribe(function (e) {
            _this.nodeRemoved.emit(e);
        });
        this.treeService.nodeRenamed$.subscribe(function (e) {
            _this.nodeRenamed.emit(e);
        });
        this.treeService.nodeCreated$.subscribe(function (e) {
            _this.nodeCreated.emit(e);
        });
        this.treeService.nodeSelected$.subscribe(function (e) {
            _this.nodeSelected.emit(e);
        });
        this.treeService.nodeExpanded$.subscribe(function (e) {
            _this.nodeExpanded.emit(e);
        });
        this.treeService.nodeCollapsed$.subscribe(function (e) {
            _this.nodeCollapsed.emit(e);
        });
        this.treeService.nodeMoved$.subscribe(function (e) {
            _this.nodeMoved.emit(e);
        });
        this.hasMainMenu = _.get(this.options, 'mainMenu', false);
        this.tree.options = _.get(this.tree, 'options', this.options);
        this.mainMenuOptions = _.defaults(_.get(this.tree, 'options.mainMenuOptions', undefined), _.get(this.options, 'mainMenuOptions', undefined));
    };
    TreeComponent.prototype.triggerSelection = function (e, node) {
        console.log(node.id);
        this.treeInternalComponent.onNodeSelected(e, node);
    };
    TreeComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'tree',
                    template: "\n  <menu *ngIf=\"hasMainMenu\" [menuOptions]=\"mainMenuOptions\" [rootNode]=\"tree\"></menu>\n  <tree-internal [tree]=\"tree\" [options]=\"options\"></tree-internal>\n  ",
                    providers: [tree_service_1.TreeService]
                },] },
    ];
    TreeComponent.ctorParameters = function () { return [
        { type: tree_service_1.TreeService, decorators: [{ type: core_1.Inject, args: [tree_service_1.TreeService,] },] },
    ]; };
    TreeComponent.propDecorators = {
        'tree': [{ type: core_1.Input },],
        'options': [{ type: core_1.Input },],
        'nodeCreated': [{ type: core_1.Output },],
        'nodeRemoved': [{ type: core_1.Output },],
        'nodeRenamed': [{ type: core_1.Output },],
        'nodeSelected': [{ type: core_1.Output },],
        'nodeExpanded': [{ type: core_1.Output },],
        'nodeCollapsed': [{ type: core_1.Output },],
        'nodeMoved': [{ type: core_1.Output },],
        'treeInternalComponent': [{ type: core_1.ViewChild, args: [TreeInternalComponent,] },],
    };
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=tree.component.js.map