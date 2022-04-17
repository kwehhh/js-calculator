import Spawn from '@unfocused/spawn';
import _ from '@unfocused/treasure-goblin';
import calcUtil from '../util/calcUtil';
import CONSTANT from '../util/constants';

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
    this.inputEl = Spawn({
      style: {
        whiteSpace: 'nowrap',
        float: 'right',
        fontSize: 20
      }
    });

    // Display Last Calculated Input Element
    this.prevInputEl = Spawn({
      style: {
        fontSize: 14,
        color: '#878889'
      }
    });

    this.el = this.render();

    this.renderBtns();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    // Re-enable when  DEMO IS ready....
    // this.calculateInput();
    this.updateInput(this.input);

    return this;
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
    const nestedInputs = calcUtil.getNestedInputs(str);

    // split into separate fn....
    // !! NESTING NEEDS TO BE PRESERVED!!! for render display
    const inputGroups = this.getFormattedInputGroups(nestedInputs).reduce((acc, item, i) => [...acc, item, ' '], []).slice(0, -1);
    let lastLevel = -1;
    const inputGroups2 = calcUtil.formatInputs(nestedInputs, (arr, prevArr = [], level) => {


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




      const res = [
        open,
        ...calcUtil.getInputGroups(arr),
        close,
        ...prevArr
      ];
      console.log('res', res, arr, prevArr, level, close);
      return res;
    });

    // new total is here
    const total = calcUtil.formatInputs(nestedInputs,  (arr, lastCompute = 0) => {
      const t = calcUtil.getInputGroups(arr);
      const j = t.map(res => {

        if (calcUtil.isOperator(res)) {
          return Spawn({
            children: res
          });
        } else {
          return Spawn({
            children: res
          });
        }
      });

      return calcUtil.getTotal(t) + lastCompute;
    });

    const res = {
      input: str,
      nestedInputs,
      inputGroups,
      inputGroups2,
      inputAsArray: inputGroups,
      total: _.toStr(total)
    };

    console.log('getCalculatedInput', {
      // nestedInputs,
      // inputAsArray,
      ...res
    });

    return res;
  }

  /**
   * Get button
   * @returns {array} of buttons for calculator
   */
  getButtons() {
    return INPUTS;
  }

  renderInput(displayEl, inputArray) {
    // Save reference of last used arithmatic
    displayEl.innerHTML = '';
    // if (input !== total) {
    if (true) {
      inputArray.forEach(item => {
          let el;
          let children = item;

          if (calcUtil.isOperator(children)) {
            // special format
            const filter = INPUTS.filter(z => z.value === children);
            if (filter.length && filter[0].label) {
              console.log('filter', filter, children);
              children = filter[0].label.toLowerCase();
            }

            el = Spawn({
              tag: 'span',
              children,
              style: {
                // color: 'red'\
                color: '#8B570D'
              }
            })
            //   children: children
            // });
          } else {
            el = Spawn(children);
            // return Spawn({
              // children: children
            // });
          }

          // return el;

          displayEl.appendChild(el);
      })
    }
  }

  getValidInputs(value) {

    const formattedValue =
    console.log('getValidInputs', value);
    const result = [...INPUTS, ...GLOBAL_INPUTS].map(o => `${o.value}`).indexOf(`${value}`) > -1;
    // debugger


    // Return value instead of T/F
    return result;
  }

  handleKeyDown = (e) => {
    const value = e.key;
    console.log('handleKeyDown', e);

    this.triggerInputEvent(value);
  }

  handleKeyUp = (e) => {
    const value = e.key;
    console.log('handleKeyUp', e);

    // this.triggerInputEvent(value);
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
          this.calculateInput();
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

  calculateInput() {
    // const { inputAsArray, inputGroups2, total } = this.getCalculatedInput();
    const { history, total } = calcUtil.computeInput(this.input);

    // Update reference of last used arithmatic
    this.renderInput(this.prevInputEl, history);
    // Update Input Result
    // change to renderInput ?
    this.updateInput(total, el => el.innerHTML = calcUtil.getFormattedDisplayValue(_.toStr(total), 3));
  }


  getFormattedInputGroups(nestedInputs) {
    return calcUtil.formatInputs(nestedInputs,  (arr, lastCompute = []) => {
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
    const nestedInputs = calcUtil.getNestedInputs(this.input);
    // !! NESTING NEEDS TO BE PRESERVED
    const inputGroups = this.getFormattedInputGroups(nestedInputs);
    const lastInputGroup = inputGroups[inputGroups.length-1];

    console.log('getFormattedInput', {
      value,
      formattedValue,
      lastInput,
      lastInputGroup,
      nestedInputs,
      inputGroups
    });

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
    // } else if (lastIsSameOp) {
      // result = this.input;
    } else if (lastIsOp) {
      result = this.input.slice(0, this.input.length-1) + formattedValue;
    } else {


      // filter decimals here......
      result = this.input + formattedValue;
    }

    // console.log('getFormattedInput', result, this.getCalculatedInput(result), this.input, value);
//
    return result;
  }

  // value => str|num
  appendInputValue(value) {
    const input = this.getFormattedInput(value);
    const { inputAsArray } = this.getCalculatedInput(input);
    this.updateInput(input, el => this.renderInput(el, inputAsArray));
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
    _.splitToChunks(this.getButtons(), 4).forEach((group, j) => {
      this.el.appendChild(Spawn({
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
              // borderRadius: 6,
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


          console.log('btnProps', btnProps);



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


          // console.log('renderBtns', el, elContainer, btn);
          // this.buttonEls[btn.value] = el;
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
      children: Spawn({
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