import { NodeRemovedEvent, NodeRenamedEvent, NodeCreatedEvent, NodeSelectedEvent, NodeMovedEvent, NodeExpandedEvent, NodeCollapsedEvent } from './tree.types';
import { Subject } from 'rxjs/Rx';
export declare class TreeService {
    nodeMoved$: Subject<NodeMovedEvent>;
    nodeRemoved$: Subject<NodeRemovedEvent>;
    nodeRenamed$: Subject<NodeRenamedEvent>;
    nodeCreated$: Subject<NodeCreatedEvent>;
    nodeSelected$: Subject<NodeSelectedEvent>;
    nodeExpanded$: Subject<NodeExpandedEvent>;
    nodeCollapsed$: Subject<NodeCollapsedEvent>;
}
