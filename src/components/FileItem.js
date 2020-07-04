import React, {useState} from 'react';
import {primary, primary2, primary45, primary5} from '../colors';
import {FaFile, FaFolder, FaLock} from 'react-icons/fa';
import {FiFile, FiLock} from 'react-icons/fi';
import {FiDownload, FiEdit, FiTrash} from 'react-icons/fi';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FilePreview} from './FilePreview';
import {
  getBlobFromPath,
  getFileExtensionFromFilename,
  isFileExtensionSupported,
} from '../utils/Utils';
import {saveAs} from 'file-saver';
import {Draggable} from 'react-beautiful-dnd';
import useTextInput from '../hooks/useTextInput';
import {useDispatch} from 'react-redux';
import {setStatus} from '../actions/tempData';
import {decryptFile, getEncryptionInfoFromFilename} from '../utils/encryption';

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
  const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/');
  const fileExtension = getFileExtensionFromFilename(name);
  const {isEncrypted, decryptedFilename} = getEncryptionInfoFromFilename(name);

  const dispatch = useDispatch();

  const InputComponent = useTextInput(
    editMode,
    (editNameValue) => rename(editNameValue),
    () => setEditMode(false),
    name,
    {
      placeholder: '',
    },
  );

  const styles = {
    outer: {
      border:
        isHovered || fileBlob ? `1px solid ${primary2}` : '1px solid #FFF',
      borderRadius: 4,
      color: primary5,
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
      width: 80,
    },
  };

  let iconComponent = FiFile;

  if (type === 'dir') {
    iconComponent = FaFolder;
  }

  if (isEncrypted) {
    iconComponent = FiLock;
  }

  const IconComponent = iconComponent;

  const rename = async (editNameValue) => {
    try {
      dispatch(setStatus({message: 'Renaming file'}));
      await sharedFs.current.move(path, parentPath, editNameValue);
      dispatch(setStatus({}));
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
      transitionDuration: `0.001s`,
    };
  }

  const getContent = (snapshot) => {
    if (!snapshot) {
      snapshot = {};
    }

    return (
      <div
        style={{
          ...styles.outer,
          backgroundColor:
            snapshot.combineTargetFor && type === 'dir' ? primary2 : '#FFF',
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
              if (!fileBlob && isFileExtensionSupported(fileExtension)) {
                dispatch(setStatus({message: 'Fetching preview'}));
                const blob = await getBlobFromPath(sharedFs, path, ipfs);
                dispatch(setStatus({}));
                setFileBlob(blob);
              } else {
                setFileBlob(null);
              }
            }
          }}>
          <div style={styles.nameContainer}>
            <IconComponent color={primary45} size={16} style={styles.icon} />
            {editMode ? (
              <>{InputComponent}</>
            ) : isParent ? (
              '. . /'
            ) : isEncrypted ? (
              decryptedFilename
            ) : (
              name
            )}
          </div>
          <div style={styles.tools}>
            <ToolItem
              iconComponent={FiDownload}
              changeColor={primary}
              tooltip={'Download'}
              onClick={async () => {
                let blob;

                if (!fileBlob) {
                  dispatch(setStatus({message: 'Fetching download'}));
                  blob = await getBlobFromPath(sharedFs, path, ipfs);
                  dispatch(setStatus({}));
                } else {
                  blob = fileBlob;
                }

                if (isEncrypted) {
                  dispatch(setStatus({message: 'Decrypting file'}));

                  // todo: password
                  blob = await decryptFile(blob, 'password');
                  dispatch(setStatus({}));

                  if (!blob) {
                    dispatch(
                      setStatus({
                        message: 'Error decrypting file: Incorrect password!',
                        isError: true,
                      }),
                    );
                    setTimeout(() => {
                      dispatch(setStatus({}));
                    }, 3000);
                    return;
                  }
                }

                saveAs(blob, isEncrypted ? decryptedFilename : name);
              }}
            />

            <ToolItem
              iconComponent={FiEdit}
              changeColor={primary}
              tooltip={'Rename'}
              onClick={async () => {
                setEditMode(true);
              }}
            />

            <ToolItem
              iconComponent={FiTrash}
              tooltip={'Delete'}
              onClick={async () => {
                dispatch(setStatus({message: 'Deleting file'}));
                await sharedFs.current.remove(path);
                dispatch(setStatus({}));
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
    );
  };

  return (
    <Draggable draggableId={path} index={fileIndex}>
      {({innerRef, draggableProps, dragHandleProps}, snapshot) => {
        return (
          <div
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            style={getStyle(draggableProps.style, snapshot)}>
            {getContent(snapshot)}
          </div>
        );
      }}
    </Draggable>
  );
}
