import { TreeModelOptions } from './options.types';
export declare class FoldingType {
    private _cssClass;
    static Expanded: FoldingType;
    static Collapsed: FoldingType;
    static Leaf: FoldingType;
    private _nodeType;
    constructor(_cssClass: string);
    readonly cssClass: string;
    getCssClass(nodeOptions: TreeModelOptions): string;
}
export interface TreeApi {
    select: any;
    deselect: any;
    expand: any;
    collapse: any;
    service: any;
}
export interface TreeSystems {
    isSelected?: boolean;
    isExpanded?: boolean;
    isLeaf?: boolean;
    isRightMenuVisible?: boolean;
    isLeftMenuVisible?: boolean;
    foldingType?: FoldingType;
    status?: TreeStatus;
    indexInParent?: number;
}
export interface TreeModel {
    value: string | RenamableNode;
    children?: Array<TreeModel>;
    hasNodeChildren?: boolean;
    hasLeafChildren?: boolean;
    id?: string | number;
    api?: TreeApi;
    systems?: TreeSystems;
    parentId?: string | number;
    options?: TreeModelOptions;
}
export declare enum TreeStatus {
    New = 0,
    Modified = 1,
    EditInProgress = 2,
}
export interface RenamableNode {
    setName(name: string): void;
    toString(): string;
}
export interface NodeEvent {
    node: TreeModel;
}
export interface NodeSelectedEvent extends NodeEvent {
}
export interface NodeExpandedEvent extends NodeEvent {
}
export interface NodeCollapsedEvent extends NodeEvent {
}
export interface NodeDestructiveEvent extends NodeEvent {
    parent: TreeModel;
}
export interface NodeMovedEvent extends NodeDestructiveEvent {
}
export interface NodeRemovedEvent extends NodeDestructiveEvent {
}
export interface NodeCreatedEvent extends NodeDestructiveEvent {
}
export interface NodeRenamedEvent extends NodeDestructiveEvent {
    newValue: string | RenamableNode;
    oldValue: string | RenamableNode;
}
export interface NodeCustomEvent extends NodeDestructiveEvent {
}
