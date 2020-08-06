import {DropZone} from './DropZone';
import React, {useEffect, useRef, useState} from 'react';
import {primary2, primary35} from '../utils/colors';
import {FolderTools} from './FolderTools';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {StatusBar} from './StatusBar';
import {ShareDialog} from './ShareDialog';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';
import {DraggableFileItem} from './DraggableFileItem';
import {
  filterImageFiles,
  getBlobFromPath,
  getBlobFromPathCID,
  getFileExtensionFromFilename,
  getPercent,
  isFileExtensionImage,
  sortDirectoryContents,
  delay,
} from '../utils/Utils';
import {FileDragBlock} from './FileDragBlock';
import Lightbox from 'react-image-lightbox';
import {setStatus} from '../actions/tempData';
import {useDispatch} from 'react-redux';

const styles = {
  container: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Open Sans',
    boxSizing: 'border-box',
    height: '100%',
  },
  fileHeader: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${primary2}`,
    paddingBottom: 10,
    marginBottom: 4,
    userSelect: 'none',
  },
  fileHeaderItem: {
    width: '100%',
    color: primary35,
    fontSize: 12,
    letterSpacing: 1.08,
    textAlign: 'left',
  },
  files: {
    backgroundColor: '#FFF',
  },
  dropContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 2,
    opacity: 1,
    height: '100%',
    overflowY: 'auto',
  },
};

export function FileBlock({
  sharedFs,
  ipfs,
  directoryContents,
  setCurrentDirectory,
  currentDirectory,
}) {
  const isSmallScreen = useIsSmallScreen();
  const dropzoneRef = useRef(null);
  const fullFileList = sortDirectoryContents(directoryContents);
  const pathSplit = currentDirectory.split('/');
  const parentSplit = pathSplit.slice(0, pathSplit.length - 1);
  const parentPath = parentSplit.join('/');

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageURLS, setImageURLS] = useState(new Array(1000));
  const imageFiles = filterImageFiles(fullFileList);
  const dispatch = useDispatch();

  useEffect(() => {
    setImageURLS(new Array(1000));
  }, [currentDirectory]);

  useEffect(() => {
    const loadImages = async () => {
      if (imageURLS[0] || !isImageOpen) {
        return;
      }

      const imageURLSPromises = imageFiles.map(async (file) => {
        // const cid = await sharedFs.current.read(file.path);
        // const blob = await getBlobFromPathCID(
        //   cid,
        //   file.path,
        //   ipfs,
        //   (currentIndex, totalCount) => {
        //     dispatch(
        //       setStatus({
        //         message: `[${getPercent(
        //           currentIndex,
        //           totalCount,
        //         )}%] Loading previews`,
        //       }),
        //     );
        //   },
        // );
        const blob = await getBlobFromPath(sharedFs.current, file.path);
        dispatch(setStatus({}));
        return window.URL.createObjectURL(blob);
      });

      const tmpImageURLS = await Promise.all(imageURLSPromises);
      setImageURLS(tmpImageURLS);
    };

    loadImages();
  }, [imageFiles.length, isImageOpen, currentDirectory]);

  return (
    <div style={styles.container}>
      {isImageOpen && imageURLS[currentImageIndex] ? (
        <Lightbox
          mainSrc={imageURLS[currentImageIndex]}
          nextSrc={imageURLS[currentImageIndex + 1]}
          prevSrc={imageURLS[currentImageIndex - 1]}
          onMoveNextRequest={() => setCurrentImageIndex(currentImageIndex + 1)}
          onMovePrevRequest={() => setCurrentImageIndex(currentImageIndex - 1)}
          onCloseRequest={() => setIsImageOpen(false)}
        />
      ) : null}
      <FolderTools
        currentDirectory={currentDirectory}
        sharedFs={sharedFs}
        setCurrentDirectory={setCurrentDirectory}
        handleOpenUpload={() => {
          dropzoneRef.current.openUpload();
        }}
      />
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
      <div style={styles.dropContainer}>
        <DropZone
          sharedFs={sharedFs}
          currentDirectory={currentDirectory}
          ref={dropzoneRef}>
          <DragDropContext
            onDragEnd={async (draggable) => {
              const {combine, draggableId} = draggable;
              if (combine) {
                const fileName = sharedFs.current.fs.pathName(draggableId);
                if (
                  sharedFs.current.fs.content(combine.draggableId) !== 'dir'
                ) {
                  return;
                }

                try {
                  await sharedFs.current.move(
                    draggable.draggableId,
                    draggable.combine.draggableId,
                    fileName,
                  );
                } catch (e) {
                  dispatch(
                    setStatus({
                      message: `failed to move ${draggable.draggableId}`,
                      isError: true,
                    }),
                  );
                  delay(2000).then(() => dispatch(setStatus({})));
                }
              }
            }}>
            <Droppable
              droppableId="droppable-1"
              type="fileblock"
              isCombineEnabled={true}>
              {(provided, snapshot) => (
                <div style={styles.filesContainer}>
                  {currentDirectory !== '/r' ? (
                    <DraggableFileItem
                      fileIndex={0}
                      isParent={true}
                      key={parentPath}
                      data={{path: parentPath, type: 'dir'}}
                      sharedFs={sharedFs}
                      ipfs={ipfs}
                      setCurrentDirectory={setCurrentDirectory}
                    />
                  ) : null}
                  <div
                    ref={provided.innerRef}
                    style={
                      {
                        // backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey',
                      }
                    }
                    {...provided.droppableProps}>
                    {!directoryContents.length ? (
                      <FileDragBlock
                        handleOpenUpload={() => {
                          dropzoneRef.current.openUpload();
                        }}
                      />
                    ) : (
                      <div style={styles.files}>
                        {fullFileList.map((fileItem, index) => (
                          <DraggableFileItem
                            fileIndex={index + 1}
                            key={fileItem.path}
                            data={fileItem}
                            sharedFs={sharedFs}
                            ipfs={ipfs}
                            setCurrentDirectory={setCurrentDirectory}
                            onIconClicked={
                              isFileExtensionImage(
                                getFileExtensionFromFilename(fileItem.name),
                              )
                                ? () => {
                                    const newImageIndex = imageFiles.findIndex(
                                      (imageFile) =>
                                        imageFile.name === fileItem.name,
                                    );
                                    setCurrentImageIndex(newImageIndex);
                                    setIsImageOpen(true);
                                  }
                                : null
                            }
                          />
                        ))}
                      </div>
                    )}
                    <span
                      style={{
                        display: 'none',
                      }}>
                      {provided.placeholder}
                    </span>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </DropZone>
      </div>
      <StatusBar />
      <ShareDialog sharedFs={sharedFs} />
    </div>
  );
}
