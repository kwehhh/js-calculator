import _ from '@unfocused/treasure-goblin';
import util from './calcUtilv2';
import CONSTANT from './constants';

const { OPERATOR } = CONSTANT;

/**
 * Calculator Util
 * All the calculations are belong to us.
 */
export default {
  computeValue: util.computeValue,
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
  getInputGroups: util.getInputGroups,
  // input arr
  // return arr
  getLastChain: function(chain, level) {
    const lastItem = chain[chain.length-1];
    if (level > 0 && Array.isArray(lastItem)) {
      return this.getLastChain(lastItem, level - 1);
    }

    return chain;
  },
  getNestedInputs: util.getInputTreeArray,
  getTotal: util.getTotal,
  /**
   *
   * @param {*} value
   * @returns
   */
  isOperator: util.isOperator
};