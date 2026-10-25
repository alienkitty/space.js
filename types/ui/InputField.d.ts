import { Interface } from '../utils/Interface.js';

export interface InputFieldTypingEvent {
    text: string;
}

export interface InputFieldOptions {
    placeholder: string;
    maxlength: string;
    noLine: boolean;
    forceFocus: boolean;
}

/**
 * Input field.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/ui/InputField.js | Source}
 */
export class InputField extends Interface {
    placeholder: string;
    maxlength: string;
    noLine: boolean;
    forceFocus: boolean;

    lastValue: string;
    isFocused: boolean;

    input?: Interface;
    line?: Interface;

    constructor(options: Partial<InputFieldOptions>);

    init(): void;

    setAttributes(): void;

    addListeners(): void;

    removeListeners(): void;

    onFocus: () => void;

    onBlur: () => void;

    onKeyDown: (e: KeyboardEvent) => void;

    onKeyUp: (e: KeyboardEvent) => void;

    onHover: (e: MouseEvent) => void;

    onClick: (e: MouseEvent) => void;

    onForceFocus: () => void;

    setValue(value: string): void;

    focus(): void;

    blur(): void;

    override destroy(): null;
}
