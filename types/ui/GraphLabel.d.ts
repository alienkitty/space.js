import { Interface } from '../utils/Interface.js';

export interface GraphLabelOptions {
    name: string;
}

/**
 * Graph label.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/GraphLabel.js | Source}
 */
export class GraphLabel extends Interface {
    name: string;

    width: number;

    constructor(options: Partial<GraphLabelOptions>);

    init(): Promise<void>;
}
