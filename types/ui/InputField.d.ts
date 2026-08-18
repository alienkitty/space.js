import { Interface } from '../utils/Interface.js';

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
    private placeholder: string;
    private maxlength: string;
    private noLine: boolean;
    private forceFocus: boolean;

    private lastValue: string;
    private isFocused: boolean;

    private input?: Interface;
    private line?: Interface;

    constructor(options: Partial<InputFieldOptions>);

    private init(): void;

    private setAttributes(): void;

    private addListeners(): void;

    private removeListeners(): void;

    private onFocus: () => void;

    private onBlur: () => void;

    private onKeyDown: (e: KeyboardEvent) => void;

    private onKeyUp: (e: KeyboardEvent) => void;

    private onHover: (e: MouseEvent) => void;

    private onClick: (e: MouseEvent) => void;

    private onForceFocus: () => void;

    setValue(value: string): void;

    focus(): void;

    blur(): void;

    override destroy(): null;
}
