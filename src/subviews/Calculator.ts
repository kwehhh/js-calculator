import Spawn from '@unfocused/spawn';
import _ from '@unfocused/treasure-goblin';
import calcUtil from '../util/calcUtil';
import CONSTANT from '../util/constants';

export interface CalculatorProps {
  className: string;
  input: string;
  style: any;
  theme: any;
}

// CONSTANTS
const {
  BUTTONS,
  COLOR_PALETTE,
  DEFAULT_VALUE
} = CONSTANT;

// Actions
const ACTION = {
  CLEAR: 'clear',
  UNDO: 'undo',
  COMPUTE: '=',
  // @deprecated
  EQUALS: '='
};

const GLOBAL_INPUTS = [
  // Remove last character
  {
    value: 'Backspace'
  },
  // Compute current input
  {
    value: 'Enter'
  }
];

/**
 * Calculator App Component
 * Accepts onKey or Click Events
 * @returns {number} of current value
 */
class Calculator {
  buttons: any;
  el: HTMLElement | null;
  input: string;
  inputEl: HTMLElement;
  historyEl: HTMLElement;
  props: CalculatorProps;
  theme: any;

  constructor(props = {}) {
    this.props = {
      className: '',
      input: DEFAULT_VALUE,
      style: {},
      theme: {},
      ...props
    }

    this.buttons = {};
    this.input = this.props.input;
    this.theme = this.getTheme(this.props.theme);
    this.mountElements();
    this.calculate(this.input);
    this.addEventListeners();

    return this;
  }

  /**
   * Add event listeners
   */
  addEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Destroy Calculator Instance
   */
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.el = null;
  }

  /**
   * Get Valid Inputs
   * @param {object} value - object to validate
   * @returns {boolean} of value
   */
  getValidInputs(value: string | number): boolean {
    const result = [...BUTTONS, ...GLOBAL_INPUTS].map((o: Record<any, any>) => `${o.value}`).includes(`${value}`);
    return result;
  }

  /**
   * Get Theme
   * @param {string} theme - to get
   * @returns {object} of theme
   */
  getTheme(theme: Record<any, any>): Record<any, any> {
    return {
      background: COLOR_PALETTE.GRAY_10,
      // Default Button
      button: COLOR_PALETTE.GRAY_20,
      buttonHover: COLOR_PALETTE.GRAY_30,
      buttonPress: COLOR_PALETTE.GRAY_40,
      buttonAction: COLOR_PALETTE.WHITE_00,
      // Operator Button
      buttonOp: COLOR_PALETTE.YELLOW_10,
      buttonOpHover: COLOR_PALETTE.YELLOW_20,
      buttonOpPress: COLOR_PALETTE.YELLOW_30,
      // Clear Button
      buttonClr: COLOR_PALETTE.RED_80,
      buttonClrHover: COLOR_PALETTE.RED_70,
      buttonClrPress: COLOR_PALETTE.RED_60,
      buttonClrFont: COLOR_PALETTE.RED_10,
      // Compute Button
      buttonComp: COLOR_PALETTE.GREEN_10,
      buttonCompHover: COLOR_PALETTE.GREEN_20,
      buttonCompPress: COLOR_PALETTE.GREEN_30,
      color: COLOR_PALETTE.WHITE_00,
      displayColor: COLOR_PALETTE.WHITE_00,
      ...theme
    };
  }

  /**
   * Handle for Key Down
   * @param {Event} e - keyboard event
   */
  handleKeyDown = (e: KeyboardEvent): void => {
    const value = e.key;
    this.triggerInputEvent(value);
  }

  /**
   * Handle for Key Up
   * @param {Event} e - keyboard event
   */
  handleKeyUp = (e: KeyboardEvent): void => {
    const value = e.key;
    const validatedInput = this.getValidInputs(value);

    if (validatedInput) {
      const btn = this.buttons[value];
      btn.el.style.background = btn.theme.background;
    }
  }

  /**
   * Handle Button Click
   * @param {string} value - value of handler
   */
  handleBtnOnClick(value: string): void {
    this.triggerInputEvent(value);
  }

  /**
   * Trigger input event
   * @parma {string} value - value to send
   */
  triggerInputEvent(value: string): void {
    const validatedInput = this.getValidInputs(value);

    if (validatedInput) {
      const btn = this.buttons[value];
      btn.el.style.background = btn.theme.hover;

      switch (value) {
        case 'Backspace':
          this.removeLastInputValue();
          break;
        case 'clear':
          this.resetInput();
          break;
        // Calculate Input
        case '=':
        case 'Enter':
          this.calculate(this.input);
          break;
        // Add Value to Input
        default:
          this.setInputValue(value);
      }
    }
  }

  /**
   * Reset Input
   */
  resetInput(): void {
    this.updateInput(DEFAULT_VALUE);
  }

  /**
   * Calculate current input
   * Updates history and input containers
   * @param {string} inputStr - input string to calculate
   */
  calculate(inputStr: string): void {
    // Update history
    this.renderInputDisplay(
      this.historyEl,
      calcUtil.getInputGroups(calcUtil.getInputTreeArray(inputStr))
    );

    // Update Input Entry
    const total = calcUtil.calculateTotal(inputStr);
    this.updateInput(
      total,
      el => { el.innerHTML = calcUtil.formatToDisplayValue(_.toStr(total)) }
    );
  }

  /**
   * Get Input as Display Format
   * @param {string} inputStr - input string
   * @returns {array} of inputs
   */
  getInputForDisplay(inputStr: string): string[] {
    const inputTree = calcUtil.getInputTreeArray(inputStr);
    const formattedTree = calcUtil.formatTree(inputTree);
    return formattedTree.map(item => {
      // Strip leading 0's per input group
      if (calcUtil.isNumeric(item)) {
        return `${Number(item)}`;
      }

      return item;
    });
  }

  /**
   * Formats current input with value
   * @param {string|number} value
   * @returns {string} of formatted input
   */
  getFormattedInput(value: string | number): string {
    const formattedValue = `${value}`;
    const lastInput = this.input.slice(-1);
    const nestedInputs = calcUtil.getInputTreeArray(this.input);
    const inputGroups = calcUtil.formatTree(nestedInputs);
    const lastInputGroup = inputGroups[inputGroups.length - 1];

    // Do not allow more than one decimal per input group
    if (value === '.' && lastInputGroup.includes('.')) {
      return this.input;
    }

    // then check last group contains decimal.... then return input without value
    const isLastInputOp = calcUtil.isOperator(lastInput);

    // If fresh instance, replace the default DEFAULT_VALUE and setting a new num...
    const isLastInputDefault = !calcUtil.isOperator(value) && this.input === DEFAULT_VALUE;
    // Handle Operator
    // update if previous input and new value are both not operator
    const lastIsOp = calcUtil.isOperator(formattedValue) && isLastInputOp;

    let result;
    if (isLastInputDefault) {
      result = formattedValue;
    } else if (lastIsOp) {
      result = this.input.slice(0, this.input.length - 1) + formattedValue;
    } else {
      // filter decimals here......
      result = this.input + formattedValue;
    }

    return result;
  }

  /**
   * Set Input Value
   * @param {string|number} - input value
   */
  setInputValue(value: string | number): void {
    const input = this.input + `${value}`;
    const formattedInput = this.getInputForDisplay(input);
    this.updateInput(input, el => this.renderInputDisplay(el, formattedInput));
  }

  /**
   * Remove Last Input Value
   */
  removeLastInputValue(): void {
    let newVal = this.input.slice(0, -1);
    newVal = newVal || DEFAULT_VALUE;
    this.updateInput(newVal);
  }

  /**
   * Update Input and render new display
   * @param {string} input - to set input as
   * @param {function} renderer - how to render input on the display
   */
  updateInput(input: string, renderer?: (el: Element, input: string) => void): void {
    this.input = input;

    // Update Display
    if (renderer) {
      renderer(this.inputEl, input);
    } else {
      this.inputEl.innerHTML = input;
    }
  }

  /**
   * Mount Element Instances
   */
  mountElements(): void {
    // Display Input Element
    this.inputEl = this.renderInputEntry();

    // Display Last Calculated Input Element
    this.historyEl = this.renderHistoryEntry();

    // Main El container
    this.el = this.render();
  }

  /**
   * Render Buttons on Calculator
   * @returns {array} of HTMLElements
   */
  renderBtns(): any[] {
    const ITEMS_PER_ROW = 4;
    const btnEls = [] as any[];

    _.splitToChunks(BUTTONS, ITEMS_PER_ROW).forEach((group: any[], j: number) => {
      btnEls.push(Spawn({
        children: group.map((btn: Record<any, any>) => {
          const { label, name, value, ...restProps } = btn;

          const spacer = 10;
          let width = 40;
          if (value === 0) {
            width = (40 * 2) + (spacer * 2);
          }

          let height = 40;
          if (j === 0) {
            height = 30;
          }

          let color: string;
          let background: string;
          let hover: string;
          let pressed: string;
          let type: string;
          // Operator Input
          if (calcUtil.isOperator(value)) {
            type = 'operator';
            background = this.theme.buttonOp;
            hover = this.theme.buttonOpHover;
            pressed = this.theme.buttonOpPress;
            color = this.theme.buttonAction;
          } else if (value === 'clear') {
            type = 'clear';
            background = this.theme.buttonClr;
            hover = this.theme.buttonClrHover;
            pressed = this.theme.buttonClrPress;
            color = '#f51515';
          } else if (value === ACTION.EQUALS) {
            type = 'compute';
            background = this.theme.buttonComp;
            hover = this.theme.buttonCompHover;
            pressed = this.theme.buttonCompPress;
            color = this.theme.buttonAction;
          // Assign Style Events
          } else {
            type = 'default';
            color = this.theme.color;
            background = this.theme.button;
            hover = this.theme.buttonHover;
            pressed = this.theme.buttonPress;
          }

          // Attach event handlers
          const events = {
            click: () => this.handleBtnOnClick(value),
            mouseenter: (_e: Event, el: HTMLElement) => { el.style.background = hover },
            mousedown: (_e: Event, el: HTMLElement) => { el.style.background = pressed },
            keydown: (_e: Event, el: HTMLElement) => { el.style.background = pressed },
            keyup: (_e: Event, el: HTMLElement) => { el.style.background = background },
            mouseup: (_e: Event, el: HTMLElement) => { el.style.background = hover },
            mouseleave: (_e: Event, el: HTMLElement) => { el.style.background = background }
          };

          const btnProps = {
            ...restProps,
            children: label || name || value,
            events,
            style: {
              background,
              borderRadius: 10,
              borderStyle: 'none',
              color,
              width,
              height,
              cursor: 'pointer',
              fontFamily: "'Roboto', sans-serif",
              // disable IOS dobule tap
              touchAction: 'manipulation'
            },
            tag: 'button'
          };

          // Button
          const el = Spawn(btnProps);

          // Button Container
          const elContainer = Spawn({
            style: {
              display: 'inline-block',
              padding: spacer
            },
            children: [
              // Button
              el
            ]
          });

          this.buttons[btn.value] = {
            el,
            type,
            theme: {
              color,
              background,
              hover,
              pressed
            },
            ...btn
          };

          return elContainer;
        })
      }));
    });

    return btnEls;
  }

  /**
   * Render Input as Pretty Display
   * @param {Element} displayEl - el to render the display
   * @param {array} inputArray - array to use to render display
   */
  renderInputDisplay(displayEl: Element, inputArray: any[]): void {
    // Save reference of last used arithmatic
    displayEl.innerHTML = '';
    inputArray.forEach((item: string) => {
      let el;
      let children = item;

      // Render Operator
      if (calcUtil.isOperator(children)) {
        // special format
        const filter = BUTTONS.filter((button: Record<any, any>) => button.value === children);
        if (filter.length && filter[0].label) {
          children = filter[0].label.toLowerCase();
        }

        el = Spawn({
          tag: 'span',
          children: ` ${children} `,
          style: {
            color: '#8B570D'
          }
        })
      } else {
        el = Spawn(children);
      }

      displayEl.appendChild(el);
    })
  }

  /**
   * Render History
   * @returns {HTMLElement} of history
   */
  renderHistoryEntry(): HTMLElement {
    return Spawn({
      style: {
        fontSize: 14,
        color: '#878889'
      }
    });
  }

  /**
   * Render Input Entry
   * @returns {HTMLElement} of input entry
   */
  renderInputEntry(): HTMLElement {
    const { input } = this.props;

    return Spawn({
      children: input,
      style: {
        whiteSpace: 'nowrap',
        float: 'right',
        fontSize: 20
      }
    });
  }

  render(): HTMLElement {
    const { className, style } = this.props;
    // Text Input Style
    const txtStyle = {
      textAlign: 'right',
      overflow: 'hidden'
    };

    return Spawn({
      className: [className, 'js-calculator'].join(' '),
      children: [
        Spawn({
          children: [
            Spawn({
              children: this.historyEl,
              style: {
                color: this.theme.displayColor,
                // fixed height so does not shify
                height: 20,
                ...txtStyle
              }
            }),
            Spawn({
              children: this.inputEl,
              style: {
                color: this.theme.displayColor,
                height: 100,
                ...txtStyle
              }
            })
          ],
          style: {
            padding: 10
          }
        }),
        ...this.renderBtns()
      ],
      style: {
        background: this.theme.background,
        borderRadius: 20,
        display: 'inline-block',
        padding: 10,
        width: 260,
        boxSizing: 'border-box',
        ...style
      }
    });
  }
}

export default Calculator;
