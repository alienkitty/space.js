type TypeConstructor = (...args: any[]) => any;

/**
 * A pool of objects created from a given constructor.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/ObjectPool.js | Source}
 */
export class ObjectPool {
    typeConstructor: TypeConstructor;

    array: any[];

    constructor(typeConstructor: TypeConstructor, num: number);

    get length(): number;

    get(): any;

    empty(): void;

    put(...objects: any[]): void;

    shuffle(): void;

    destroy(): null;
}
