import 'tslib';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApplicationComponent from './components/ApplicationComponent';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';

import './app.scss';
import './styleguide.scss';

ReactDOM.render(
  <div>
    <ApplicationComponent />
  </div>
  ,
  document.querySelector('#app'),
);
