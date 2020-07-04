import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {primary5} from './colors';
import fileListSource from '@tabcat/file-list-source';
import {useDispatch, useSelector} from 'react-redux';
import {setStatus} from './actions/tempData';
import {encryptFile} from './utils/encryption';

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
  const encryptionKey = useSelector((state) => state.main.encryptionKey);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (encryptionKey) {
        console.log('encrypting')
        let encryptedFiles = [];

        for (let file of acceptedFiles) {
          const encryptedBlob = await encryptFile(file, encryptionKey.key);
          encryptedFiles.push(encryptedBlob);
          console.log('original', file);
          console.log('encrypted', encryptedBlob);
          // console.log('enc', encryptedBytes)
        }
        acceptedFiles = encryptedFiles;
      }

      dispatch(setStatus({message: 'Uploading'}));
      const listSource = fileListSource(acceptedFiles);
      await sharedFs.current.upload(currentDirectory, listSource);
      dispatch(setStatus({}));
    },
    [currentDirectory, encryptionKey],
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
