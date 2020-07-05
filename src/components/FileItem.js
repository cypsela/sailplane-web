import React, {useEffect, useState} from 'react';
import {primary, primary2, primary45, primary5} from '../colors';
import {FiDownload, FiEdit, FiShare2, FiTrash} from 'react-icons/fi';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FilePreview} from './FilePreview';
import {
  getBlobFromPath,
  getBlobFromPathCID,
  getDraggableStyleHack,
  getFileExtensionFromFilename,
  getFileInfoFromCID,
  getIconForPath,
  humanFileSize,
  isFileExtensionSupported,
} from '../utils/Utils';
import {saveAs} from 'file-saver';
import {Draggable} from 'react-beautiful-dnd';
import useTextInput from '../hooks/useTextInput';
import {useDispatch} from 'react-redux';
import {setShareData, setStatus} from '../actions/tempData';
import {
  decryptFile,
  doesPasswordMatchHash,
  getEncryptionInfoFromFilename,
} from '../utils/encryption';
import useDoubleClick from '../hooks/useDoubleClick';
import {useWindowSize} from '../hooks/useWindowSize';

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
  const name = pathSplit[pathSplit.length - 1];
  const [hoverRef, isHovered] = useHover();
  const [CID, setCID] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [enterPasswordMode, setEnterPasswordMode] = useState(false);
  const [doubleClickRef] = useDoubleClick(() => setEditMode(true));
  const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/');
  const fileExtension = getFileExtensionFromFilename(name);
  const windowSize = useWindowSize();

  const {
    isEncrypted,
    decryptedFilename,
    passHash,
  } = getEncryptionInfoFromFilename(name);

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

  const setDecryptPassword = async (password) => {
    let doesNotMatchHash = await doesPasswordFailHashCheck(password);
    if (!doesNotMatchHash) {
      setEnterPasswordMode(false);

      let blob = await getBlob();

      dispatch(setStatus({message: 'Decrypting file'}));
      blob = await decryptFile(blob, password);
      dispatch(setStatus({}));

      saveAsFile(blob, decryptedFilename);
    }
  };

  const doesPasswordFailHashCheck = async (text) => {
    return await doesPasswordMatchHash(text, passHash);
  };

  const PasswordInputComponent = useTextInput(
    enterPasswordMode,
    (password) => setDecryptPassword(password),
    () => setEnterPasswordMode(false),
    '',
    {
      placeholder: 'password',
      isPassword: true,
      isError: doesPasswordFailHashCheck,
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
      userSelect: 'none',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: windowSize.width < 600 ? 'wrap' : 'nowrap',
      justifyContent: 'space-between',

      cursor: 'pointer',
    },
    flexItem: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexGrow: 2,
      marginBottom: windowSize.width < 600 ? 10 : 0,
    },
    icon: {
      marginRight: 4,
      width: 30,
    },
    tools: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      opacity:
        (isHovered || fileBlob || enterPasswordMode) && !isParent ? 1 : 0,
      fontSize: 14,
      marginLeft: enterPasswordMode ? 8 : 0,
    },
    filename: {
      // whiteSpace: 'nowrap',
      // textOverflow: 'ellipsis',
      // overflow: 'hidden',
    },
  };

  const iconComponent = getIconForPath(type, isEncrypted);

  const getCID = async () => {
    const cid = await sharedFs.current.read(path);
    const fileInfo = await getFileInfoFromCID(cid, ipfs);
    setFileInfo(fileInfo);
    setCID(cid);
  };

  useEffect(() => {
    getCID();
  }, [path]);

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

  async function getBlob() {
    let blob;

    if (!fileBlob) {
      dispatch(setStatus({message: 'Fetching download'}));
      blob = await getBlobFromPath(
        sharedFs,
        path,
        ipfs,
        (currentIndex, totalCount) => {
          dispatch(
            setStatus({
              message: `[${Math.round(
                (currentIndex / totalCount) * 100,
              )}%] Downloading`,
            }),
          );
        },
      );
      dispatch(setStatus({}));
    } else {
      blob = fileBlob;
    }
    return blob;
  }

  const saveAsFile = (blob, name) => {
    if (type === 'dir') {
      name = `${name}.zip`;
    }

    saveAs(blob, name);
  };

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
                const blob = await getBlob();
                dispatch(setStatus({}));
                setFileBlob(blob);
              } else {
                setFileBlob(null);
              }
            }
          }}>
          <div style={styles.flexItem}>
            <IconComponent color={primary45} size={16} style={styles.icon} />
            {editMode ? (
              <>{InputComponent}</>
            ) : isParent ? (
              '. . /'
            ) : (
              <span ref={doubleClickRef} style={styles.filename}>
                {decryptedFilename}
              </span>
            )}
          </div>
          <div style={{...styles.flexItem, justifyContent: 'flex-end'}}>
            {type !== 'dir' && fileInfo ? humanFileSize(fileInfo.size) : null}
          </div>
          <div style={styles.tools}>
            {!enterPasswordMode ? (
              <div>
                {type !== 'dir' ? (
                  <ToolItem
                    iconComponent={FiShare2}
                    changeColor={primary}
                    tooltip={'Share'}
                    onClick={() => {
                      dispatch(
                        setShareData({
                          name,
                          url: `${
                            window.location.origin + window.location.pathname
                          }/#/download/${encodeURIComponent(
                            CID,
                          )}/${encodeURIComponent(path)}`,
                        }),
                      );
                    }}
                  />
                ) : null}

                <ToolItem
                  iconComponent={FiDownload}
                  changeColor={primary}
                  tooltip={'Download'}
                  onClick={async () => {
                    if (isEncrypted) {
                      setEnterPasswordMode(true);
                      return;
                    }

                    const blob = await getBlob();
                    saveAsFile(blob, name);
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
                    dispatch(
                      setStatus({
                        message: `Deleting ${
                          type === 'dir' ? 'folder' : 'file'
                        }`,
                      }),
                    );
                    await sharedFs.current.remove(path);
                    dispatch(setStatus({}));
                  }}
                />
              </div>
            ) : (
              <>{PasswordInputComponent}</>
            )}
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
            style={getDraggableStyleHack(draggableProps.style, snapshot)}>
            {getContent(snapshot)}
          </div>
        );
      }}
    </Draggable>
  );
}
