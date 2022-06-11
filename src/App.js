import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './routers/routes'

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            {
              Routes.map(({ path, component: C, access }) => {
                return (
                  <Route
                    exact
                    path={path}
                    key={Math.random()}
                    render={props => (
                      <C {...props} />
                    )}
                  />
                )
              })
            }
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
