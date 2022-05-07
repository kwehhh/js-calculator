import { expect } from 'chai';
import calcUtil from '../src/util/calcUtilv2.ts';

describe('calcUtil',
function () {
  describe('getInputTreeArray', () => {
    it('0', () => {
      const value = calcUtil.getInputTreeArray('0');
      expect(value).to.deep.equal(['0']);
    });

    it('5 + 10', () => {
      const value = calcUtil.getInputTreeArray('5 + 10');
      expect(value).to.deep.equal(['5', ' ', '+', ' ', '1', '0']);
    });

    it('45+(1250*100)/1', () => {
      const value = calcUtil.getInputTreeArray('45+(1250*100)/1');
      expect(value).to.deep.equal(
        [
          '4',
          '5',
          '+',
          [
            '1',
            '2',
            '5',
            '0',
            '*',
            '1',
            '0',
            '0',
            ')',
            '/',
            '1'
          ]
        ]
      );
    });
    it('0+(12+(2+(3+(1+7', () => {
      const value = calcUtil.getInputTreeArray('0+(12+(2+(3+(1+7');
      // console.log(value);
      expect(value).to.deep.equal(
        [
          '0',
          '+',
          [
            '1',
            '2',
            '+',
            [
              '2',
              '+',
              [
                '3',
                '+',
                [
                  '1',
                  '+',
                  '7'
                ]
              ]
            ]
          ]
        ]
      );
    });
    it('( 1 + (5 + 2)) + ( 1 - ( 5 - 1) )', () => {
      const value = calcUtil.getInputTreeArray('( 1 + (5 + 2)) + ( 1 - ( 5 - 1) )');
      // console.log(value);
      expect(value).to.deep.equal(
        [
          [
            ' ',
            '1',
            ' ',
            '+',
            ' ',
            [
              '5',
              ' ',
              '+',
              ' ',
              '2',
              ')',
              ')',
              ' ',
              '+',
              ' ',
              [
                ' ',
                '1',
                ' ',
                '-',
                ' ',
                [
                  ' ',
                  '5',
                  ' ',
                  '-',
                  ' ',
                  '1',
                  ')',
                  ' ',
                  ')'
                ]
              ]
            ]
          ]
        ]
      );
    });
    it('435345.11232152151', () => {
      const value = calcUtil.getInputTreeArray('435345.11232152151');
      // console.log(value);
      expect(value).to.deep.equal(
        [
          '4',
          '3',
          '5',
          '3',
          '4',
          '5',
          '.',
          '1',
          '1',
          '2',
          '3',
          '2',
          '1',
          '5',
          '2',
          '1',
          '5',
          '1'
        ]
      );
    });
  });
  it('5/4-3+1', () => {
    const value = calcUtil.getInputTreeArray('5/4-3+1');
    expect(value).to.deep.equal(
      [
        '5',
        '/',
        '4',
        '-',
        '3',
        '+',
        '1'
      ]
    );
  });
  it('45.999....+......', () => {
    const value = calcUtil.getInputTreeArray('45.999....+......');
    expect(value).to.deep.equal(
      [
        '4',
        '5',
        '.',
        '9',
        '9',
        '9',
        '.',
        '.',
        '.',
        '.',
        '+',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.'
      ]
    );
  });
});
