import { getFileExtension, getMediaType } from '../utils/mediaFileUtils';
import { combineReducers } from 'redux'
import {
  UPDATE_CURRENT_TRACK,
  INITIAL_DATA,
  FETCHING_DATA,
  NEXT_TRACK_ALERT,
  TRACK_FAILURE
} from '../actions/actions';

// Helper to ensure immutability
const update = (state, stateChange) => {
  return Object.assign({}, state, stateChange);
};

// Reducer for appState data
function appState(state = {}, action) {
  const isFetching = action.isFetching;
  switch(action.type) {
    case INITIAL_DATA:
      return update(state, { isFetching, curTrackIdx: 0 })
    case FETCHING_DATA:
      return update(state, { isFetching });
    case NEXT_TRACK_ALERT:
      return update(state, { alertNext: action.trackIdx }); 
    case UPDATE_CURRENT_TRACK:
      return update(state, { curTrackIdx: action.trackIdx, alertNext: null });
    default:
    return state;
  }
}

// Reducer to the tracks array
function tracks(state = [], action) {
  if (action.type === INITIAL_DATA) {
    const { tracks } = action;
    return tracks.map(track => {
      const fileExtension = getFileExtension(track.mediaUrl);
      const mediaType = getMediaType(fileExtension);
      return {
        mediaUrl: track.mediaUrl,
        title: track.title,
        imageUrl: track.imageUrl,
        fileExtension,
        mediaType,
        hasError: false,
      };
    });
  } else if (action.type === TRACK_FAILURE) {
    const { trackIdx } = action;
    return state.map((track, idx) => {
      if (idx === trackIdx) {
        return update({ hasError: true });
      }
      return track;
    });
  }
  return state;
}

// // Reducer to the nextMedia blob
// function nextMedia(state = null, action) {
//   if (action.type === NEXT_BLOB_LOADED) {
//     return update(state, {
//       nextDataSrc: action.blob
//     });
//   }
//   return state;
// }

const rootReducer = combineReducers({
  appState,
  tracks,
});

export default rootReducer;
