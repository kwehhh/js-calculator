import { expect } from 'chai';
import calcUtil from '../src/util/calcUtilv2.ts';

describe('Utils', function () {
  it('getNestedInputs', () => {
    const value = calcUtil.getNestedInputs('0');
    expect(value).to.deep.equal(['0']);
  })
});
