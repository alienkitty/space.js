import { Interface } from '../utils/Interface.js';

export interface InputTotalOptions {
    maxlength: string;
}

/**
 * Input total.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/InputTotal.js | Source}
 */
export class InputTotal extends Interface {
    private maxlength: string;

    private length: number;
    private animatedIn: boolean;

    private info?: Interface;

    constructor(options: Partial<InputTotalOptions>);

    private init(): void;

    setValue(value: string): void;

    animateIn(): void;

    animateOut(): void;
}
