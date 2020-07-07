import React, {useEffect, useState} from 'react';
import {fileToBlob} from '../utils/Utils';
import {primary45} from "../colors";

export function ImageGalleryBlock({file}) {
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
    },
  };

  async function getBlob() {
    try {
      const blob = await fileToBlob(file, (curr, total) => {
        setProgress(Math.round((curr/total)*100));
      });

      const objURL = window.URL.createObjectURL(blob);
      setURL(objURL);
    } catch (e) {
      console.log('err filetoblob', e);
    }
  }

  useEffect(() => {
    getBlob();
  }, []);
  return (
    <div style={styles.container}>
      <div style={styles.img}>{!url ? <div>{progress}%</div> : null}</div>
    </div>
  );
}
