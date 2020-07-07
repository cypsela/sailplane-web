import React from 'react';
import {
  getFileExtensionFromFilename,
  isFileExtensionAudio,
  isFileExtensionImage,
} from '../utils/Utils';

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

export const FilePreview = React.memo(({blob, filename}) => {
  const ext = getFileExtensionFromFilename(filename);
  const objURL = window.URL.createObjectURL(blob);

  return (
    <div onClick={(event) => event.stopPropagation()} style={styles.container}>
      {isFileExtensionImage(ext) ? (
        <div>
          <img src={objURL} style={styles.image} />
        </div>
      ) : null}
      {isFileExtensionAudio(ext) ? (
        <div>
          <audio controls>
            <source src={objURL} style={styles.audio} />
          </audio>
        </div>
      ) : null}
    </div>
  );
});
