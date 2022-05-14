// @ts-ignore
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

const { COLOR_PALETTE } = CONSTANT;

const DEFAULT_VALUE = '0';

// Actions
const ACTION = {
  CLEAR: 'clear',
  UNDO: 'undo',
  COMPUTE: '=',
  // remove this one....
  EQUALS: '='
};

// Calculator Inputs
const INPUTS = [
  // Euler
  {
    value: 'e'
  },
  // Pie
  {
    label: 'π',
    value: 'p'
  },
  {
    name: 'sin',
    value: null
  },
  {
    name: 'deg',
    value: null
  },
  {
    label: 'C',
    value: 'clear'
  },
  {
    value: '('
  },
  {
    value: ')'
  },
  {
    // label: '÷',
    value: '/'
  },
  {
    value: 7
  },
  {
    value: 8
  },
  {
    value: 9
  },
  {
    label: 'X',
    value: '*'
  },
  {
    value: 4
  },
  {
    value: 5
  },
  {
    value: 6
  },
  {
    value: '-'
  },
  {
    value: 1
  },
  {
    value: 2
  },
  {
    value: 3
  },
  {
    value: '+'
  },
  {
    value: 0
  },
  {
    value: '.'
  },
  {
    value: ACTION.EQUALS
  }
];

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
  el: HTMLElement;
  input: string;
  inputEl: HTMLElement;
  prevInputEl: HTMLElement;
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

    // Display Input Element
    this.inputEl = this.renderInputEntry();

    // Display Last Calculated Input Element
    this.prevInputEl = this.renderHistoryEntry();

    this.el = this.render();

    // ... call from history prop....
    this.calculateInput(this.input);
    this.addEventListeners();

    return this;
  }


  /**
   * Add event listeners
   */
  addEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  getTheme(theme) {
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
   * Destroy Calculator Instance
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.el = null;
  }

  // @returns {string}
  getCalculatedInput(str = this.input) {
    // need a depth count to get how many ending parens.....!!! TODO NEXT
    const nestedInputs = calcUtil.getInputTreeArray(str);

    // split into separate fn....
    // !! NESTING NEEDS TO BE PRESERVED!!! for render display
    const inputGroups = this.getFormattedInputGroups(nestedInputs).reduce((acc, item, i) => [...acc, item, ' '], []).slice(0, -1);
    let lastLevel = -1;
    const inputGroups2 = calcUtil.getFormattedInputTree(nestedInputs, (arr, prevArr = [], level) => {
      // try to manage position.....
      if (lastLevel < 0) {
        lastLevel = level;
      } else {
        lastLevel = 0;
      }

      // Auto close parenthesisisisisiis
      let open = '(';
      if (level === 1) {
        open = '';
      }
      let close = '';
      for (let i = 0; i < lastLevel; i++) {
        close += ')';
      }

      return [
        open,
        ...calcUtil.getInputGroups(arr),
        close,
        ...prevArr
      ];
    });

    // new total is here
    const total = calcUtil.getFormattedInputTree(nestedInputs,  (arr, lastCompute = 0) => {
      const t = calcUtil.getInputGroups(arr);
      return calcUtil.getTotal(t) + lastCompute;
    });

    return {
      input: str,
      nestedInputs,
      inputGroups,
      inputGroups2,
      inputAsArray: inputGroups,
      total: _.toStr(total)
    };
  }

  /**
   * Get button
   * @returns {array} of buttons for calculator
   */
  getButtons() {
    return INPUTS;
  }

  /**
   * Render Input Display
   * @param {HTMLElement} displayEl - el to render the display
   * @param {array} inputArray - array to use to render display
   */
  renderInputDisplay(displayEl, inputArray) {
    // Save reference of last used arithmatic
    displayEl.innerHTML = '';
    inputArray.forEach(item => {
      let el;
      let children = item;

      // Render Operator
      if (calcUtil.isOperator(children)) {
        // special format
        const filter = INPUTS.filter(z => z.value === children);
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

  getValidInputs(value) {
    const result = [...INPUTS, ...GLOBAL_INPUTS].map(o => `${o.value}`).indexOf(`${value}`) > -1;
    // Return value instead of T/F
    return result;
  }

  handleKeyDown = (e) => {
    const value = e.key;
    this.triggerInputEvent(value);
  }

  handleKeyUp = (e) => {
    const value = e.key;
    const validatedInput = this.getValidInputs(value);

    if (validatedInput) {
      const btn = this.buttons[value];
      btn.el.style.background = btn.theme.background;
    }
  }

  handleBtnOnClick(value) {
    this.triggerInputEvent(value);
  }

  /**
   * Trigger input event
   * @parma {string} value - value to send
   */
  triggerInputEvent(value) {
    const validatedInput = this.getValidInputs(value);

    if (validatedInput) {
      const btn = this.buttons[value];
      btn.el.style.background = btn.theme.hover;

      switch(value) {
        case 'Backspace':
          this.removeLastInputValue();
          break;
        case 'clear':
        this.resetInput();
          break;
        // Calculate Input
        case '=':
        case 'Enter':
          this.calculateInput(this.input);
          break;
        // Add Value to Input
        default:
          this.appendInputValue(value);
      }
    }
  }

  /**
   * Reset Input
   */
  resetInput() {
    this.updateInput(DEFAULT_VALUE);
  }

  /**
   * Calculate input
   * Updates history and input containers
   * @param {string} inputStr - input string to calculate
   */
  calculateInput(inputStr) {
    // Update history
    this.renderInputDisplay(
      this.prevInputEl,
      calcUtil.getInputGroups(calcUtil.getInputTreeArray(inputStr))
    );

    // Update Input Entry
    const total = calcUtil.calculateTotal(inputStr);
    this.updateInput(
      total,
      el => el.innerHTML = calcUtil.formatToDisplayValue(_.toStr(total), 3)
    );
  }

  getFormattedInputGroups(nestedInputs) {
    return calcUtil.getFormattedInputTree(nestedInputs,  (arr, lastCompute = []) => {
      return [...calcUtil.getInputGroups(arr), ...lastCompute];
    });
  }

  /**
   * Formats current input with value
   * @param {string|number} value
   * @returns {string} of formatted input
   */
  getFormattedInput(value) {
    let formattedValue = `${value}`;
    const lastInput = this.input.slice(-1);
    const nestedInputs = calcUtil.getInputTreeArray(this.input);
    // !! NESTING NEEDS TO BE PRESERVED
    const inputGroups = this.getFormattedInputGroups(nestedInputs);
    const lastInputGroup = inputGroups[inputGroups.length-1];

    // Do not allow more than one decimal per input group
    if (value === '.' && lastInputGroup.indexOf('.') > -1) {
      return this.input;
    }

    // then check last group contains decimal.... then return input without value
    const isLastInputOp = calcUtil.isOperator(lastInput);

    // If fresh instance, replace the default DEFAULT_VALUE and setting a new num...
    const isLastInputDefault = !calcUtil.isOperator(value) && this.input === DEFAULT_VALUE;
    // Handle Operator
    // update if previous input and new value are both not operator
    // const lastIsSameOp = calcUtil.isOperator(formattedValue) && (formattedValue === lastInput);
    const lastIsOp = calcUtil.isOperator(formattedValue) && isLastInputOp;

    let result;
    if (isLastInputDefault) {
      result = formattedValue;
    } else if (lastIsOp) {
      result = this.input.slice(0, this.input.length-1) + formattedValue;
    } else {

      // filter decimals here......
      result = this.input + formattedValue;
    }

    return result;
  }

  // value => str|num
  appendInputValue(value) {
    const input = this.getFormattedInput(value);
    const { inputAsArray } = this.getCalculatedInput(input);
    this.updateInput(input, el => this.renderInputDisplay(el, inputAsArray));
  }

  removeLastInputValue() {
    let newVal = this.input.slice(0, -1);
    newVal = newVal || DEFAULT_VALUE;

    this.updateInput(newVal);
  }

  /**
   * Update Input and render new display
   * @param {string} input - to set input as
   * @param {function} renderer - how to render input on the display
   * ....
   */
  updateInput(input, renderer) {
    this.input = input;

    // Update Display
    if (renderer) {
     renderer(this.inputEl, input);
    } else {
      this.inputEl.innerHTML = input;
    }
  }

  /**
   * Render Buttons on Calculator
   */
   renderBtns() {
     const btnEls = [];
    _.splitToChunks(this.getButtons(), 4).forEach((group, j) => {
      btnEls.push(Spawn({
        children: group.map((btn, i) => {
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

          let color;
          let background;
          let hover;
          let pressed;
          let type;
          // Operator Input
          if (calcUtil.isOperator(value)) {
            type = 'operator';
            background = this.theme.buttonOp;
            hover = this.theme.buttonOpHover;
            pressed = this.theme.buttonOpPress;
            color = this.theme.buttonAction;
          } else if (value === 'clear') {
            type = 'clear';
            // background = '#3b0202';
            background = this.theme.buttonClr;
            hover = this.theme.buttonClrHover;
            pressed = this.theme.buttonClrPress;
            color = '#f51515';
          } else if (value === ACTION.EQUALS) {
            type = 'compute';
            // background = '#5bce09';
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
            mouseenter: (e, el) => el.style.background = hover,
            mousedown: (e, el) => el.style.background = pressed,
            keydown: (e, el) => el.style.background = pressed,
            keyup: (e, el) => el.style.background = background,
            mouseup: (e, el) => el.style.background = hover,
            mouseleave: (e, el) => el.style.background = background
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
              fontFamily: `'Roboto', sans-serif`,
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

  renderHistoryEntry() {
    return Spawn({
      style: {
        fontSize: 14,
        color: '#878889'
      }
    });
  }

  renderInputEntry() {
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

  render() {
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
              children: this.prevInputEl,
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
