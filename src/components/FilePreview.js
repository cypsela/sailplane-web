import React from 'react';

const styles = {
  image: {
    width: 300,
  }
}

export function FilePreview({blob, filename}) {
  console.log('blo', blob, filename);
  const fileParts = filename.split('.');
  const ext = fileParts[fileParts.length - 1];
  const objURL = window.URL.createObjectURL(blob);

  return (
    <div onClick={(event)=>event.stopPropagation()}>
      {['jpg', 'jpeg', 'png', 'gif'].includes(ext) ? (
        <div>
          <img src={objURL} style={styles.image}/>
        </div>
      ) : null}
    </div>
  );
}
