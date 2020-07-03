import React from 'react';
import {getFileExtensionFromFilename} from '../utils/Utils';

const styles = {
  container: {
    marginTop: 10,
  },
  image: {
    width: 300,
  },
  audio: {
    userSelect: 'none',
    outline: 0,
  },
};

export function FilePreview({blob, filename}) {
  const ext = getFileExtensionFromFilename(filename);
  const objURL = window.URL.createObjectURL(blob);

  return (
    <div onClick={(event) => event.stopPropagation()} style={styles.container}>
      {['jpg', 'jpeg', 'png', 'gif'].includes(ext) ? (
        <div>
          <img src={objURL} style={styles.image} />
        </div>
      ) : null}
      {['mp3', 'wav', 'ogg', 'flac'].includes(ext) ? (
        <div>
          <audio controls>
            <source src={objURL} style={styles.audio} />
          </audio>
        </div>
      ) : null}
    </div>
  );
}
