import React, {useEffect, useRef, useState} from 'react';
import {primary, primary2, primary3, primary4, primary45} from '../colors';
import {FaFolder} from 'react-icons/fa';
import {FiDownload, FiEdit, FiFile, FiTrash} from 'react-icons/fi';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FilePreview} from './FilePreview';
import {
  getBlobFromPath,
  getFileExtensionFromFilename,
  supportedPreviewExtensions,
} from '../utils/Utils';
import {saveAs} from 'file-saver';
import {Draggable} from 'react-beautiful-dnd';

export function FileItem({
  data,
  sharedFs,
  setCurrentDirectory,
  ipfs,
  fileIndex,
  isParent,
}) {
  const {path, type} = data;
  const pathSplit = path.split('/');
  const [hoverRef, isHovered] = useHover();
  const [editMode, setEditMode] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const name = pathSplit[pathSplit.length - 1];
  const editInputRef = useRef(null);
  const [editNameValue, setEditNameValue] = useState(name);
  const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/');
  const fileExtension = getFileExtensionFromFilename(name);

  useEffect(() => {
    if (editMode) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editMode]);

  const styles = {
    outer: {
      border:
        isHovered || fileBlob ? `1px solid ${primary2}` : '1px solid #FFF',
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      padding: 7,
      marginBottom: 8,
      fontFamily: 'Open Sans',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      cursor: 'pointer',
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 4,
    },
    tools: {
      opacity: (isHovered || fileBlob) && !isParent ? 1 : 0,
      fontSize: 14,
    },
    editInput: {
      border: `1px solid ${primary3}`,
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      padding: 4,
      flexGrow: 2,
    },
    editNameAction: {
      fontSize: 13,
      padding: 4,
    },
  };

  const rename = async () => {
    try {
      await sharedFs.current.move(path, parentPath, editNameValue);
    } catch (e) {
      console.log('Error moving!', e);
    }
  };

  function getStyle(style, snapshot) {
    if (!snapshot.isDragging) return {};
    if (!snapshot.isDropAnimating) {
      return style;
    }

    return {
      ...style,
      // cannot be 0, but make it super tiny
      transitionDuration: `0.001s`
    };
  }

  return (
    <Draggable draggableId={path} index={fileIndex}>
      {({ innerRef, draggableProps, dragHandleProps }, snapshot) => {
        return (
          <div
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            style={getStyle(draggableProps.style, snapshot)}
          >
            <div
              style={{
                ...styles.outer,
                backgroundColor:
                  snapshot.combineTargetFor && type === 'dir'
                    ? primary2
                    : '#FFF',
              }}>
              <div
                style={styles.container}
                ref={hoverRef}
                onClick={async (event) => {
                  event.stopPropagation();

                  if (editMode) {
                    return;
                  }

                  if (type === 'dir') {
                    setCurrentDirectory(path);
                  } else {
                    if (
                      !fileBlob &&
                      supportedPreviewExtensions.includes(fileExtension)
                    ) {
                      const blob = await getBlobFromPath(sharedFs, path, ipfs);
                      setFileBlob(blob);
                    } else {
                      setFileBlob(null);
                    }
                  }
                }}>
                <div style={styles.nameContainer}>
                  {type === 'dir' ? (
                    <FaFolder color={primary45} size={16} style={styles.icon} />
                  ) : (
                    <FiFile color={primary45} size={16} style={styles.icon} />
                  )}
                  {editMode ? (
                    <>
                      <input
                        ref={editInputRef}
                        type={'text'}
                        style={styles.editInput}
                        value={editNameValue}
                        onChange={(event) =>
                          setEditNameValue(event.target.value)
                        }
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            rename();
                          }
                        }}
                      />
                      <ToolItem title={'Save'} onClick={rename} />
                      <ToolItem
                        title={'Cancel'}
                        onClick={() => setEditMode(false)}
                      />
                    </>
                  ) : isParent ? (
                    '. . /'
                  ) : (
                    name
                  )}
                </div>
                <div style={styles.tools}>
                  <ToolItem
                    iconComponent={FiDownload}
                    changeColor={primary}
                    tooltip={'Download'}
                    onClick={async (event) => {
                      event.stopPropagation();

                      const blob = await getBlobFromPath(sharedFs, path, ipfs);
                      saveAs(blob, name);
                    }}
                  />

                  <ToolItem
                    iconComponent={FiEdit}
                    changeColor={primary}
                    tooltip={'Rename'}
                    onClick={async (event) => {
                      event.stopPropagation();

                      setEditMode(true);
                    }}
                  />

                  <ToolItem
                    iconComponent={FiTrash}
                    tooltip={'Delete'}
                    onClick={async (event) => {
                      event.stopPropagation();

                      await sharedFs.current.remove(path);
                    }}
                  />
                </div>
              </div>
              {fileBlob ? (
                <div style={styles.preview}>
                  <FilePreview blob={fileBlob} filename={name} />
                </div>
              ) : null}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}
