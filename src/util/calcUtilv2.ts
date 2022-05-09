import CONSTANT from './constants';
import _ from '@unfocused/treasure-goblin';

const { OPERATOR } = CONSTANT;

export default {
  /**
   * Calculate Total
   * @param {string} inputStr - Input math string entry
   * @returns {string} of calculated total
   */
  calculateTotal(inputStr) {
     return _.trimLeadingZeroes(
       _.toStr(
         this.getFormattedInputTree
         (this.getInputTreeArray(inputStr),
          (arr, lastCompute = 0) => {
            const t = this.getInputGroups(arr);
            return this.getTotal(t) + lastCompute;
          }
     )));
  },
  /**
   * Compute two values
   * @param {number} a - first value
   * @param {string} operator - operator
   * @param {number} b - second value
   * @returns {number} of computed value
   */
  computeValue(a, operator, b) {
    switch (operator) {
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
      case '+':
      default:
        return a + b;
    }
  },
    // input arr
  // return arr
  getLastChain: function(chain, level) {
    const lastItem = chain[chain.length-1];
    if (level > 0 && Array.isArray(lastItem)) {
      return this.getLastChain(lastItem, level - 1);
    }

    return chain;
  },
  /**
   * Convert input string to tree array
   * @param {string} input - input entry
   * @returns {array} of input tree array
   */
  getInputTreeArray(input) {
    // How deep in the chain we are
    let chainLevel = 0;
    const result = input.split('').reduce((acc, currentValue) => {
      const lastChain = this.getLastChain(acc, chainLevel);
      // Create New Array from group key
      let formattedInput = currentValue;
      if (currentValue === '(') {
        chainLevel++;
        formattedInput = [];
      } else if (currentValue === ')') {
      }

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
    return result;
  },
  /**
   * Format input tree array to display
   * e.g. ['5', ' ', '+', ' ', '1', '0'] = '5 + 10'
   * @param {array} treeArray - input tree array
   */
  formatTreeArrayToDisplay(treeArray) {
    return this.getInputGroups(treeArray).join(' ');
  },
  /**
   * Get Formatted Input Tree with provided formatter
   * @param {array} arr - Input array to format
   * @param {function} formatter - formatter for each array
   * @returns {*} value from formatter()
   * TODO: need a depth count to get how many ending parens.....!!! TODO NEXT
   */
   getFormattedInputTree(arr, formatter = value => value, level = 0) {
    const lastItem = arr[arr.length -1];
    const more = Array.isArray(lastItem);
    if (more) {
      return formatter(
        arr.slice(0,-1),
        this.getFormattedInputTree(lastItem, formatter, level + 1),
        level + 1
      );
    }

    return formatter(arr, [], level);
  },
  /**
   * Group math values from provided tree array
   * @param {array} - values of tree array
   * @returns {array|null} of grouped values
   */
  getInputGroups(arr) {
    if (arr) {
      let merged = [''];
      for (let i = 0; i < arr.length; i++) {
        // Push to new group current or previous was operator
        if (this.isOperator(merged[merged.length-1]) || this.isOperator(arr[i])) {
          merged.push(arr[i]);
        // Add value to previous group
        } else {
          merged[merged.length-1] += arr[i];
        }
      }

      return merged;
    }

    return null;
  },
  /**
   * Get total
   * @param {array} arr - array to get total from
   * @returns {number} of total
   */
  getTotal(arr) {
    let total = 0;
    let operator = OPERATOR.ADD;
    const mergedValues = this.getInputGroups(arr);

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

    return total;
  },
  /**
   * Check if provided value is math operator
   * @param {*} value - value to check
   * @returns {boolean} true if operator;
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
}
