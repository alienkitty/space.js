import { Interface } from '../utils/Interface.js';
import { InputField } from './InputField.js';
import { InputTotal } from './InputTotal.js';

export interface InputUpdateEvent {
    value: string;
    target: Input;
}

export interface InputCompleteEvent {
    target: Input;
}

export interface InputOptions {
    noTotal: boolean;
}

export interface InputData {
    placeholder: string;
    maxlength: string;
    noLine: boolean;
    forceFocus: boolean;
}

/**
 * Input field container.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/Input.js | Source}
 */
export class Input extends Interface {
    noTotal: boolean;
    data: Partial<InputData>;

    isComplete: boolean;

    input?: InputField;
    total?: InputTotal;

    constructor(options?: Partial<InputOptions & InputData>);

    init(): void;

    initViews(): void;

    addListeners(): void;

    removeListeners(): void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    onTyping: (e: { value: string }) => void;

    onComplete: () => void;

    setValue(value: string): void;

    focus(): void;

    blur(): void;

    animateIn(): Promise<void> | void;

    animateOut(): Promise<void> | void;

    override destroy(): null;
}
