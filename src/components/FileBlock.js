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
  filenameExt,
  getPercent,
  isImageFileExt,
  sortDirectoryContents,
  delay,
  alphabetical,
} from '../utils/Utils';
import {FileDragBlock} from './FileDragBlock';
import Lightbox from 'react-image-lightbox';
import {setStatus} from '../actions/tempData';
import {useDispatch} from 'react-redux';

const emptyImageURL = './empty.png';

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
  isEncrypted,
}) {
  const isSmallScreen = useIsSmallScreen();
  const dropzoneRef = useRef(null);
  const fullFileList = sortDirectoryContents(directoryContents);
  const pathSplit = currentDirectory.split('/');
  const parentSplit = pathSplit.slice(0, pathSplit.length - 1);
  const parentPath = parentSplit.join('/');
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [mainSrcURL, setMainSrcURL] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const updateTime = useRef({});
  const imagePath = useRef({});

  const dispatch = useDispatch();

  const isImageItem = ({ type, name }) => type === 'file' && isImageFileExt(filenameExt(name));

  const neighborImagePaths = (path) => {
    const imagePaths = fullFileList.filter(isImageItem).map(f => f.path);
    const neighborhood = [...new Set([...imagePaths, path])].sort(alphabetical);
    const index = neighborhood.indexOf(path);

    return {
      prev: neighborhood[(index + neighborhood.length - 1) % neighborhood.length],
      next: neighborhood[(index + 1) % neighborhood.length],
    };
  };

  const executer = (path, time) => (func) =>
    path === imagePath.current && time === updateTime.current && func();

  const handleUpdate = (exe) => (current, total) =>
    exe(() => setImageCaption(current === total ? '' : `Loading... [${getPercent(current, total)}%]`));

  const loadImagePath = async (path) => {
    const time = Date.now();
    imagePath.current = path;
    updateTime.current = time;
    const exe = executer(path, time);
    setMainSrcURL(null);


    exe(() => setImageTitle(sharedFs.current.fs.pathName(path)));
    const imageData = await sharedFs.current.cat(path, { handleUpdate: handleUpdate(exe) }).data();
    exe(() => setMainSrcURL(window.URL.createObjectURL(new Blob([imageData]))));
  };

  const setImageOpen = ({ path } = {}) => {
    path = path || null;
    path ? loadImagePath(path) : setMainSrcURL(path);
    setIsImageOpen(Boolean(path));
  };

  return (
    <div style={styles.container}>
      {isImageOpen && (
        <Lightbox
          prevSrc={emptyImageURL}
          nextSrc={emptyImageURL}
          mainSrc={mainSrcURL}
          onMovePrevRequest={() => loadImagePath(neighborImagePaths(imagePath.current)['prev'])}
          onMoveNextRequest={() => loadImagePath(neighborImagePaths(imagePath.current)['next'])}
          onCloseRequest={() => setImageOpen(false)}
          imageTitle={imageTitle}
          imageCaption={imageCaption}
        />
      )}
      <FolderTools
        currentDirectory={currentDirectory}
        sharedFs={sharedFs}
        setCurrentDirectory={setCurrentDirectory}
        isEncrypted={isEncrypted}
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
                              isImageItem(fileItem) ? () => setImageOpen(fileItem) : null
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
