import {Breadcrumb} from './components/Breadcrumb';
import {FileItem} from './components/FileItem';
import {DropZone} from './DropZone';
import React from 'react';
import {primary2, primary5} from './colors';
import {FolderTools} from './FolderTools';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

const styles = {
  container: {
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'hidden',
  },
  fileHeader: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${primary2}`,
    paddingBottom: 10,
    marginBottom: 4,
    fontFamily: 'Open Sans',
  },
  fileHeaderItem: {
    width: '100%',
    color: primary5,
    fontSize: 14,
  },
  files: {
    overflowY: 'auto',
    height: '100%',
    boxSizing: 'content-box',
  },
};

export function FileBlock({
  sharedFs,
  ipfs,
  directoryContents,
  setCurrentDirectory,
  currentDirectory,
}) {
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


      <FolderTools currentDirectory={currentDirectory} sharedFs={sharedFs} setCurrentDirectory={setCurrentDirectory}/>
      <div style={styles.fileHeader}>
        <div style={{...styles.fileHeaderItem, marginLeft: 8}}>Name</div>
        <div style={styles.fileHeaderItem}>Modified</div>
      </div>
      <div style={styles.files}>
        <DropZone sharedFs={sharedFs} currentDirectory={currentDirectory}>
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
                <div
                  ref={provided.innerRef}
                  style={
                    {
                      // backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey',
                    }
                  }
                  {...provided.droppableProps}>
                  {!directoryContents.length ? (
                    <p>drag or click to upload</p>
                  ) : (
                    <>
                      {currentDirectory !== '/r' ? (
                        <FileItem
                          fileIndex={1000}
                          isParent={true}
                          key={parentPath}
                          data={{path: parentPath, type: 'dir'}}
                          sharedFs={sharedFs}
                          ipfs={ipfs}
                          setCurrentDirectory={setCurrentDirectory}
                        />
                      ) : null}
                      {fullFileList.map((fileItem, index) => (
                        <FileItem
                          fileIndex={index}
                          key={fileItem.path}
                          data={fileItem}
                          sharedFs={sharedFs}
                          ipfs={ipfs}
                          setCurrentDirectory={setCurrentDirectory}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </DropZone>
      </div>
    </div>
  );
}
