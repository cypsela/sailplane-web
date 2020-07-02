import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {primary6} from './colors';
import fileListSource from '@tabcat/file-list-source';

export function DropZone({children, sharedFs, currentDirectory}) {
  const styles = {
    container: {
      cursor: 'pointer',
      padding: 10,
      textAlign: 'center',
      color: primary6,
      fontSize: 16,
      fontWeight: 200,
      fontFamily: 'MuseoModerno',
      outline: 0,
      userSelect: 'none',
      height: '100%',
    },
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const listSource = fileListSource(acceptedFiles);
      await sharedFs.current.upload(currentDirectory, listSource);
    },
    [currentDirectory],
  );
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true});

  return (
    <div {...getRootProps()} style={styles.container}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here...</p> : <div>{children}</div>}
    </div>
  );
}
