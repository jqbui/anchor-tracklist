/* Holds all Redux Actions for our Anchor App
 * The main two actions that require async calls are fetching the JSON data on initial render
 * and fetching the audio access in the URLs.
 * If more requests and more actions are added to the app, 
 * this directory should be split according to related action types. */

import { requestJSONFromUrl } from './api/requests';

// Our url to fetch
export const MEDIA_URL = 'https://s3-us-west-2.amazonaws.com/anchor-website/challenges/bsb.json';

// Action Types
export const INITIAL_DATA = 'INITIAL_DATA';
export const FETCHING_DATA = 'FETCHING_DATA';
export const NEXT_TRACK_ALERT = 'NEXT_TRACK_ALERT';
export const TRACK_FAILURE = 'TRACK_FAILURE';
export const UPDATE_CURRENT_TRACK = 'UPDATE_CURRENT_TRACK';

// Action to call when app is accessing render-blocking critical data
function fetchingData(isFetching) {
  return {
    type: FETCHING_DATA,
    isFetching,
  };
}

// Action to reduce after initial request
function updateURLs(data) {
  return {
    type: INITIAL_DATA,
    tracks: data.tracks,
    isFetching: false,
  };
}

// Alert when a next track is happening
export function alertNextTrack(trackIdx) {
  return {
    type: NEXT_TRACK_ALERT,
    trackIdx,
  }
}

// update next track
// This does not do any loading in redux -- all handled by mediacontroller
export function updateCurrentTrack(trackIdx) {
  return {
    type: UPDATE_CURRENT_TRACK,
    trackIdx,
  }
}

// Failure to load track URL
export function reportTrackLoadError(blob, trackIdx) {
  return {
    type: TRACK_FAILURE,
    trackIdx,
  };
}

// On page load get the JSON
export function fetchInitialUrls() {
  return (dispatch) => {
    dispatch(fetchingData(true));
    return requestJSONFromUrl(MEDIA_URL).then(data => {
      dispatch(updateURLs(data));
    }).catch(err => {
      // Currently just show no tracks when there isn't data.
      // Should have better error handling UI
      dispatch(updateURLs({ tracks: [] }));
    });
  }
}

// // Get media stream and store in redux as a blob()
// export function fetchMediaAndLoad(track, trackIdx) {
//   const { mediaUrl } = track;
//   return (dispatch) => {
//     return requestBlobFromUrl(mediaUrl).then(blob => {
//       dispatch(updateNextMediaBlob(blob, trackIdx));
//     }).catch(err => {
//       dispatch(reportTrackLoadError(trackIdx));
//     })
//   }
// }

