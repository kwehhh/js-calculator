import Spawn, { Mount } from '@unfocused/spawn';
import App from './App.ts';

Mount(document.body, new App({
  input: '5 + 10'
}));
