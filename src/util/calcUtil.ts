import _ from '@unfocused/treasure-goblin';
import util from './calcUtilv2';

/**
 * Calculator Util
 * All the calculations are belong to us.
 */
export default {
  calculateTotal: util.calculateTotal,
  computeValue: util.computeValue,
  formatInputs: util.getFormattedInputTree,
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
  isOperator: util.isOperator
};
