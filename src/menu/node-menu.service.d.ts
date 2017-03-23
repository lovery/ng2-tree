import { Subject } from 'rxjs/Rx';
import { MenuEvent } from './menu.types';
export declare class NodeMenuService {
    nodeMenuEvents$: Subject<MenuEvent>;
}
