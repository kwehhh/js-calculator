import { Mount } from '@unfocused/spawn';
import App from './App.ts';

Mount(document.body, new App({
  input: '10+(100-(80/2))+1'
}));
