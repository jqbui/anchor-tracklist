/* This folder holds methods that calls requests to our API server.
 * In Redux all API calls should be tied to the action, so this exists within the action directory.
 * In our case it's just an S3 bucket so the functionality is abstracted to take in any URL
 * but ideally this folder would hold the actual fetching of data between the DOM and Anchor's API. */

import fetch from 'isomorphic-fetch';

export function requestJSONFromUrl(url) {
  return fetch(url).then(response => {
    return response.json();
  });
}

export function requestBlobFromUrl(url) {
  return fetch(url).then(response => {
    return response.blob();
  });
}

