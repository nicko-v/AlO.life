import styles            from './index.scss';
import styles_dark       from './index.dark.scss';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App               from './components/app/index.jsx';


ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
