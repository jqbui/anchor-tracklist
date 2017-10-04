import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 10vh;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.8);
  color: white;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2vmax;
  font-family: Pangolin;
  max-width: 40vh;
  text-align: center;
  text-overflow: ellipsis;
`;

const Button = styled.button`
  background: transparent;
  ${props => props.left ? `
    left: 8px;
    background-image: url(${'left-arrow.png'});
  ` : props.right ? `
    right: 8px;
    background-image: url(${'right-arrow.png'});
    ` : ''}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  top: 0;
  position: absolute;
  height: 100%;
  width: 7vh;
  border: none;
  z-index: 1;
  padding: 0;
`;

class Header extends Component {
  render() {
    const { leftButton, rightButton, onLeftButtonClick, onRightButtonClick } = this.props;
    return (
      <HeaderWrapper>
        {leftButton ? (
          <Button onClick={onLeftButtonClick} left />) : null
        }
        <Title>{this.props.title}</Title>
        {rightButton ? (
          <Button onClick={onRightButtonClick} right />) : null
        }
      </HeaderWrapper>
    );
  }
}

Header.PropTypes = {
  title: PropTypes.string,
  leftButton: PropTypes.bool,
  rightButton: PropTypes.bool,
  onLeftButtonClick: PropTypes.func,
  onRightButtonClick: PropTypes.func,
};

export default Header;
