
// NEXT: Depth Chain cursor for arr group!!!
// compute input chains... Arr must match correct nested level
// go for scenario defaultInput2

// Arithmic Operators
const OPERATOR = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPY: '*',
  DIVIDE: '/'
};

const additionalOperators = ['+', '5', '+', '32', '+', '(', '5'];
// Pre tests
const ts = [
  // cursor at last chain
  {
    input: '0+(12+(2+(3+(1+7',
    output: 25
  },
  // cursor at level 0 depth
  {
    input: '0+(1+(2+(3+(1+9) + 2)))',
    output: 18
  }
];

// Merge pre tests with additional operators
const tests = [
  ...ts,
  ...ts.map(t => {
    return {
      ...t,
      extra: additionalOperators,
      output: t.output + 42
    }
  })
];

// input => str
// operations => arr('str')
const calc = (input, operations) => {
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
    },
    // input => str
    // [ops] => arr
    // @returns str
    getMergedOps: (inp, ops = []) => {
      let mergedInput = inp;
      // Merged in unfiltered input
      if (ops.length) {
        ops.forEach(op => mergedInput += op);
      }
      return mergedInput;
    },
    // values => arr
    // returns => arr|null
    getMergedValues(values) {
      if (values) {
        let merged = [''];
        // console.log('getMergedValues', values);
        for (let i = 0; i < values.length; i++) {
          // Push if current or previous was operator
          if (this.isOperator(merged[merged.length-1]) || this.isOperator(values[i])) {
            merged.push(values[i]);
          // Add character to last item
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
    // @return => arr
    getInputChain: function(input) {
      // How deep in the chain we are
      let chainLevel = 0;
      const result = input.split('').reduce((acc, currentValue, i, arr) => {
        const lastChain = this.getLastChain(acc, chainLevel);
        // const formattedInput = currentValue === '(' ? [] : currentValue;






        // Create New Array from group key
        let formattedInput = currentValue;
        if (currentValue === '(') {
          chainLevel++;
          formattedInput = [];
        } else if (currentValue === ')') {
          // chainLevel--;
        }

        // console.log('lastChain', i, lastChain, acc);
        // console.log('groupInput', i, arr[i], acc)


        // console.log('getInputChain', chainDepth, formattedInput, currentValue);
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
      // const a = this.getMergedValues(arr);
      // console.log('getTotal', a, arr);

      let total = 0;
      let operator = OPERATOR.ADD;

      const mergedValues = this.getMergedValues(arr);
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

      return total;
      // return _.toStr(total);
    },
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
  };

  const mergedInput = calcUtil.getMergedOps(input, operations);
  const chain = calcUtil.getInputChain(mergedInput);
  const result = calcUtil.getComputeChain(chain);

  console.log('calc', {result, chain, mergedInput, calcUtil})
  // if (result !== expectedresult) {
    // debugger
  // }

  return result;
};

// Run tests
const testResultsPassed = tests.every(test => {
  const result = calc(test.input, test.extra);

  if (result !== test.output) {
    debugger
  }

  return result === test.output;
});

console.log('testResultsPassed', testResultsPassed);