import { EventEmitter, ElementRef, Renderer, OnDestroy, OnInit } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuItemSelectedEvent } from './menu.types';
import { MenuOptions, MenuItem } from '../options.types';
import { TreeModel } from '../tree.types';
export declare class MenuComponent implements OnInit, OnDestroy {
    private renderer;
    private menuService;
    menuOptions: MenuOptions;
    rootNode: TreeModel;
    menuItemSelected: EventEmitter<MenuItemSelectedEvent>;
    menuContent: ElementRef;
    button: ElementRef;
    buttonIcon: ElementRef;
    availableMenuItems: Array<MenuItem>;
    private disposersForListeners;
    private disposersForGlobalListeners;
    private isMenuVisible;
    constructor(renderer: Renderer, menuService: MenuService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private onMenuItemSelected(e, selectedMenuItem);
    private fireCloseMenu(e);
    private closeMenu(e);
    private showMenu(e);
}
