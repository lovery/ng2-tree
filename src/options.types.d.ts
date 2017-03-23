import { MenuItemAction } from './menu/menu.types';
import { TreeModel } from './tree.types';
export interface CssClasses {
    nodeIcon?: string;
    leafIcon?: string;
    nodeCollapsed?: string;
    nodeExpanded?: string;
    nodeLeaf?: string;
    leftMenu?: string;
}
export declare class MenuItem {
    name?: string;
    actionName?: string;
    actionFunction?: any;
    action?: MenuItemAction;
    cssClass?: string;
    static proccessItems(menuItems: Array<MenuItem>): Array<MenuItem>;
}
export declare class MenuOptions {
    options?: Array<MenuItem>;
    style?: any;
    constructor(base: any);
    static getMainMenuItems(menuOptions: MenuOptions, tree: TreeModel): Array<MenuItem>;
    static getNodeMenuItems(menuOptions: MenuOptions, tree: TreeModel): Array<MenuItem>;
    readonly menuClass: string;
}
export declare class Options {
    cssClasses?: CssClasses;
    rightMenu?: boolean;
    rightMenuOptions?: MenuOptions;
    leftMenu?: boolean;
    leftMenuOptions?: MenuOptions;
    expanded?: boolean;
}
export declare class TreeOptions extends Options {
    mainMenu?: boolean;
    mainMenuOptions?: MenuOptions;
    selectEvent: boolean;
    editOnDouleClick: boolean;
    expandEmptyNode?: boolean;
    lazyLoading?: boolean;
}
export declare class TreeModelOptions extends Options {
    static?: boolean;
    drag?: boolean;
    selected?: boolean;
    applyToSubtree?: boolean;
    static convert(base: TreeOptions): TreeModelOptions;
    static merge(sourceA: TreeModel, sourceB: TreeModel): TreeModelOptions;
    static getOptions(sourceA: TreeModel, sourceB: TreeModel, treeOptions: TreeOptions): TreeModelOptions;
}
