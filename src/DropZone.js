import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {primary4, primary45, primary5, primary6} from './colors';
import fileListSource from '@tabcat/file-list-source';
import {useDispatch} from 'react-redux';
import {setStatus} from './actions/tempData';

export function DropZone({children, sharedFs, currentDirectory}) {
  const styles = {
    container: {
      cursor: 'pointer',
      textAlign: 'center',
      color: primary5,
      fontSize: 16,
      fontWeight: 200,
      fontFamily: 'Open Sans',
      outline: 0,
      userSelect: 'none',
      height: '100%',
    },
  };

  const dispatch = useDispatch();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      dispatch(setStatus({message: 'Uploading'}));
      const listSource = fileListSource(acceptedFiles);
      await sharedFs.current.upload(currentDirectory, listSource);
      dispatch(setStatus({}));
    },
    [currentDirectory],
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div {...getRootProps()} style={styles.container}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here...</p> : <div>{children}</div>}
    </div>
  );
}
