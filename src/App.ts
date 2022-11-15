import Spawn, { Mount } from '@unfocused/spawn';
import CONSTANT from './util/constants';
import Calculator from './subviews/Calculator';
import './App.scss';

const { COLOR_PALETTE } = CONSTANT;

/**
 * JS (JavaScript) Calculator @ v1.0.0
 *
 * Objectives/Constraints:
 *  - Easy Import and Customize into any App
 *  - Single JS file for entire setup (for CodePen.io demo use)
 *  - No External Libraries
 *  - No HTML tags or CSS selectors were harmed in the making of this exercise.
 *  - Theme Token Support
 *  - Desktop version only - if you want mobile I may add support
 *
 * Functionality:
 *  - Math calculator with nested level computation
 *
 * I/O:
 *  - Click buttons calculate
 *  - Press keyboard keys to calculate
 *    - Enter/Equals to computer / Backspace to remove last character
 *
 * References:
 *  UI Design {author} : https://dribbble.com/shots/6144137-Calculator-App-iOS-13
 *  CodePen: https://codepen.io/anthonykoch/pen/xVQOwb?editors=0010
 *   adsd : https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/
 *
 * https://codepen.io/giana/pen/GJMBEv (the animation is cool)
 * https://codepen.io/mjijackson/pen/xOzyGX (has cool scale technique when too many value)
 *
 *
 * want to see the src github? and the hisotical progression? go here url: .......
 *
 *  Comments/questions/requests? Feel free to reach out to me!
 *
 *
 * TODO:
 *  GROUPING
 *    - PRESERVE GROUPING of () when calculating result.....
 *    - CONTROL DEPTH LEVEL of IN AND OUT DIFFRENT GROYP LEVELS .. .NEED TESTS....
 *  DECIMAL HANDLING
 *    [done] Do not allow more than 1 decimal per number group
 * STYLE:
 * INPUT -- Operational colors should be white
 * on change theme, spin and shrink, then grow to normal size with new values.. (use the gear spin animation)
 * boost operator color diffs by 2x for hover, pressed
 * [done] don't show commas when adding input... and dont do for decimals..
 * [done] Update / Icon for divider
 * Add formatted to input and prev input -- addds commas, styles colors, adds spaces
 * = with no compute will just send to other value -- add animation like google calc example
 * C - To Clear all INPUT
 * Finish KEYBOARD redirect .. ENTER => EQUALS, EQUALS => EQUALS
 * CHange div symbol to /
 * Fix border radius on buttons and calculator
 * Get proper type face
 * Consider idea of making each button its own Class component -- potetnially reduce code/bloat/organization
 * [done] Get color states for op, equals, computer, clr (by 7% probably)
 * Finish Hover/Press colors on each key. ++ Update style based on the global events
 * [done] Make operator text color white
 * make current input color big
 * make input with colored operators (may already be done...);
 * - Style the input to make it pretty....
 * - add shadow ')' like google calc
 * Add operatiosn for e, pie sin, and deg
 */


// TODO
// key listener
// colors on operators
// add instructions on top of calc demo
// mybe some cool animatiosn
// more border radius on buttons


/**
 * JS Calculator
 *
 * Objectives/Constraints:
 *  - Easy Import and Customize into any App
 *  - Single JS file src
 *  - No External Libraries
 *
 * Functionality:
 *  - Math calculator with nested level computation
 *
 * References:
 *  UI Design {author} : https://dribbble.com/shots/6144137-Calculator-App-iOS-13/attachments/6144137-Calculator-App-iOS-13?mode=media
 *  CodePen: https://codepen.io/anthonykoch/pen/xVQOwb?editors=0010
 *   adsd : https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/
 */



// !! Keep entire file as single for Codepen

// TODO
// key listener
// colors on operators
// add instructions on top of calc demo
// mybe some cool animatiosn
// more border radius on buttons
export default class App {
  constructor(props = {}) {
    const calcAppContainer = Spawn();
    const caclApp = new Calculator(props);
    Mount(calcAppContainer, caclApp.el);

    // App Element
    const el = Spawn({
      className: 'app',
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLOR_PALETTE.WHITE_00
      },
      children: [
        Spawn({
          children: [
            Spawn({
              children: 'JS',
              style: {
                display: 'inline-flex',
                background: '#ff005e',
                color: 'white',
                width: 26,
                height: 26,
                fontSize: 14,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                marginRight: 6,
              }
            }),
            'Calculator'
          ],
          style:{
            color: COLOR_PALETTE.WHITE_00,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center'
          }
        }),
        Spawn({
          children: 'Use keyboard or click buttons to calculate!',
          style:{
            color: '#dddddd',
            fontSize: 12,
            marginTop: 8,
            marginBottom: 10
          }
        }),
        calcAppContainer,
        Spawn({
          children: [
            'Inspired by Nicat Manafov',
            ' @ ',
            Spawn({
              tag: 'a',
              href: 'https://dribbble.com/shots/6144137-Calculator-App-iOS-13',
              children: 'dribbble.com',
              style: {
                color: '#ff005e',
                textDecoration: 'none'
              },
              events: {
                mouseenter: (e, el) => el.style.color = '#ff3d84',
                mousedown: (e, el) => el.style.color = '#ff70a5',
                mouseup: (e, el) => el.style.color = '#ff3d84',
                mouseleave: (e, el) => el.style.color = '#ff005e'
              }
            })
          ],
          style:{
            color: '#ffffff',
            fontSize: 12,
            fontFamily: `'Dancing Script', cursive`,
            marginTop: 8,
            textAlign: 'center'
          }
        })
      ]
    });


    this.renderPageBackground();
    return el;
  }


  renderPageBackground() {
    // Import External Fonts
    [
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
      'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&family=MonteCarlo&family=Style+Script&display=swap'
    ].forEach(href => {
      Spawn({
        parentEl: document.head,
        tag: 'link',
        rel: 'stylesheet',
        type: 'text/css',
        href
      });
    });

    // Custom App Styles
    // from : https://www.eggradients.com/category/purple-gradient
    document.body.style.backgroundColor = '#a4508b';
    document.body.style.backgroundImage = 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)';
    document.body.style.margin = 0;
    document.body.style.fontFamily = `'Roboto', sans-serif`;
  }
}
