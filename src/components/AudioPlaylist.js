import React, {useEffect, useState} from 'react';
import 'react-image-lightbox/style.css';
import {
  fileToBlob,
  filenameExt,
  getPercent,
  isFileExtensionAudio,
  sortDirectoryContents,
} from '../utils/Utils';
import {NowPlaying} from './NowPlaying';
import {FileItem} from './FileItem';
import {primary2, primary35} from '../utils/colors';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';
import usePrevious from '../hooks/usePrevious';
import produce from 'immer';
import {useDispatch} from 'react-redux';
import {setStatus} from '../actions/tempData';
import {FiPauseCircle, FiPlayCircle} from 'react-icons/fi';

export default function AudioPlaylist({files, ipfs}) {
  const styles = {
    container: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    fileContainer: {
      width: '100%',
    },
    fileHeader: {
      marginTop: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${primary2}`,
      paddingBottom: 10,
      marginBottom: 4,
    },
    fileHeaderItem: {
      width: '100%',
      color: primary35,
      fontSize: 12,
      letterSpacing: 1.08,
      textAlign: 'left',
    },
  };

  const dispatch = useDispatch();
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [fileURLS, setFileURLS] = useState(new Array(1000));
  const [playing, setPlaying] = useState(false);
  const prevFileIndex = usePrevious(currentFileIndex);

  const filteredFiles = files
    ? files.filter((file) => {
        const ext = filenameExt(file.name);
        return isFileExtensionAudio(ext);
      })
    : null;
  const isSmallScreen = useIsSmallScreen();
  const sortedFiles = sortDirectoryContents(filteredFiles);

  useEffect(() => {
    const switchFile = async () => {
      if (prevFileIndex === currentFileIndex) {
        return;
      }

      if (!fileURLS[currentFileIndex]) {
        const file = sortedFiles[currentFileIndex];
        if (!file) {
          return;
        }
        const fileURL = await getBlob(file);

        const newFileURLS = produce(fileURLS, (tmpFileURLS) => {
          tmpFileURLS[currentFileIndex] = fileURL;
        });

        setFileURLS(newFileURLS);
      }
    };

    switchFile();
  }, [currentFileIndex, fileURLS, sortedFiles]);

  async function getBlob(file) {
    const blob = await fileToBlob(file, (curr, total) => {
      dispatch(
        setStatus({
          message: `[${getPercent(curr, total)}%] Downloading audio`,
        }),
      );
    });

    dispatch(setStatus({}));

    const objURL = window.URL.createObjectURL(blob);

    return objURL;
  }

  const currentFile = sortedFiles[currentFileIndex];
  const currentURL = fileURLS[currentFileIndex];

  const currentAudio = {
    filename: currentFile?.name,
    url: currentURL,
  };

  return (
    <div style={styles.container}>
      <NowPlaying currentAudio={currentAudio} setPlaying={setPlaying} />

      {sortedFiles ? (
        <div style={styles.fileContainer}>
          <div style={styles.fileHeader}>
            <div style={{...styles.fileHeaderItem, paddingLeft: 12}}>Name</div>
            {!isSmallScreen ? (
              <>
                <div style={{...styles.fileHeaderItem, textAlign: 'right'}}>
                  Size
                </div>
                <div style={{...styles.fileHeaderItem, textAlign: 'right'}}>
                  Modified
                </div>
              </>
            ) : null}

            <div style={styles.fileHeaderItem} />
          </div>
          {sortedFiles.map((file, fileIndex) => (
            <FileItem
              forceIcon={
                playing === true && currentFileIndex === fileIndex
                  ? FiPauseCircle
                  : FiPlayCircle
              }
              data={file}
              setCurrentDirectory={() => {}}
              readOnly={true}
              ipfs={ipfs}
              onIconClicked={() => {
                if (fileIndex !== currentFileIndex) {
                  setCurrentFileIndex(fileIndex);
                }
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
