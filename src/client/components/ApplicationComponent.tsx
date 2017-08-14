import * as React from 'react';
import LazyComponent from './LazyComponent';
import MenuComponent from './MenuComponent';
import OtherComponent from './OtherComponent';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';

export default class ApplicationComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <Router>
        <div>
          <MenuComponent />
          <div className="jumbotron">
            <Switch>
              <Route exact={true} path="/" render={() => <LazyComponent bundle="home" />} />
              <Route path="/others" component={OtherComponent} />
              <Route path="/:component" render={(route) => <LazyComponent bundle={route.match.params.component} />} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
