import React, {useState} from 'react';
import {StatusBar} from './StatusBar';
import {primary45} from './colors';

const styles = {
  container: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  filename: {
    color: primary45,
    fontSize: 20,
  },
  downloadButton: {
    display: 'inline-block',
    backgroundColor: primary45,
    color: '#FFF',
    borderRadius: 4,
    padding: 12,
    marginTop: 10,
    cursor: 'pointer',
  },
};

export function DownloadPanel({ready, path, handleDownload, downloadComplete}) {
  const pathSplit = path.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const [downloadClicked, setDownloadClicked] = useState(false);

  return (
    <div style={styles.container}>
      <div>
        {ready ? (
          <div>
            <div style={styles.filename}>{name}</div>
            <div
              style={styles.downloadButton}
              onClick={() => {
                setDownloadClicked(true);
                handleDownload();
              }}>
              {downloadClicked && !downloadComplete ? 'Fetching download...' : 'Download now'}
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
      <StatusBar />
    </div>
  );
}
