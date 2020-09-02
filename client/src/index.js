import 'react-tabs/style/react-tabs.css';

import './styles/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App';
import {BrowserRouter as Router} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
<Router>
    <App />
</Router>, document.getElementById('root'));


serviceWorker.unregister();
