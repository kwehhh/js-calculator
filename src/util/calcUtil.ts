import Spawn from '@unfocused/spawn';
import _ from '@unfocused/treasure-goblin';
import CONSTANT from './constants';
const { OPERATOR } = CONSTANT;

/**
 * Calculator Util
 * All the calculations are belong to us.
 */
export default {
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