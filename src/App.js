import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchInitialUrls, updateCurrentTrack } from './actions/actions';
import AlertTrack from './components/AlertTrack';
import Header from './components/Header';
import PageWrapper from './components/PageWrapper';
import PageContent from './components/PageContent';
import MediaContainer from './components/MediaContainer';
import Spinner from './components/Spinner';

class App extends Component {
  componentDidMount() {
    // Client side initial fetch here.
    this.props.dispatch(fetchInitialUrls());
  }

  navigateTo(idx) {
    this.props.dispatch(updateCurrentTrack(idx));
  }

  render() {
    const { isFetching, tracks, alertNext, curTrackIdx } = this.props;
    const curTrack = tracks && tracks.length ? tracks[curTrackIdx] : null;
    const headerTitle = curTrack ? curTrack.title : isFetching ? 'Loading...' : 'No track playing.';
    return (
      <PageWrapper>
        <Header
          title={headerTitle}
          leftButton={curTrackIdx > 0}
          rightButton={curTrackIdx < (tracks.length - 1)}
          onLeftButtonClick={() => { this.navigateTo(curTrackIdx - 1); }}
          onRightButtonClick={() => { this.navigateTo(curTrackIdx + 1); }}
        />
        <PageContent>
          {isFetching ? (
            <Spinner />
          ) : curTrack ? (
            <MediaContainer
              imageUrl={curTrack.mediaType === 'audio' ? curTrack.imageUrl : null}
            />
          ) : (
            <h2>Whoops! Something went wrong.</h2>
          )}
          {alertNext ? (<AlertTrack track={tracks[alertNext]} />) : null}
        </PageContent>
      </PageWrapper>
    );
  }
}

App.PropTypes = {
  dispatch: PropTypes.func,
  isFetching: PropTypes.bool,
  tracks: PropTypes.array,
  curTrackIdx: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { tracks, appState } = state;
  const { isFetching, alertNext, curTrackIdx } = appState;
  return {
    tracks,
    isFetching,
    alertNext,
    curTrackIdx,
  };
}

// Connect this component to the redux store
export default connect(mapStateToProps)(App);
