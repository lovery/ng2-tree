import { EventEmitter, Renderer, OnDestroy, OnInit } from '@angular/core';
import { NodeMenuService } from './node-menu.service';
import { MenuItemSelectedEvent } from './menu.types';
import { MenuOptions, MenuItem } from '../options.types';
import { TreeModel } from '../tree.types';
export declare class NodeMenuComponent implements OnInit, OnDestroy {
    private renderer;
    private nodeMenuService;
    menuOptions: MenuOptions;
    type: string;
    node: TreeModel;
    menuItemSelected: EventEmitter<MenuItemSelectedEvent>;
    availableMenuItems: Array<MenuItem>;
    private disposersForGlobalListeners;
    constructor(renderer: Renderer, nodeMenuService: NodeMenuService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    setEventListeners(): void;
    private onMenuItemSelected(e, selectedMenuItem);
    private closeMenu(e);
}
