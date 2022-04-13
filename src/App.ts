import Spawn from '@unfocused/spawn';
import CONSTANT from './constants';
import Calculator from './subviews/Calculator';
import './App.scss';

const { COLOR_PALETTE } = CONSTANT;

export default class App {
  constructor() {

    const calcEl = Spawn();

    const caclApp = new Calculator({
      parentEl: calcEl
    });

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
                // #ff1f71
                //#ff3d84
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
            // fontSize: '14px',
            fontSize: 12,
            marginTop: 8,
            marginBottom: 10
          }
        }),
        calcEl,
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
      ],
      // style: {
      //   color: COLOR_PALETTE.WHITE_00,
      //   fontSize: 16,
      //   display: 'flex',
      //   alignItems: 'center'
      // }
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
    document.body.style.fontFamily = `'Roboto', sans-serif`;
  }


  render() {

  }
}