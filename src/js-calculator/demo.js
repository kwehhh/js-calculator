/**
 * JS (JavaScript) Calculator @ v1.0.0
 *
 * Objectives/Constraints:
 *  - Easy Import and Customize into any App
 *  - Single JS file for entire setup (for CodePen.io demo use)
 *  - No External Libraries
 *  - No HTML tags or CSS selectors were harmed in the making of this exercise.
 *  - Theme Token Support
 *  - Desktop version only - if you want mobile I may add support
 *
 * Functionality:
 *  - Math calculator with nested level computation
 *
 * I/O:
 *  - Click buttons calculate
 *  - Press keyboard keys to calculate
 *    - Enter/Equals to computer / Backspace to remove last character
 *
 * References:
 *  UI Design {author} : https://dribbble.com/shots/6144137-Calculator-App-iOS-13
 *  CodePen: https://codepen.io/anthonykoch/pen/xVQOwb?editors=0010
 *   adsd : https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/
 *
 * https://codepen.io/giana/pen/GJMBEv (the animation is cool)
 * https://codepen.io/mjijackson/pen/xOzyGX (has cool scale technique when too many value)
 *
 *
 * want to see the src github? and the hisotical progression? go here url: .......
 *
 *  Comments/questions/requests? Feel free to reach out to me!
 *
 *
 * TODO:
 *  GROUPING
 *    - PRESERVE GROUPING of () when calculating result.....
 *    - CONTROL DEPTH LEVEL of IN AND OUT DIFFRENT GROYP LEVELS .. .NEED TESTS....
 *  DECIMAL HANDLING
 *    [done] Do not allow more than 1 decimal per number group
 * STYLE:
 * INPUT -- Operational colors should be white
 * on change theme, spin and shrink, then grow to normal size with new values.. (use the gear spin animation)
 * boost operator color diffs by 2x for hover, pressed
 * [done] don't show commas when adding input... and dont do for decimals..
 * [done] Update / Icon for divider
 * Add formatted to input and prev input -- addds commas, styles colors, adds spaces
 * = with no compute will just send to other value -- add animation like google calc example
 * C - To Clear all INPUT
 * Finish KEYBOARD redirect .. ENTER => EQUALS, EQUALS => EQUALS
 * CHange div symbol to /
 * Fix border radius on buttons and calculator
 * Get proper type face
 * Consider idea of making each button its own Class component -- potetnially reduce code/bloat/organization
 * [done] Get color states for op, equals, computer, clr (by 7% probably)
 * Finish Hover/Press colors on each key. ++ Update style based on the global events
 * [done] Make operator text color white
 * make current input color big
 * make input with colored operators (may already be done...);
 * - Style the input to make it pretty....
 * - add shadow ')' like google calc
 * Add operatiosn for e, pie sin, and deg
 */


// TODO
// key listener
// colors on operators
// add instructions on top of calc demo
// mybe some cool animatiosn
// more border radius on buttons

// KEEP this but comment it out.... for release
const tests = [
  // DEMO
  '45+(1250*100)/10',
  // Depth 1
  '0+(12+(2+(3+(1+7', // 0+(12+(2+(3+(1+7))))
  // Depth 2
  '( 1 + (5 + 2)) + ( 1 - ( 5 - 1) )',
  '435345.11232152151',
  '5/4-3+1',
  '45.999....+......'
];


const DEFAULT_VALUE = '0';

// Color Palette
const COLOR_PALETTE = {
  WHITE_00: '#ffffff',
  GRAY_00: '#141414',
  GRAY_10: '#17181A',
  GRAY_20: '#222427',
  GRAY_30: '#2f3237', // + 6% Lightness
  GRAY_40: '#3e4147', // + 6% Lightness
  GRAY_80: '#88898A',
  BLACK_00: '#000000',
  GREEN_10: '#2EC973',
  GREEN_20: '#40d482', // + 6% Lightness
  GREEN_30: '#59d993', // + 6% Lightness
  YELLOW_10: '#FF9500',
  YELLOW_20: '#ffa21f', // + 6% Lightness
  YELLOW_30: '#ffae3d', // + 6% Lightness
  YELLOW_80: '#8B570D',
  RED_10: '#F6444E',
  RED_60: '#562f39', // - 6% Lightness
  RED_70: '#42242c', // - 6% Lightness
  RED_80: '#2D191E'
};

// Arithmic Operators
const OPERATOR = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPY: '*',
  DIVIDE: '/'
};

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

const REDIRECTED_INPUTS = {
  // Backspace:
  Enter: ACTION.EQUALS
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

// Common Util
const _ = {
  camel2Kebab: str => str.split('').map(s => s === s.toUpperCase() ? `-${s.toLowerCase()}` : s).join(''),
  /**
   * Split input into array of even sized chunks
   * @param {string|array} input - input to chunk
   * @param {number} chunkSize - chunk input by every n size
   * @returns {array} of chunks from source input
   */
  splitToChunks: (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i+=chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  },
  /**
   * Split input into array of even sized chunks starting from the last value
   * @param {string|array} input - input to chunk
   * @param {number} chunkSize - chunk input by every n size
   * @returns {array} of chunks from source input
   */
  splitToChunksRight: (arr, chunkSize) => {
    const chunks = [];
    for (let i = arr.length; i > 0; i-=chunkSize) {
      // chunks.push(arr.slice(i, i + chunkSize));
      chunks.unshift(arr.slice(Math.max(0, i - chunkSize), i));
      // console.log('splitToChunksRight', i - chunkSize, i, arr[i]);
    }


    // console.log('splitToChunksRight', chunks, arr, arr.length, chunkSize);

    return chunks;
  },
  getLabel: arr => {

    // NOTE: Not quite there but .... almost....
    // console.log('getLabel', arr);
    return 'null';
    let label = '';

    for (item of arr) {
      if (item || item > -1) {
        label = _.toStr(item);
        break;
      }
    }

    return label;
  },
  isNode: val => {
    return typeof val === 'object' ? Boolean(val.nodeType === 1) : false;
  },
  /**
   * Check if value is number
   * @param {*} value - value to check
   * @returns {boolean} true if number
   */
  isNumber: value => typeof value === 'number',
  num2Str: val => `${parseInt(val, 10)}`,
  toPx: num => `${num}px`,
  toStr: val => `${val}`,
  trimLeadingZeroes: string => {
    return string.split('.').map(s => {
      if (s.length > 1) {
        const fm = s.replace(/^0+/, '');
        return fm === '' ? DEFAULT_VALUE : fm;
      }
      return s;
    }).join('.');
  }
};


/**
 * Calculator Util
 * All the calculations are belong to us.
 */
const calcUtil = {
  computeValue(total, operator, value) {
    switch (operator) {
      case '-':
        return total - value;
      case '*':
        return total * value;
      case '/':
        return total / value;
      case '+':
      default:
        return total + value;
    }
  },

   computeInput(inputStr) {
     // need a depth count to get how many ending parens.....!!! TODO NEXT
    const nestedInputs = this.getNestedInputs(inputStr);
    let lastLevel = -1;
    const inputGroups = this.formatInputs(nestedInputs, (arr, prevArr = [], level) => {
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
        ...this.getInputGroups(arr),
        close,
        ...prevArr
      ];
      // console.log('res', res, arr, prevArr, level, close);
      return res;
    });
    // new total is here
    const total = _.trimLeadingZeroes(_.toStr(this.formatInputs(nestedInputs,  (arr, lastCompute = 0) => {
      const t = this.getInputGroups(arr);
      const j = t.map(res => {

        if (this.isOperator(res)) {
          return Spawn({
            children: res
          });
        } else {
          return Spawn({
            children: res
          });
        }
      });

      return this.getTotal(t) + lastCompute;
    })));



    const result = {
      total,
      totalAsDisplay: this.getFormattedDisplayValue(_.toStr(total), 3),
      history: inputGroups,
      historyAsStr: inputGroups.join('')
    };
    console.log('computeInput', {
      inputStr,
      nestedInputs,
      inputGroups,
      total,
      result
    });

    return result;
   },


  /**
   * Get Formatted Input Chain
   * @param {*} arr - Array to compute chain
   * @param {function} formatter - callback for each chain
   * @returns {*} value from formatter()
   */
   formatInputs(arr, formatter = value => value, level = 0) {
    const lastItem = arr[arr.length -1];
    const more = Array.isArray(lastItem);
    if (more) {
      return formatter(
        arr.slice(0,-1),
        this.formatInputs(lastItem, formatter, level + 1),
        level + 1
      );
    }

    return formatter(arr, [], level);
  },
  getFormattedDisplayValue(str) {
    const [int, dec] = str.split('.');
    let result = _.splitToChunksRight(int, 3).join(',');

    if (dec) {
      result += `.${dec}`
    }

    console.log('getFormattedDisplayValue', result, str);
    return result;


    // console.log('chunks', chunks);
    // return str.split('').
  },
  // input => str
  // [ops] => arr
  // @returns str
  // RM THIS
  // getMergedOps: (inp, ops = []) => {
  //   let mergedInput = inp;
  //   // Merged in unfiltered input
  //   if (ops.length) {
  //     ops.forEach(op => mergedInput += op);
  //   }
  //   return mergedInput;
  // },
  // values => arr
  // returns => arr|null
  getInputGroups(values) {
    if (values) {
      let merged = [''];
      // console.log('getInputGroups', values);
      for (let i = 0; i < values.length; i++) {
        // Push to new group current or previous was operator
        if (this.isOperator(merged[merged.length-1]) || this.isOperator(values[i])) {
          merged.push(values[i]);
        // Add value to previous group
        } else {
          merged[merged.length-1] += values[i];
        }
      }

      return merged;
    }

    return null;



  },
  // input arr
  // return arr
  getLastChain: function(chain, level) {
    const lastItem = chain[chain.length-1];

    // if (level > 0) {
    //   debugger
    // }


    // console.log('getLastChain', chain, level);

    if (level > 0 && Array.isArray(lastItem)) {
      return this.getLastChain(lastItem, level - 1);
    }

    return chain;
  },
  // input => str
  // @return => arr of arras
  // e..g 0 + (1 + ( 5 - 4)) => ['1', [1,+ [5,-,4,] ]]
  // get nested input array groups
  getNestedInputs: function(input) {
    // How deep in the chain we are
    let chainLevel = 0;
    const result = input.split('').reduce((acc, currentValue, i, arr) => {
      const lastChain = this.getLastChain(acc, chainLevel);
      // const formattedInput = currentValue === '(' ? [] : currentValue;






      // Create New Array from group key
      let formattedInput = currentValue;
      // let formattedInput = Spawn({
      //   children: currentValue
      // });
      if (currentValue === '(') {
        chainLevel++;
        formattedInput = [];
      } else if (currentValue === ')') {
        // chainLevel--;
      }



      // console.log('lastChain', i, lastChain, acc);
      // console.log('groupInput', i, arr[i], acc)


      // console.log('getNestedInputs', chainDepth, formattedInput, currentValue);
      // if (currentValue === '9') {
        // debugger
      // }


      // Append next item
      if (lastChain === acc) {
        return [
          ...acc,
          formattedInput
        ];
      }

      // Add last item nested arr
      lastChain.push(formattedInput);
      return acc;
    }, []);
    // console.log('result', result);
    return result;
  },
  getTotal(arr) {
    // const f = this.computeInputChain(arr);
    // const a = this.getInputGroups(arr);

    let total = 0;
    let operator = OPERATOR.ADD;
//
    const mergedValues = this.getInputGroups(arr);
    // console.log('mergedValues', mergedValues);

    mergedValues.forEach(node => {
        const value = Number.parseFloat(node, 10);
      // Value is Number
      if (!Number.isNaN(value)) {
        total = this.computeValue(total, operator, value);
      // Value is Operator
      } else if (this.isOperator(node)) {
        operator = node;
      }
    });

    // console.log('getTotal', total, arr);


    return total;
  },
  /**
   *
   * @param {*} value
   * @returns
   */
  isOperator(value) {
    switch (value) {
      case OPERATOR.ADD:
      case OPERATOR.SUBTRACT:
      case OPERATOR.MULTIPY:
      case OPERATOR.DIVIDE:
        return true;
      default:
        return false;
    }
  }
};

/**
 * Spawn DOM (The Document Object Model)
 * The Spawn Engine is a stateless virtual DOM generator.
 * @param {object|string} props - props of the Spawn
 * @param {element} props.parentEl - parent element to spawn into
 * @returns {element} reference of your Spawn
 */
const Spawn = (props = {}) => {
  const {
    children = [],
    className,
    events,
    parentEl,
    name,
    label,
    style,
    tag = 'div',
    // type = 'div',
    value,
    // Convert rest props to attrs
    ...restProps
  } = props;


  if (typeof props === 'string') return document.createTextNode(props);

  // console.log('props', props);

  const el = document.createElement(tag);

  const appendChildren = (children) => {
    let fmChildren = children;
    if (!Array.isArray(fmChildren)) {
      fmChildren = [fmChildren];
    }
    fmChildren.forEach(child => {
      let fmChild = child;
      if (!_.isNode(child) && (typeof child === 'string' || typeof child === 'number')) {
        fmChild = document.createTextNode(child);
      }

//       console.log('child', child, _.isNode(child));
//       if (child === 0) {
//         debugger
//       }

      el.appendChild(fmChild);
    });
  }

  // Attach Event Listeners
  // Assign {event} and {el} (self)
  if (events) {
    Object.keys(events).forEach(key => {
       el.addEventListener(key, e => events[key](e, el));
    });
  }

  // if (events) {
  //   Object.keys(events).forEach(key => {
  //      el.addEventListener(key, events[key]);
  //   });
  // }

  // Attach Style
  if (style) {
    el.setAttribute('style', Object.keys(style).map(key => {

      const trasodky = _.isNumber(style[key]);
      // console.log('trasodky', trasodky, style[key]);
      // number default to px
      let value = style[key];
      if (_.isNumber(value)) {
        value = _.toPx(value);
      }
      // if

      return `${_.camel2Kebab(key)}: ${value};`
    }).join(' '));
  }

  // Attach Class Name
  if (className) {
    el.setAttribute('class', className);
  }

  const lblNode = _.getLabel([label, name, value]);
  if (lblNode) {
    const lbl = document.createTextNode(lblNode);
    el.appendChild(lbl);
  }

  // .. spread down the rest to html attrs
  Object.keys(restProps).forEach(key => el.setAttribute(key, restProps[key]));

  appendChildren(children);

  // Append to parent
  if (parentEl) {
    parentEl.appendChild(el);
  }

  return el;
};

/**
 * Calculator App Component
 * Accepts onKey or Click Events
 * @returns {number} of current value
 */
class Calculator {
  constructor(props = {}) {
    const {
      className = '',
      input = DEFAULT_VALUE,
      parentEl,
      style,
      theme
  } = props;

    this.buttons = {};
    this.input = input;
    this.theme = this.getTheme(theme);

    // Text Input Style
    const txtStyle = {
      textAlign: 'right',
      overflow: 'hidden'
    };

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

    this.el = Spawn({
      parentEl,
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

    this.renderBtns();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    // Re-enable when  DEMO IS ready....
    // this.calculateInput();
    this.updateInput(this.input);

    console.log('constructor', this);
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
  // getCalculatedInput(str = this.input) {

  //   // need a depth count to get how many ending parens.....!!! TODO NEXT
  //   const nestedInputs = calcUtil.getNestedInputs(str);

  //   // split into separate fn....
  //   // !! NESTING NEEDS TO BE PRESERVED!!! for render display
  //   const inputGroups = this.getFormattedInputGroups(nestedInputs).reduce((acc, item, i) => [...acc, item, ' '], []).slice(0, -1);
  //   let lastLevel = -1;
  //   const inputGroups2 = calcUtil.formatInputs(nestedInputs, (arr, prevArr = [], level) => {


  //     // try to manage position.....
  //     if (lastLevel < 0) {
  //       lastLevel = level;
  //     } else {
  //       lastLevel = 0;
  //     }


  //     // Auto close parenthesisisisisiis
  //     let open = '(';
  //     if (level === 1) {
  //       open = '';
  //     }
  //     let close = '';
  //     for (let i = 0; i < lastLevel; i++) {
  //       close += ')';
  //     }




  //     const res = [
  //       open,
  //       ...calcUtil.getInputGroups(arr),
  //       close,
  //       ...prevArr
  //     ];
  //     console.log('res', res, arr, prevArr, level, close);
  //     return res;
  //   });

  //   // new total is here
  //   const total = calcUtil.formatInputs(nestedInputs,  (arr, lastCompute = 0) => {
  //     const t = calcUtil.getInputGroups(arr);
  //     const j = t.map(res => {

  //       if (calcUtil.isOperator(res)) {
  //         return Spawn({
  //           children: res
  //         });
  //       } else {
  //         return Spawn({
  //           children: res
  //         });
  //       }
  //     });

  //     return calcUtil.getTotal(t) + lastCompute;
  //   });

  //   const res = {
  //     input: str,
  //     nestedInputs,
  //     inputGroups,
  //     inputGroups2,
  //     inputAsArray: inputGroups,
  //     total: _.toStr(total)
  //   };

  //   console.log('getCalculatedInput', {
  //     // nestedInputs,
  //     // inputAsArray,
  //     ...res
  //   });

  //   return res;
  // }

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

  updatePreviousInputDisplay() {

  }

  /**
   * Render Buttons on Calculator
   */
  renderBtns() {
    _.splitToChunks(this.getButtons(), 4).forEach((group, j) => {
      this.el.appendChild(Spawn({
        children: group.map((btn, i) => {
          const { value } = btn;

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


          // console.log('background', background, this);



          const el = Spawn({
            ...btn,
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
              fontFamily: `'Roboto', sans-serif`
            },
            tag: 'button'
          });

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
}

// App
class App {
  constructor(props) {
    const { calculatorProps = {}, parentEl } = props;

    // App Element
    const el = Spawn({
      className: 'app',
      parentEl: parentEl || document.body,
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }
    });

    const calcContainer = Spawn();

    // JS logo color
    // Getting Started
    Spawn({
      parentEl: el,
      children: [
        Spawn({
          children: [
            Spawn({
              children: 'JS',
              style: {
                display: 'inline-flex',
                background: '#ff005e',
                // #ff1f71
                //#ff3d84
                width: 26,
                height: 26,
                fontSize: 14,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                marginRight: 6,
              }
            }),
            // Spacer...
            // Spawn({
            //   style: {
            //     width: 6,
            //     height: 10,
            //     display: 'inline-block'
            //   }
            // }),
            // 'JS',
            'Calculator'
          ],
          style:{
            color: COLOR_PALETTE.WHITE_00,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center'
          }
        }),
        Spawn({
          children: 'Use keyboard or click buttons to calculate!',
          style:{
            color: '#dddddd',
            // fontSize: '14px',
            fontSize: 12,
            marginTop: 8
          }
        }),
        calcContainer,
        Spawn({
          children: [
            'Inspired by Nicat Manafov',
            ' @ ',
            Spawn({
              tag: 'a',
              href: 'https://dribbble.com/shots/6144137-Calculator-App-iOS-13',
              children: 'dribbble.com',
              style: {
                color: '#ff005e',
                textDecoration: 'none'
              },
              events: {
                mouseenter: (e, el) => el.style.color = '#ff3d84',
                mousedown: (e, el) => el.style.color = '#ff70a5',
                mouseup: (e, el) => el.style.color = '#ff3d84',
                mouseleave: (e, el) => el.style.color = '#ff005e'
              }
            })
          ],
          style:{
            color: '#ffffff',
            fontSize: 12,
            fontFamily: `'Dancing Script', cursive`,
            marginTop: 8,
            textAlign: 'center'
          }
        })
      ]
    })

    const calculator = new Calculator({
      // Append calculator to App
      parentEl: calcContainer,
      style: {
        marginTop: 20
      },
      className: 'my special',
      ...calculatorProps
    });


    // Import External Fonts
    [
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
      'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&family=MonteCarlo&family=Style+Script&display=swap'
    ].forEach(href => {
      Spawn({
        parentEl: document.head,
        tag: 'link',
        rel: 'stylesheet',
        type: 'text/css',
        href
      });
    });

    // Custom App Styles
    // from : https://www.eggradients.com/category/purple-gradient
    document.body.style.backgroundColor = '#a4508b';
    document.body.style.backgroundImage = 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)';
    document.body.style.fontFamily = `'Roboto', sans-serif`;

    this.state = {
      el
    };


    return this;
  }
}


/**
 * Flappy Runtime Testing
 */
const runTests = () => {
  const tests = [
    [
      'name',
      '0+(12+(2+(3+(1+7',
      {
        history: '0+(12+(2+(3+(1+7))))',
        display: '12,238'
      }
    ]
  ];

  const validate = (expected, received, options) => {
    const isValid = expected === received;

    if (!isValid) {
      console.error({expected, received});
      throw new Error(`TEST FAILED`);
    }
    return isValid;
  };

  const isValid = tests.every(test => {
    const [title, input, expected] = test;
    const result = calcUtil.computeInput(input);

    console.log('runTests', test, result);
    const sameHistory = validate(expected.history, result.historyAsStr);
    const samTotal = validate(expected.display, result.totalAsDisplay);
    return sameHistory && samTotal;
  });
}

// runTests();

// const run = new App({
//   calculatorProps: {
//     // Start Input Value for Calculator
//     // testing
//     input: tests[1]
//     // USE this for final demo
//     // input: '45+(1250*100)/10'
//   }
// });

export default App;