type TypeConstructor = (...args: any[]) => any;

/**
 * A cluster of objects created from a given constructor.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/utils/Cluster.js | Source}
 */
export class Cluster {
    typeConstructor: TypeConstructor;

    array: any[];
    index: number;

    constructor(typeConstructor: TypeConstructor, num: number);

    get length(): number;

    get(): any;

    empty(): void;

    push(...objects: any[]): void;

    shuffle(): void;

    override destroy(): null;
}
