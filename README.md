# anchor-tracklist
Anchor tracklist coding challenge - by Thai Bui

Live demo: https://anchor-tracklist.paperplane.io

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
The biggest question to solve was how to seamlessly switch from one track to another. On a fast internet connection, rerendering `video` and `audio` tags given a next media url and autoplaying them seemed sufficient, but when throttling the connection to a slower 3G connection, the rerender and initial loading of the media after it updated was the biggest bottleneck. Attributes like `autoplay` and `preload` were moot since that would occur only on the initial source, and not dynamically inserted sources. So the core painpoint I tackled was how to preload that next media source so that the transition occurs seamlessly without buffering. Since browsers load the `src` or `href` properties of certain elements when they are compiled into the DOM, and I was using React, my solution was to render `preload` elements for each media source.

One initial idea was to render the entire tracklist into audio and video tags at once, and only display and play the current one the user was on. However, this would be really inefficient, as if all of the elements were loaded into memory at once, all of the tracks would be loading in parallel. I then thought about having two elements, one 'showing' and one 'fetching' the next track, but that would be a really convoluted thing to do, especially in React, and a user would only be able to fetch two streams into memory at once. I then looked for some HTML5 video libraries, and although some did help with performance, none of them solved the prefetching issue.

I decided to go with using one standard `<video>` player, and preloading technique by [dynamically creating elements](https://developers.google.com/web/updates/2016/03/link-rel-preload). All of this logic is within the MediaController component, which controls the media player. Whenever a track got near the end (around 67% of the way through), the component checks the next track and begins fetching its data. [Audio tags have a JS constructor](https://stackoverflow.com/questions/31060642/preload-multiple-audio-files) and I initially built those by saving those into a cache object in the component. I didn't want to do the same with `video` tags, so I used [link loading](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload) for that. When the player reached onEnd, it changes its `src` to the next track, and the browser can fetch the track from its cache. Throttling the connection and using the app in Chrome confirmed that the requests were being made, and the next track begin slightly buffered.

The rest of the application is a fairly standard React/Redux application. The Redux state holds the tracks and the AppState. I added a notification that appears underneath the header when the next track is about to appear. Actions to change the current track are sent by the player and the arrow buttons; this is functional to change the player to play on any track in the list, so a next easy component to build would be a TrackList where users can directly select a track. I used the React library styled-components for inline stylings because inline styles are in-fashion. 

After testing, I mistakenly realized mobile browsers don't play HTML5 video players the same way desktop browsers do (the component is static, clicking to play an audio file opens a blank video in full screen). So using a video for everything  wasn't the best idea. Autoplaying is also disabled on many device browsers due to data concerns. The page is otherwise responsive. So next steps would be to indeed have to rerender the player to be either audio or video depending on the track, or some library that can do both with different stylings. Preloading done this way is also still pretty inefficient, because if the client decides to preload a file, it has no knowing of the size of the file, and it will download til end, even if the user never accesses the data in the interface.

Thus the most interesting thing that I'd do more work into learning is Manual Buffering (bottom of [this link](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload)). This allows the client full control into the exact duration of data to pull using a Range parameter in the request header:
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

These buffers can be saved into a cache and then directly connected into a player accessing them. This would allow an application like this to not only fetch only the beginning of data, but to account for common user actions like *quickly scrolling through the entire feed* to find something they're interested in. Abstracting this to a 'tracklist' at large would be a great library to have.
