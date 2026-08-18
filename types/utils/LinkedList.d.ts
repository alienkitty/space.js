export interface LinkedListNode {
    object: any,
    prev: LinkedListNode | null,
    next: LinkedListNode | null
}

/**
 * A linked list of objects.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/LinkedList.js | Source}
 */
export class LinkedList {
    nodes: LinkedListNode[];
    first: LinkedListNode | null;
    last: LinkedListNode | null;
    current: LinkedListNode | null;

    constructor();

    get length(): number;

    push(object: any): void;

    remove(object: any): void;

    empty(): void;

    start(): any;

    next(): any;

    find(callback: (object: any, index?: number, objects?: any[]) => boolean): any | undefined;

    destroy(): null;
}
