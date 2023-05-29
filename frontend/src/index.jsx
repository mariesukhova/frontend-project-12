import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import runApp from './init';

const app = async () => {
  const vdom = await runApp();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(vdom);
};

app();
