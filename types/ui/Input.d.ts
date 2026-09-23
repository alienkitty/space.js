import { Interface } from '../utils/Interface.js';
import { InputField } from './InputField.js';
import { InputTotal } from './InputTotal.js';

export interface InputOptions {
    noTotal: boolean;
    placeholder: string;
    maxlength: string;
    noLine: boolean;
    forceFocus: boolean;
}

export interface InputData {
    placeholder?: string;
    maxlength?: string;
    noLine?: boolean;
    forceFocus?: boolean;
}

/**
 * Input field container.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Input.js | Source}
 */
export class Input extends Interface {
    private noTotal: boolean;
    private data: InputData;

    private isComplete: boolean;

    private input?: InputField;
    private total?: InputTotal;

    constructor(options?: Partial<InputOptions>);

    private init(): void;

    private initViews(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    private onTyping: (e: { value: string }) => void;

    private onComplete: () => void;

    setValue(value: string): void;

    focus(): void;

    blur(): void;

    animateIn(): Promise<void> | void;

    animateOut(): Promise<void> | void;

    override destroy(): null;
}
