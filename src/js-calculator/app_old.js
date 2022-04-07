/**
 * JS Calculator
 *
 * Objectives/Constraints:
 *  - Easy Import and Customize into any App
 *  - Single JS file src
 *  - No External Libraries
 *
 * Functionality:
 *  - Math calculator with nested level computation
 *
 * References:
 *  UI Design {author} : https://dribbble.com/shots/6144137-Calculator-App-iOS-13/attachments/6144137-Calculator-App-iOS-13?mode=media
 *  CodePen: https://codepen.io/anthonykoch/pen/xVQOwb?editors=0010
 *   adsd : https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/
 */



// !! Keep entire file as single for Codepen

// TODO
// key listener
// colors on operators
// add instructions on top of calc demo
// mybe some cool animatiosn
// more border radius on buttons

const COLOR_PALETTE = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  GRAY_1: '#141414',
  GRAY_2: '#242424',
  GRAY_3: '#484848',
  GRAY_4: '#eef0f9',
  ORANGE: '#f59315',
  RED_1: '#3b0202',
  RED_2: '#f51515',
  GREEN: '#5bce09'
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
  EQUALS: '='
};

// Common Util
const _ = {
  camel2Kebab: str => str.split('').map(s => s === s.toUpperCase() ? `-${s.toLowerCase()}` : s).join(''),
  chunkArr: (arr, chunkSize) => {

    const chunks = [];
    for (let i = 0; i < arr.length; i+=chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  },
  getLabel: arr => {
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
  num2Str: val => `${parseInt(val, 10)}`,
  toPx: num => `${num}px`,
  toStr: val => `${val}`,
  trimLeadingZeroes: string => {
    return string.split('.').map(s => {
      if (s.length > 1) {
        const fm = s.replace(/^0+/, '');
        return fm === '' ? '0' : fm;
      }
      return s;
    }).join('.');
  }
};

// DOM Generator
const Spawn = (props = {}) => {
  const {
    children = [],
    events,
    name,
    label,
    style,
    type = 'div',
    value
  } = props;
  const el = document.createElement(type);

  const addChildren = (children) => {
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

  if (events) {
    Object.keys(events).forEach(key => {
       el.addEventListener(key, events[key]);
    });
  }

  // Attach Label
  if (style) {
    el.setAttribute('style', Object.keys(style).map(key => `${_.camel2Kebab(key)}: ${style[key]};`).join(' '));
  }

  const lblNode = _.getLabel([label, name, value]);
  if (lblNode) {
    const lbl = document.createTextNode(lblNode);
    el.appendChild(lbl);
  }

  addChildren(children);

  return el;
};

// Calculator
class Calculator {
  constructor(props) {
    const { input, parent, style = {}, theme } = props;

    // store the entry
    this.input = input || [];
    this.theme = theme;
    this.handleBtnOnClick = this.handleBtnOnClick.bind(this);

    const el = Spawn({
      style: {
        background: this.theme.background,
        borderRadius: '4px',
        padding: '10px',
        ...style
      }
    });

    const displayContainer = Spawn({
      style: {
        color: this.theme.color,
        height: '100px'
      }
    });

    const btnContainer = Spawn({});
    const btns = this.renderBtns(btnContainer);


    el.appendChild(displayContainer);
    el.appendChild(btnContainer);

    // Mount
    if (parent) {
      parent.appendChild(el);
    } else {
      document.body.append(el);
    }
    this.inputEl = displayContainer;
    this.updateDisplayInput(this.input);
  }

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
  }

  getButtons() {
    return [
      {
        // Euler
        value: 'e'
      },
      {
        label: 'π',
        value: 'p'
      },
      {
        name: 'sin'
      },
      {
        name: 'deg'
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
        label: '÷',
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
  }

  getInput(arr) {

    return arr.join('');
  }

  // input arr
  // return arr
  getLastChain(chain) {
    const lastItem = chain[chain.length-1];

    if (Array.isArray(lastItem)) {
      return this.getLastChain(lastItem);
    }

    return chain;
  }

  // return number
  getTotal(arr) {
    // const f = this.computeInputChain(arr);
    // console.log('f', f);

    let total = 0;
    let operator = OPERATOR.ADD;
    arr.forEach(node => {
       const value = Number.parseFloat(node, 10);
      // Computer Number
      if (!Number.isNaN(value)) {
        total = this.computeValue(total, operator, value);
      } else if (this.isOperator(node)) {
        operator = node;
      }
    });

    return total;
    // return _.toStr(total);
  }

  getValue(value) {
    if (value === 'e') {
      return Math.E;
    }

    if (value === 'p') {
      return Math.PI;
    }

    // return value;
    return _.toStr(value);
  }

  handleBtnOnClick(value) {
    console.log('handleBtnOnClick', value);

    const lastEntry = this.input.length - 1;


    // const test = [
    //   0,
    //   '+',
    //   [
    //     1,
    //     '+',
    //     [
    //       2,
    //       '+',
    //       [
    //         3,
    //         '+',
    //         [
    //           1,
    //           '+',
    //           2
    //         ]
    //       ]
    //     ]
    //   ]
    // ];

    // const lastChain = this.getLastChain(test);


    // debugger
    const lastChain = this.getLastChain(this.input);
    const lastItem = lastChain[lastChain.length - 1];

    // debugger


















    switch (value) {
      // Add Operator Input
      case OPERATOR.ADD:
      case OPERATOR.SUBTRACT:
      case OPERATOR.MULTIPY:
      case OPERATOR.DIVIDE:



        const isItemOperator = this.isItemOperator(lastItem);
        lastChain.push(value);

        console.log(isItemOperator, lastChain, lastItem, this);






        // if (this.isItemOperator(lastItem)) {
          // debugger
        // }
        // if (!this.isLastItemOperator()) {
        //   this.input.push(value);
        // }
        break;
      // Compute User Input
      case ACTION.EQUALS:
        // const a = [this.getTotal(this.input)];
        // const b = [this.getComputeChain(this.input)];

        // if (b !== 9) {
        //     debugger
        //     }

        // this.input = a;

        // console.log('handleBtnOnClick', b);
        this.input = [this.getComputeChain(this.input)];
        ////////////////////////////////////
        break;
      // group
      case '(':
        // last chain....
        this.updateInput([]);
        // this.input.push([]);
        break;
      case 'clear':
        this.input = ['0'];
        break;
      // append num
      default:
        const fmValue = this.getValue(value);
        // start new chain
        if (this.isLastItemOperator() || value === 'e' || value === 'p') {
          this.input.push(fmValue);
        // Group
        } else if (Array.isArray(this.input[lastEntry])) {
          this.input[lastEntry].push(fmValue);
          console.log(this.input[lastEntry], fmValue);
          // recurse away....
        // add to existing chain
        } else {
          // this.input[lastEntry] += fmValue;
          this.updateInput(fmValue);
        }
    }

    // update DOM
    this.updateDisplayInput(this.input);
  }

  isOperator(value) {
    switch (value) {
      case '+':
      case '-':
      case '*':
      case '/':
        return true;
      default:
        return false;
    }
  }

  isItemOperator(item) {
    if (this.isOperator(item)) {
      return true;
    }

    return false;
  }

  isLastItemOperator() {
    const lastEntry = this.input.length - 1;
    if (this.isOperator(this.input[lastEntry])) {
      return true;
    }

    return false;
  }

  renderBtns(el) {
    _.chunkArr(this.getButtons(), 4).forEach((group, j) => {
      el.appendChild(Spawn({
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

          let color = this.theme.color;

          let background = this.theme.button;
          if (this.isOperator(value)) {
            background = '#f59315';
            color = this.theme.buttonAction;
          } else if (value === 'clear') {
            background = '#3b0202';
            color = '#f51515';
          } else if (value === ACTION.EQUALS) {
            background = '#5bce09';
            color = this.theme.buttonAction;
          }

          return Spawn({
            style: {
              display: 'inline-block',
              padding: _.toPx(spacer)
            },
            children: [
              Spawn({
                ...btn,
                events: {
                  click: () => this.handleBtnOnClick(value)
                },
                style: {
                  background,
                  borderRadius: '6px',
                  borderStyle: 'none',
                  color,
                  width: _.toPx(width),
                  height: _.toPx(height)
                },
                type: 'button'
              })
            ]
          });
        })
      }));
    });
  }

  getDOMInputArr(arr) {
    return [
      // Spawn({children: '(', type: 'span'}),
      ...arr.map(node => {
        let style = {};
        if (this.isOperator(node)) {
          style = {
            color: 'red'
          };
        }

        return Spawn({children: node, style, type: 'span'});
      }),
      // Spawn({children: ')', type: 'span'})
    ];
  }

  computeInputChain(arr) {
    const lastItem = arr[arr.length -1];
    const more = Array.isArray(lastItem);
    if (more) {
    // ...

    }

    // ... last
  }


    // return number
  getComputeChain(arr, cb) {
    const lastItem = arr[arr.length -1];
    const more = Array.isArray(lastItem);
    if (more) {

      return this.getTotal(arr.slice(0,-1)) + this.getComputeChain(lastItem, cb);


      // return [
      //   this.getTotal(arr.slice(0,-1)),
      //   this.getComputeChain(lastItem, cb),
      // ];
    }

    return this.getTotal(arr);
  }

  getDisplayChain(arr, cb) {
    const lastItem = arr[arr.length -1];
    const more = Array.isArray(lastItem);
    if (more) {
      return [
        ...this.getDOMInputArr(arr.slice(0,-1)),
        Spawn({children: '(', type: 'span'}),
        ...this.getDisplayChain(lastItem, cb),
        Spawn({children: ')', type: 'span'})
      ];
    }

    return this.getDOMInputArr(arr);
  }

  updateDisplayInput(arr) {

//     const format2DOM = (arr, more) => {
//       console.log('format2DOM', arr, more);
//       return this.getDOMInputArr(arr);
//     };


// 0+1+2+3+1+2
// should resolve as 9...!!!
    const formatted = this.getDisplayChain(arr);
    console.log('updateDisplayInput', arr);

    // debugger
//     const formatted = arr.map(s => {
//       debugger
//       return s.length > 1 ? _.trimLeadingZeroes(s) : s;
//     }).join('');

    this.inputEl.innerHTML = '';
    formatted.forEach(child => {
      this.inputEl.appendChild(child);
    });
  }

  updateInput(val) {
    const lastChain = this.getLastChain(this.input);
    let lastEntry = lastChain.length - 1;
    // console.log('lastChain', val, lastChain, lastEntry, this.input);
    // debugger

    switch (lastEntry) {
      case Array.isArray(lastEntry):
        lastChain.push(val);
        break;
      default:
        this.input[lastEntry] += val;
    }

    // this.input.push([]);


  }
}

class App {
  constructor(props) {
    const el = Spawn({
      style: {
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }
    });

    const calculatorProps = {
      parent: el
    };


    // const defaultInput = ['0'];


    const defaultInput2 = '0+(1+(2+(3+(1+2'; // cursor at last chain
    const defaultInput3 = '0+(1+(2+(3+(1+2))))'; // cursor at level 0 depth
    // this is probably bad....
    const defaultInput = [
      0,
      '+',
      [
        1,
        '+',
        [
          2,
          '+',
          [
            3,
            '+',
            [
              1,
              '+',
              2
            ]
          ]
        ]
      ]
    ];



    const myDarkCalculator = new Calculator({
      ...calculatorProps,
      input: defaultInput,
      theme: {
        background: COLOR_PALETTE.GRAY_2,
        button: COLOR_PALETTE.GRAY_3,
        buttonAction: COLOR_PALETTE.WHITE,
        color: COLOR_PALETTE.WHITE,

      }
    });

//     const myLightCalculator = new Calculator({
//       ...calculatorProps,
//       input: ['0'],
//       style: {
//          marginLeft: '40px',

//       },
//       theme: {
//         background: COLOR_PALETTE.WHITE,
//         button: COLOR_PALETTE.GRAY_4,
//         buttonAction: COLOR_PALETTE.WHITE,
//         color: COLOR_PALETTE.BLACK
//       }
//     });

    document.body.style.background = COLOR_PALETTE.GRAY_1;
    document.body.append(el);

  }
};

const run = new App();