import React from 'react';
import { findDOMNode } from 'react-dom';
import {Spring} from 'react-motion';
var range = require('lodash/utility/range');
import styles from './_Demo.css';

const Demo = React.createClass({
  getInitialState() {
    return {mouse: [250, 300]};
  },

  componentDidMount() {
    const rect = findDOMNode(this).getBoundingClientRect();
    this.setState({
      left: rect.left,
      top: rect.top
    })
  },

  handleMouseMove({pageX, pageY}) {
    this.setState({mouse: [pageX-this.state.left, pageY-this.state.top]});
  },

  handleTouchMove({touches}) {
    this.handleMouseMove(touches[0]);
  },

  getValues(currentPositions) {
    // currentPositions of `null` means it's the first render for Spring
    if (currentPositions == null) {
      return {val: range(6).map(() => [0, 0])};
    }
    const endValue = currentPositions.val.map((_, i) => {
      // hack. We're getting the currentPositions of the previous ball, but in
      // reality it's not really the "current" position. It's the last render's.
      // If we want to get the real current position, we'd have to compute it
      // now, then read into it now. This gets very tedious with this API.
      return i === 0 ? this.state.mouse : currentPositions.val[i - 1];
    });
    return {val: endValue, config: [120, 17]};
  },

  render() {
    return (
      <Spring endValue={this.getValues}>
        {({val}) =>
          <div
            style={{
              height: 400
            }}
            className="demo1"
            onMouseMove={this.handleMouseMove}
            onTouchMove={this.handleTouchMove}>
              {val.map(([x, y], i) =>
                <div
                  key={i}
                  className={styles.demo1Ball + ' ' + styles[`ball-${i}`]}
                  style={{
                    WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                    transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                    zIndex: val.length - i,
                  }} />
              )}
          </div>
        }
      </Spring>
    );
  },
});

export default Demo;
