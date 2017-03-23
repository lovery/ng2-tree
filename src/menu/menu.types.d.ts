export declare class MenuItemAction {
    static NewNode: MenuItemAction;
    static NewLeaf: MenuItemAction;
    static Rename: MenuItemAction;
    static Remove: MenuItemAction;
    name: string;
    action: any;
    constructor(name: string, action: any);
}
export declare enum MenuAction {
    Close = 0,
}
export interface MenuEvent {
    sender: HTMLElement;
    action: MenuAction;
}
export interface MenuItemSelectedEvent {
    nodeMenuItemAction: MenuItemAction;
}
