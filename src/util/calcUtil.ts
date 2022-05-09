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
  getFormattedDisplayValue: util.formatToDisplayValue,
  getInputGroups: util.getInputGroups,
  getLastChain: util.getLastChain,
  getNestedInputs: util.getInputTreeArray,
  getTotal: util.getTotal,
  isOperator: util.isOperator
};
