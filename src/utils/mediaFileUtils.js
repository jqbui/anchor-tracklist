// Utils used to parse what the media file is

// This works for the given URLs but definitely needs to be scaled
export function getFileExtension(url) {
  return url.split('?')[0].split('.').pop();
}

// Video, audio
// This works for the given URLs but is definitely incorrect overall
export function getMediaType(extension) {
  switch(extension) {
    case 'mp3':
    case 'm4a':
    case 'ogg':
    case 'oga':
      return 'audio';
    case 'm4v':
      return 'video';
    default:
      return null;
  }
}
