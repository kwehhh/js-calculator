import _ from '@unfocused/treasure-goblin';
import util from './calcUtilv2';
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
        return total / value;``
      case '+':
      default:
        return total + value;
    }
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

    return result;
  },
  // values => arr
  // returns => arr|null
  getInputGroups(values) {
    if (values) {
      let merged = [''];
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
    if (level > 0 && Array.isArray(lastItem)) {
      return this.getLastChain(lastItem, level - 1);
    }

    return chain;
  },
  getNestedInputs: util.getNestedInputs,
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