import * as React from 'react';
import { Link } from 'react-router-dom';

export default class MenuComponent extends React.Component<any, any> {
  public render() {
    return (
      <div className="header clearfix">
        <nav>
          <ul className="nav nav-pills pull-right">
            <li role="presentation"><Link to="/home">Home</Link></li>
            <li role="presentation"><Link to="/about">About</Link></li>
            <li role="presentation"><Link to="/contact" >Contact</Link></li>
          </ul>
        </nav>
      </div>
    );
  }
}
