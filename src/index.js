import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom';

// import App from './App';
import Login from './Components/login';
import Home from './Components/home';
import EditEntry from './Components/editEntry';

render(
  <HashRouter>
    <div className='mainContainer center'>
      <Route exact path='/' component={Login} />
      <Route path='/home' component={Home} />
      <Route path='/edit/:glean' component={EditEntry} />
    </div>
  </HashRouter>,
  document.getElementById('app')
);
