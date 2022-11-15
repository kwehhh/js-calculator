import { expect } from 'chai';
import calcUtil from '../src/util/calcUtil.ts';

describe('calcUtil', function () {
  describe('calculateTotal', () => {
    it('basic', () => {
      const value = calcUtil.calculateTotal('5 + 10');
      expect(value).to.equal('15');
    });

    it('deep nested', () => {
      const value = calcUtil.calculateTotal('10+(100-(80/2))+1');
      expect(value).to.equal('71');
    });
  });

  describe('formatTree', () => {
    it('single group', () => {
      const value = calcUtil.formatTree(['1', '1']);
      expect(value).to.deep.equal(['11']);
    });

    it('3 groups', () => {
      const value = calcUtil.formatTree(['1', '1', '+', '5', '0', '0']);
      expect(value).to.deep.equal(['11', '+', '500']);
    });
  });

  describe('formatTreeArrayToDisplay', () => {
    it('basic', () => {
      const value = calcUtil.formatTreeArrayToDisplay(['5', '+', '1', '0']);
      expect(value).to.equal('5 + 10');
    });

    it('nested', () => {
      const arr = calcUtil.getInputTreeArray('10+(80/2)+1');
      expect(arr).to.deep.equal([ '1', '0', '+', [ '8', '0', '/', '2' ], '+', '1' ]);
      const value = calcUtil.formatTreeArrayToDisplay(arr);
      expect(value).to.equal('10 + (80 / 2) + 1');
    });

    it('deep nested', () => {
      const arr = calcUtil.getInputTreeArray('10+(100-(80/2))+1');
      expect(arr).to.deep.equal([ '1', '0', '+', ['1', '0', '0', '-', [ '8', '0', '/', '2' ]], '+', '1' ]);
      const value = calcUtil.formatTreeArrayToDisplay(arr);
      expect(value).to.equal('10 + (100 - (80 / 2)) + 1');
    });
  });

  describe('getInputTreeArray', () => {
    it('Single Value', () => {
      const value = calcUtil.getInputTreeArray('0');
      expect(value).to.deep.equal(['0']);
    });

    it('Add Two Values', () => {
      const value = calcUtil.getInputTreeArray('5+10');
      expect(value).to.deep.equal(['5', '+', '1', '0']);
    });

    it('Nested Value', () => {
      const value = calcUtil.getInputTreeArray('5+10-(1+1)+1');
      expect(value).to.deep.equal(
        [
          '5',
          '+',
          '1',
          '0',
          '-',
          [
            '1',
            '+',
            '1'
          ],
          '+',
          '1'
        ]
      );
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
          ],
          '/',
          '1'
        ]
      );
    });

    it('Incomplete Parentheses', () => {
      const value = calcUtil.getInputTreeArray('0+(12+(2+(3+(1+7');
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

    it('(1+(5+2))+(1-(5-1))', () => {
      const value = calcUtil.getInputTreeArray('(1+(5+2))+(1-(5-1))');
      expect(value).to.deep.equal(
        [
          [
            '1',
            '+',
            [
              '5',
              '+',
              '2',
            ],
          ],
          '+',
          [
            '1',
            '-',
            [
              '5',
              '-',
              '1',
            ],
          ]
        ]
      );
    });

    it('435345.11232152151', () => {
      const value = calcUtil.getInputTreeArray('435345.11232152151');
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

  // describe('getFormattedInputTree', () => {
  //   it('no change', () => {
  //     const value = calcUtil.getFormattedInputTree(['5', ' ', '+', ' ', '1', '0']);
  //     expect(value).to.deep.equal(['5', ' ', '+', ' ', '1', '0']);
  //   });
  //   it('5', () => {
  //     const value = calcUtil.getFormattedInputTree(
  //       ['5', ' ', '+', ' ', '1', '0'],
  //       (arr, next, i) => {
  //         return 5;
  //       }
  //     );

  //     expect(value).to.equal(5);
  //   });
  // });

  describe('isOperator', () => {
    it('true', () => {
      const value = calcUtil.isOperator('+');
      expect(value).to.equal(true);
    });
    it('false', () => {
      const value = calcUtil.isOperator('4');
      expect(value).to.equal(false);
    });
  });

  describe('getInputGroups', () => {
    it('4', () => {
      const value = calcUtil.getInputGroups(['4']);
      expect(value).to.deep.equal(['4']);
    });

    it('5 + 10', () => {
      const value = calcUtil.getInputGroups(['5', ' ', '+', ' ', '1', '0']);
      expect(value).to.deep.equal(['5 ', '+', ' 10']);
    });
  });

  describe('formatToDisplayValue', () => {
    it('integer', () => {
      const value = calcUtil.formatToDisplayValue('5000');
      expect(value).to.equal('5,000');
    });

    it('integer + decimal', () => {
      const value = calcUtil.formatToDisplayValue('5000000.25');
      expect(value).to.equal('5,000,000.25');
    });
  });

  it('computeValue', () => {
    const value = calcUtil.computeValue(5, '+', 10);
    expect(value).to.equal(15);
  });

  it('getTotal', () => {
    const value = calcUtil.getTotal(['4', '+', '4']);
    expect(value).to.equal(8);
  });

  it('getLastTreeNode', () => {
    const value = calcUtil.getLastTreeNode(['4', '+', '4']);
    expect(value).to.deep.equal(['4', '+', '4']);
  });
});
