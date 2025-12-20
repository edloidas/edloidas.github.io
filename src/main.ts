import './styles/main.css';
import { initBackground } from './canvas/background';

const canvas = document.getElementById('background') as HTMLCanvasElement;
if (canvas) {
  initBackground(canvas);
}
