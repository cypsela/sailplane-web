import React, {useEffect, useState} from 'react';
import {fileToBlob, getPercent} from '../utils/Utils';
import {primary45} from '../utils/colors';

export function ImageGalleryBlock({file, onLoadURL, fileIndex, onClick}) {
  const [url, setURL] = useState(null);
  const [progress, setProgress] = useState(0);

  const styles = {
    container: {
      padding: 8,
      color: primary45,
      fontSize: 14,
    },
    img: {
      padding: 8,
      background: `center/cover url(${url})`,
      minWidth: 140,
      minHeight: 200,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      cursor: 'pointer',
    },
  };

  async function getBlob() {
    try {
      const blob = await fileToBlob(file, (curr, total) => {
        setProgress(getPercent(curr, total));
      });

      const objURL = window.URL.createObjectURL(blob);
      setURL(objURL);
      onLoadURL(objURL, fileIndex);
    } catch (e) {
      console.log('err filetoblob', e);
    }
  }

  useEffect(() => {
    getBlob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      <div
        className={'imageGalleryBlock'}
        style={styles.img}
        onClick={() => onClick()}>
        {!url ? <div>{progress}%</div> : null}
      </div>
    </div>
  );
}
