import CONSTANT from './constants';
import _ from '@unfocused/treasure-goblin';

const { OPERATOR } = CONSTANT;

/**
 * Calculator Util
 * All the calculations are belong to us.
 */
export default {
  /**
   * Calculate Total
   * @param {string} inputStr - Input string
   * @returns {string} of calculated total
   */
  calculateTotal(inputStr: string): string {
    const inputTree = this.getInputTreeArray(inputStr);
    const formattedTree = this.formatTree(inputTree);
    const total = this.getTotalFromTree(formattedTree) as number;
    return `${total}`;
  },
  /**
   * Format value to readable display
   * @param {string} str - value to format
   * @returns {string} for formatted value eg 5000 F=> 5,000
   */
  formatToDisplayValue(str: string): string {
    const [integer, decimal] = str.split('.');
    let value = _.splitToChunksRight(integer, 3).join(',');

    if (decimal) {
      value += `.${decimal}`
    }

    return value;
  },
  /**
   * Compute two values
   * @param {number} a - first value
   * @param {string} operator - operator
   * @param {number} b - second value
   * @returns {number} of computed value
   */
  computeValue(a: number, operator: string, b: number): number {
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
  /**
   * Get Last Tree Node
   * @param {array} chain - the chain
   * @param {number} level - chain level
   * @returns {array} of last tree node
   */
  getLastTreeNode(chain: any[], level: number): any[] {
    const lastItem = chain[chain.length - 1];
    if (level > 0 && Array.isArray(lastItem)) {
      return this.getLastTreeNode(lastItem, level - 1);
    }

    return chain;
  },
  /**
   * Convert input string to tree array
   * @param {string} input - input entry
   * @returns {array} of input tree array
   */
  getInputTreeArray(input: string): any[] {
    // How deep in the tree we are
    let level = 0;
    return input.split('').reduce((prevVal, curVal) => {
      const lastNode = this.getLastTreeNode(prevVal, level);

      let value = curVal as any;
      // Create New Nested Array
      if (curVal === '(') {
        level++;
        value = [];
      // Go Back One Level
      } else if (curVal === ')') {
        level--;
        return prevVal;
      }

      // Append next value
      if (lastNode === prevVal) {
        return [
          ...prevVal,
          value
        ];
      }

      // Append next value to last node
      lastNode.push(value);
      return prevVal;
    }, []);
  },
  /**
   * Format input tree array to input display
   * e.g. ['5', ' ', '+', ' ', '1', '0'] = '5 + 10'
   * @param {array} treeArray - input tree array
   */
  formatTreeArrayToDisplay(treeArray: any[]) {
    const arr = this.getInputGroups(treeArray).join(' ').split('');
    return arr.map((char: string, i: number) => {
      // scrub extra space around parens
      if (char === ' ' && ((arr[i - 1] && arr[i - 1] === '(') || (arr[i + 1] && arr[i + 1] === ')'))) {
        return '';
      }
      return char;
    }).join('');
  },
  /**
   * Check if value is number
   * TODO: Add this to treasure-goblin
   * @param {string|number} value - value
   * @returns {boolean} true if numeric
   */
  isNumeric(value: string | number): boolean {
    if (typeof value === 'string') {
      return !isNaN(parseFloat(value));
    }

    return !isNaN(value);
  },
  getTotalFromTree(array: any[]): number {
    let total = 0;
    let operator = OPERATOR.ADD;

    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      // Get Total of Nested Groups
      if (Array.isArray(value)) {
        const nextVal = this.getTotalFromTree(value);
        total = this.computeValue(total, operator, nextVal);
      // Change Operator
      } else if (this.isOperator(value)) {
        operator = value;
      // Compure new Value
      } else {
        total = this.computeValue(total, operator, Number(value));
      }
    }

    return total;
  },
  /**
   * Format Tree to grouped inputs
   * @param {array} array - inputs
   * @returns {array} of formatted
   */
  formatTree(array: string[]): string[] {
    let newTree = [''];
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      if (this.isNumeric(value)) {
        // Push value if the last entry was Operator
        if (this.isOperator(newTree[newTree.length - 1])) {
          newTree.push(value);
        // Append value to last entry
        } else {
          newTree[newTree.length - 1] += value;
        }
      } else if (Array.isArray(value)) {
        newTree = [
          ...newTree,
          this.formatTree(value)
        ];
      } else {
        newTree.push(value);
      }
    }

    return newTree;
  },
  /**
   * Group input values from provided tree array
   * @param {array} - values of tree array
   * @param {function} - input group formatter
   * @returns {array} of grouped values
   */
  getInputGroups(
    arr: any[],
    formatter?: (inputArr: string[], a: string, b: (inputArr: string[]) => void, c: string) => string[]
  ): any[] {
    if (arr) {
      let merged = [''] as any[];
      for (let i = 0; i < arr.length; i++) {
        // Flatten nested group
        if (Array.isArray(merged[merged.length - 1]) || Array.isArray(arr[i])) {
          if (formatter) {
            merged = formatter(merged, arr[i], (nextArr) => this.getInputGroups(nextArr, formatter), 'nested');
          } else {
            merged = [
              ...merged,
              '(',
              ...this.getInputGroups(arr[i]),
              ')'
            ];
          }
        // Split Operator to new group
        } else if (this.isOperator(merged[merged.length - 1]) || this.isOperator(arr[i])) {
          merged.push(arr[i]);
        // Append value to previous group
        } else {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          merged[merged.length - 1] += arr[i];
        }
      }

      return merged;
    }

    return [];
  },
  /**
   * Get total
   * @param {array} arr - array to get total from
   * @returns {number} of total
   */
  getTotal(arr: string[]): number {
    let total = 0;
    let operator = OPERATOR.ADD;
    const mergedValues = this.getInputGroups(arr);

    mergedValues.forEach((node: string) => {
      const value = Number.parseFloat(node);
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
  isOperator(value: any) {
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
