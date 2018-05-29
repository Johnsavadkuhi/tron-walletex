import React from "react";


export function withTimers(WrapperComponent) {

  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.timeouts = [];
      this.intervals = [];
    }

    componentWillUnmount() {
      for (let timeout of this.timeouts) {
        clearTimeout(timeout);
      }

      for (let interval of this.intervals) {
        clearInterval(interval);
      }
    }

    setInterval = (func, interval) => {
      this.intervals.push(setInterval(func, interval));
    };

    setTimeout = (func, timeout) => {
      this.timeouts.push(setTimeout(func, timeout));
    };

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrapperComponent setInterval={this.setInterval} setTimeout={this.setTimeout} {...this.props} />;
    }
  };
}