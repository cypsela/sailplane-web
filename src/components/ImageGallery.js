import React, {useState} from 'react';
import {ImageGalleryBlock} from './ImageGalleryBlock';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {filterImageFiles} from '../utils/Utils';

export default function ImageGallery({files}) {
  const styles = {
    container: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  };

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [fileURLS, setFileURLS] = useState(new Array(1000));

  const filteredFiles = filterImageFiles(files);

  return (
    <div style={styles.container}>
      {isImageOpen && fileURLS[currentFileIndex] ? (
        <Lightbox
          mainSrc={fileURLS[currentFileIndex]}
          nextSrc={fileURLS[currentFileIndex + 1]}
          prevSrc={fileURLS[currentFileIndex - 1]}
          onMoveNextRequest={() => setCurrentFileIndex(currentFileIndex + 1)}
          onMovePrevRequest={() => setCurrentFileIndex(currentFileIndex - 1)}
          onCloseRequest={() => setIsImageOpen(false)}
        />
      ) : null}
      {filteredFiles
        ? filteredFiles.map((imageFile, index) => (
            <ImageGalleryBlock
              key={index}
              file={imageFile}
              fileIndex={index}
              onClick={() => {
                if (fileURLS[index]) {
                  setCurrentFileIndex(index);
                  setIsImageOpen(true);
                }
              }}
              onLoadURL={(url) => {
                const tmpURLS = fileURLS;
                tmpURLS[index] = url;
                setFileURLS(tmpURLS);
              }}
            />
          ))
        : null}
    </div>
  );
}
