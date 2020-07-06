import {FileItem} from './components/FileItem';
import {DropZone} from './DropZone';
import React, {useRef} from 'react';
import {primary2, primary35} from './colors';
import {FolderTools} from './FolderTools';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {StatusBar} from './StatusBar';
import {ShareDialog} from './ShareDialog';

const styles = {
  container: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Open Sans',
    boxSizing: 'border-box',
    height: '100%',
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
  files: {
    backgroundColor: '#FFF',
  },
  dropContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 2,
    opacity: 1,
  },
};

export function FileBlock({
  sharedFs,
  ipfs,
  directoryContents,
  setCurrentDirectory,
  currentDirectory,
}) {
  const dropzoneRef = useRef(null);
  const sortedContents = directoryContents.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  const directories = sortedContents.filter((item) => item.type === 'dir');
  const files = sortedContents.filter((item) => item.type !== 'dir');
  const fullFileList = directories.concat(files);

  const pathSplit = currentDirectory.split('/');
  const parentSplit = pathSplit.slice(0, pathSplit.length - 1);
  const parentPath = parentSplit.join('/');

  return (
    <div style={styles.container}>
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
        <div style={{...styles.fileHeaderItem, textAlign: 'right'}}>Size</div>
        <div style={styles.fileHeaderItem}></div>
      </div>
      <div style={styles.dropContainer}>
        <DropZone
          sharedFs={sharedFs}
          currentDirectory={currentDirectory}
          ref={dropzoneRef}>
          <DragDropContext
            onDragEnd={async (draggable) => {
              if (draggable.combine) {
                const filePathSplit = draggable.draggableId.split('/');
                const fileName = filePathSplit[filePathSplit.length - 1];

                await sharedFs.current.move(
                  draggable.draggableId,
                  draggable.combine.draggableId,
                  fileName,
                );
              }
            }}>
            <Droppable
              droppableId="droppable-1"
              type="fileblock"
              isCombineEnabled={true}>
              {(provided, snapshot) => (
                <div style={styles.filesContainer}>
                  {currentDirectory !== '/r' ? (
                    <FileItem
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
                      <p>drag files to upload</p>
                    ) : (
                      <div style={styles.files}>
                        {fullFileList.map((fileItem, index) => (
                          <FileItem
                            fileIndex={index + 1}
                            key={fileItem.path}
                            data={fileItem}
                            sharedFs={sharedFs}
                            ipfs={ipfs}
                            setCurrentDirectory={setCurrentDirectory}
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
      <ShareDialog sharedFs={sharedFs}/>
    </div>
  );
}
