import { expect } from 'chai';
// import calcUtil from '../src/util/calcUtil.ts';
import calcUtil from '../src/util/calcUtilv2.ts';
// const calcUtil = require("../src/util/calcUtil.ts");
// const testUtil = require("../src/util/testUtil.ts");


// console.log(testUtil)

// const test = require('@unfocused/spawn').default;
// const test = require('@unfocused/treasure-goblin/src/util/common.ts').default;
// import Spawn from '@unfocused/spawn';
// import _ from '@unfocused/treasure-goblin';

describe('Utils', function () {
  it('computeInput', () => {
    // const { total } = calcUtil.computeValue(0, 0, 0);
    // const { total } = calcUtil.computeInput('5 + 5');
    const x = calcUtil.getNestedInputs('0');
    // const x = testUtil.test();
    expect(x).to.deep.equal(['0']);
    // expect('pizza-time').to.equal('pizza-time');
  })
});