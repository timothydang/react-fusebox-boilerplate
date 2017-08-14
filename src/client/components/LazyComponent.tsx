import * as React from 'react';
import { lazyLoad } from 'fuse-tools';

export default class LazyComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentWillReceiveProps(nextProps: any) {
    const name = nextProps.bundle;
    if (name) {
      this.lazyLoad(name);
    }
  }

  public componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  public renderLazyComponent() {
    if (this.state.LazyComponent) {
      const MyComponent = this.state.LazyComponent;
      return (
        <MyComponent />
      );
    }
    return null;
  }

  public async lazyLoad(name: any) {
    let target: any;
    if (name === 'about') {
      target = await import('../routes/about/AboutComponent');
    }
    if (name === 'home') {
      target = await import('../routes/home/HomeComponent');
    }
    if (name === 'contact') {
      target = await import('../routes/contact/ContactComponent');
    }
    this.setState({ LazyComponent: target.default });
  }

  public render() {
    return (
      <div>{this.renderLazyComponent()}</div>
    );
  }
}
