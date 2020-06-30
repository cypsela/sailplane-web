import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {primary6} from './colors';

export function DropZone() {
  const styles = {
    container: {
      // border: '1px solid #DDD',
      padding: 10,
      borderRadius: 4,
      textAlign: 'center',
      color: primary6,
      fontSize: 16,
      fontWeight: 200,
      fontFamily: 'MuseoModerno',
    },
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()} style={styles.container}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
