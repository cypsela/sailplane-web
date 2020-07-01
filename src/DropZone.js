import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {primary6} from './colors';
import fileListSource from '@tabcat/file-list-source';

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsBinaryString(file);
  });
}

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
      // console.log(acceptedFiles);
      //
      // for (let file of acceptedFiles) {
      //   const reader = await readFileAsync(file);
      //
      //   console.log(reader)
      // }

      // acceptedFiles.forEach((file) => {
      //   const reader = new FileReader()
      //   reader.readAsBinaryString(file);
      //
      //   console.log('res', reader)
      // })

      // const files = [
      //   {
      //     path: 'image.png',
      //     content: ipfs.types.Buffer.from(btoa(fr.result), 'base64'),
      //   },
      // ];
    },
    [currentDirectory],
  );
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()} style={styles.container}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here...</p> : <div>{children}</div>}
    </div>
  );
}
