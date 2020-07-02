import React from 'react';

const styles = {
  image: {
    width: 300,
  },
  audio: {
    userSelect: 'none',
    outline: 0,
  }
};

export function FilePreview({blob, filename}) {
  const fileParts = filename.split('.');
  const ext = fileParts[fileParts.length - 1];
  const objURL = window.URL.createObjectURL(blob);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      {['jpg', 'jpeg', 'png', 'gif'].includes(ext) ? (
        <div>
          <img src={objURL} style={styles.image} />
        </div>
      ) : null}
      {['mp3', 'wav', 'ogg', 'flac'].includes(ext) ? (
        <div>
          <audio controls>
            <source src={objURL} style={styles.audio}/>
          </audio>
        </div>
      ) : null}
    </div>
  );
}
