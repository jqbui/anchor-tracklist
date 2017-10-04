# anchor-tracklist
Anchor tracklist coding challenge - by Thai Bui

Live demo: http://anchor-tracklist.paperplane.io

Given a JSON list of audio and video files to fetch, this webpage displays a single application page and plays the tracks in order, with the ability to play, pause, and skip by track. The title and forward/back buttons are located in the header. The media player plays both audio and video; the audio files are shown with the image of the audio whereas video is centered on the page.

## Installation

The boilerplate used was Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app). With node installed, extract or clone the repo to a repository and run
```
npm install
npm start
```
which will open localhost:3000 in your browser. For a production build, install `npm install -g serve` if needed and run
```
npm run build
serve -s build
```

## Description
The biggest question to solve was how to seamlessly switch from one track to another. On a fast internet connection, rerendering `<video>` and `<audio>` tags for each successive media url and autoplaying them seemed sufficient, but when throttling the connection to a slower 3G connection, the rerender and initial loading of the media after it updated was the biggest bottleneck. Attributes like `autoplay` and `preload` were moot since that would occur only on the initial source, and not dynamically inserted sources. So the core painpoint I tackled was "How to preload and stream a media source such that the transition occurs seamlessly without buffering". Since browsers load the `src` or `href` properties of certain elements when they are compiled into the DOM, and I'm using React, my solution was to render elements that would 'preload' on compile time for each media source.

One initial idea was to render the entire tracklist into audio and video tags at once, and only display and play the current one the user was on. However, this would be really inefficient, since if all of the elements were loaded into memory at once, all of the tracks would be loading in parallel. Another solution was to have two elements, one 'showing' and one 'fetching' the next track, and swapping renders and handlers between the two in the DOM. That seemed really convoluted to do, especially in React, and a user would only be able to fetch two streams into memory at once. I then looked for some HTML5 video libraries, and although some did help with performance, none of them solved the prefetching issue.

## Solution

I decided to use one standard `<video>` player, and preload via [dynamically creating elements](https://developers.google.com/web/updates/2016/03/link-rel-preload). All of this logic is within the `src/components/<MediaController>` component, which controls the media player. Whenever a track nears the end of its duration (around 67% of the way through), the component reads the next track and begins fetching its mediaURL. [Audio tags have a JS constructor](https://stackoverflow.com/questions/31060642/preload-multiple-audio-files) and for the audio tags I initially solved their use case by creating these objects into a cache object. I didn't want to do the same with `video` tags, so I used [link loading](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload): a recommendation by Google for preloading resources while the DOM is still compiling, such that on render. the resources will be available. This also works dyamically, however.

When the player fires `onEnd()`, it changes its `src` url to the next track's url, and immediately autoplays. If the src has been cached by the browser previously, it begins reading from the cache. Throttling the connection and using the app in Chrome confirmed that these preload requests are fetching and readying the next track at a slightly more buffered state.

The rest of the application is a fairly standard React/Redux application. The Redux state holds the tracklist and the AppState. I added a notification that appears underneath the header when the next track is about to appear. Actions to change the current track are sent by the player and the arrow buttons. This action can switch to *any* track in the list, so a very easy component to build next would be a `<TrackList>` where users can directly select a track.

I used the React library `styled-components` for inline stylings because [inline styles are in-fashion](https://speakerdeck.com/vjeux/react-css-in-js). (And because I 100% agree with the points outlined in that powerpoint)

## Mistakes

I built the application with repsonsiveness in mind, but after testing, I mistakenly realized mobile browsers don't play HTML5 video players the same way desktop browsers do (the component is static, clicking to play an audio file opens a blank video in full screen). So using `<video>` for everything  wasn't the best idea. Autoplaying is also disabled on many device browsers due to data concerns. The page is otherwise responsive.

Next steps would be to accept the fact the player needs to rerender for audio or video depending on the track, or some library that can do both with different stylings.

My method of preloading is also pretty inefficient: if the client decides to preload a file, it cannot determine the size of the file, and the request will continue until end, even if the user never accesses the data in the interface.

Thus the most interesting thing that I'd do is learning Manual Buffering (bottom of [this link](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload)). This allows the client full control into the exact segments of the file to fetch by using a Range parameter in the request header:
```
const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');
// Fetch beginning of the video by setting the Range HTTP request header.
fetch('file.webm', { headers: { range: 'bytes=0-567139' } })
.then(response => response.arrayBuffer())
.then(data => {
  sourceBuffer.appendBuffer(data);
  sourceBuffer.addEventListener('updateend', updateEnd, { once: true });
});
```

These buffers can be saved into a cache and then directly connected into a player accessing them. This would allow an application like this to not only fetch only the beginning of data, but to account for common user actions like when someone *quickly scrolling through the entire feed* to find something they're interested in. Abstracting this to a 'tracklist' at large would be a great library to have.
