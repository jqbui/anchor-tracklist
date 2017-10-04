import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaInterface from './MediaInterface';
import MediaController from './MediaController';
import styled from 'styled-components';

const MediaContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 100%;
`;

const Image = styled.img`
  max-height: 100%;  
  max-width: 100%; 
  width: auto;
  height: auto;
  position: absolute;  
  top: 0;  
  bottom: 0;  
  left: 0;  
  right: 0;  
  margin: auto;
`;

class MediaContainer extends Component {
  render() {
    const {
      imageUrl,
    } = this.props;
    return (
      <MediaContainerWrapper>
        {imageUrl ? (<Image src={imageUrl} />) : null}
        <MediaInterface center={!imageUrl}>
          <MediaController autoPlay={true} />
        </MediaInterface>
      </MediaContainerWrapper>
    );
  }
}

MediaContainer.propTypes = {
  imageUrl: PropTypes.string,
};

export default MediaContainer;