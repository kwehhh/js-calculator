import Spawn from '@unfocused/spawn';
import _ from '@unfocused/treasure-goblin';
import CONSTANT from './constants';

export default {
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
  getNestedInputs: function(input) {
    // How deep in the chain we are
    let chainLevel = 0;
    const result = input.split('').reduce((acc, currentValue, i, arr) => {
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
    // console.log('result', result);
    return result;
  },
  getLastChain: function(chain, level) {
    const lastItem = chain[chain.length-1];

    if (level > 0 && Array.isArray(lastItem)) {
      return this.getLastChain(lastItem, level - 1);
    }

    return chain;
  },
}
