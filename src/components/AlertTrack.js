import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Slide = styled.div`
  background: rgba(0,0,0,.7);
  color: lightblue;
  font-style: italic;
  padding: 12px;
  margin: 0 12px;
  overflow: hidden;
  max-height: 0;
  position: absolute;
  top: 0;
  height: 36px;
  width:100%;
  transition-property: all;
  transition-duration: 1s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  ${props => props.slide ? 'max-height: 10vh;' : ''}
`

const Span = styled.span`
  font-style: normal;
  color: white;
`

class AlertTrack extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentDidMount() {
    this.setState({ show: true });
  }

  render() {
    const text = `${this.props.track.title}`
    return (
      <Slide slide={this.state.show}>
        <Span>Up next:</Span>&nbsp;
        {text}
      </Slide>
    );
  }
}

AlertTrack.PropTypes = {
  track: PropTypes.obj,
};

export default AlertTrack;
