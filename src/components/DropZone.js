import React, {forwardRef, useCallback, useImperativeHandle} from 'react';
import {useDropzone} from 'react-dropzone';
import {primary5} from '../utils/colors';
import fileListSource from '@tabcat/file-list-source';
import {useDispatch} from 'react-redux';
import {setStatus} from '../actions/tempData';
import {delay, getPercent} from '../utils/Utils';
import {FileDragBlock} from './FileDragBlock';

export function DropZone({children, sharedFs, currentDirectory}, ref) {
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
      const listSource = fileListSource(acceptedFiles, {preserveMtime: true});
      const totalSize = acceptedFiles.reduce((prev, cur) => cur.size + prev, 0);

      try {
        await sharedFs.current.upload(currentDirectory, listSource, {
          progress: (length) => {
            dispatch(
              setStatus({
                message: `[${getPercent(length, totalSize)}%] Uploading files`,
              }),
            );
          },
        });
        dispatch(setStatus({}));
      } catch (e) {
        // will add sharedFs.canWrite method later for richer ux
        dispatch(
          setStatus({
            message: `Missing write permissions.`,
            isError: true,
          }),
        );
        delay(4000).then(() => dispatch(setStatus({})));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDirectory],
  );

  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    onDrop,
    noClick: true,
  });

  useImperativeHandle(ref, () => ({
    openUpload: () => {
      open();
    },
  }));

  return (
    <div {...getRootProps()} style={styles.container} id={'dropZone'}>
      <input {...getInputProps()} id={'fileUpload'} />
      {isDragActive ? <FileDragBlock isActive={true} /> : <div>{children}</div>}
    </div>
  );
}

DropZone = forwardRef(DropZone);
