import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { alertNextTrack, updateCurrentTrack } from '../actions/actions';

class MediaController extends Component {
  constructor(props) {
    super(props);
    // This is a stateless component; not using react state for safety
    this._curTrack = props.tracks[props.curTrackIdx];
    this._trackIdx = props.curTrackIdx;
    // Audio object to "cache" audio loads
    this._mediaCache = {};
    this._currentMediaEl = null;
  }

  componentDidMount() {
    this.switchPlayer(this._curTrack.mediaType);
    this._currentMediaEl.src = this._curTrack.mediaUrl;
    this.setListenersToCurrentPlayer();
    this.play();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.curTrackIdx !== this._trackIdx) {
      this._trackIdx = nextProps.curTrackIdx;
      this.jumpToTrack(nextProps.curTrackIdx);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  switchPlayer(mediaType) {
    // Sets the source to the stated mediaType, and removes
    // media from other tag
    if (this._currentMediaEl) {
      this.removeListenersToCurrentPlayer();
    }
    if (mediaType === 'audio') {
      this._currentMediaEl = this.refs._audioMediaEl;
      this.refs._videoMediaEl.src = '';
      this.refs._videoMediaEl.title = '';
      this.refs._videoMediaEl.style.display = 'none';
    } else {
      this._currentMediaEl = this.refs._videoMediaEl;
      this.refs._audioMediaEl.src = null;
      this.refs._audioMediaEl.title = null;
      this.refs._audioMediaEl.style.display = 'none';
    }
    this._currentMediaEl.style.display = 'block';
    this.setListenersToCurrentPlayer();
  }

  setListenersToCurrentPlayer() {
    const currentMedia = this._currentMediaEl;

    currentMedia.addEventListener('play', this.onPlay);
    currentMedia.addEventListener('ended', this.onEnded);
    currentMedia.addEventListener('pause', this.clearListenTrack);
  }

  removeListenersToCurrentPlayer() {
    const currentMedia = this._currentMediaEl;

    currentMedia.removeEventListener('play', this.onPlay);
    currentMedia.removeEventListener('ended', this.onEnded);
    currentMedia.removeEventListener('pause', this.clearListenTrack);
  }

  play() {
    this._currentMediaEl.play();
  }

  onPlay = (e) => {
    if (this._trackIdx < this.props.tracks.length - 1) {
      this.setListenTrack();
    }
    this.props.onPlay(e);
  }

  onEnded = (e) => {
    if (this.props.tracks.length > this._trackIdx + 1) {
      const idx = this._trackIdx + 1;
      this.jumpToTrack(idx);
      // Dispatch action to update rest of UI
      this.props.dispatch(updateCurrentTrack(idx));
      this.props.onEnded(e);
    }
  }

  // In lieu of a state change and rerender, this handler fires when
  // a track is jumped to from a dispatch
  jumpToTrack(idx) {
    this.clearListenTrack();
    const tracks = this.props.tracks;
    const track = tracks[idx];
    // Check if need to use other player
    if (track.mediaType !== this._curTrack.mediaType) {
      this.switchPlayer(track.mediaType)
    } 
    // If we can go to next track, this will autoplay quicker via browser cache
    // Either way, need to change the src of the media component
    this._currentMediaEl.src = track.mediaUrl;
    // Update our fields
    this._curTrack = tracks[idx];
    this._trackIdx = idx;
    // Asynchronously play
    this.play();
  }

  prefetchData() {
    // Audio objects stored in local array will "cache" data in browser
    const idx = this._trackIdx + 1;
    const nextTrack = this.props.tracks[idx];
    if (nextTrack && !this._mediaCache[idx]) {
      if (nextTrack.mediaType === 'audio') {
        this._mediaCache[idx] = new Audio();
        this._mediaCache[idx].src = nextTrack.mediaUrl;
      } else if (nextTrack.mediaType === 'video') {
        this._mediaCache[idx] = this.createLinkForPreload(nextTrack);
      }
    }
  }

  setListenTrack = () => {
    this.listenTracker = setInterval(() => {
      const { duration, currentTime } = this._currentMediaEl;
      if (!this._nextMedia && currentTime > (duration * .66)) {
        // prefetch data for src
        this.prefetchData();
        // dispatch an action to show update
        this.props.dispatch(alertNextTrack(this._trackIdx + 1));
        this.clearListenTrack();
      }
    }, 2000);
  }

  clearListenTrack = () => {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    }
  }

  // There is no "Video()" constructor for video tags, so link preloading will do
  // This acually probably is more efficient than audio
  // I'm pretty sure you can just load these objects wherever in the dom
  // Caching is better to try to implement but cross browser fxnality seems hard 
  createLinkForPreload(track) {
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "video";
    preloadLink.type = "video/mp4";
    preloadLink.href = track.mediaUrl;
    document.head.appendChild(preloadLink);
  }

  // Using video element means we only have to use one element
  createPlayerFromSource(type, refPointer) {
    return  createElement(type, {
      controls: true,
      preload: 'metadata',
      ref: refPointer,
      style: { 
        width: '100%',
        maxHeight: '90vh',
        display: 'none',
      },
    });
  };

  render() {
    return (
      <div>
        {this.createPlayerFromSource('audio', "_audioMediaEl")}
        {this.createPlayerFromSource('video', "_videoMediaEl")}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { tracks, appState } = state;
  return { tracks, curTrackIdx: appState.curTrackIdx };
}

MediaController.defaultProps = {
  autoPlay: true,
  onEnded: () => {},
  onPlay: () => {},
};

MediaController.propTypes = {
  autoPlay: PropTypes.bool,
  curTrackIdx: PropTypes.number.isRequired,
  dispatch: PropTypes.func,
  onEnded: PropTypes.func,
  onPlay: PropTypes.func,
  tracks: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(MediaController);
