import React, {useEffect, useState} from 'react';
import {primary, primary2, primary45, primary5} from '../colors';
import {FiDownload, FiEdit, FiShare2, FiTrash} from 'react-icons/fi';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FilePreview} from './FilePreview';
import {
  getBlobFromPathCID,
  getFileExtensionFromFilename,
  getFileInfoFromCID,
  getFileTime,
  getIconForPath,
  humanFileSize,
  isFileExtensionSupported,
  getPercent,
} from '../utils/Utils';
import {saveAs} from 'file-saver';
import useTextInput from '../hooks/useTextInput';
import {useDispatch} from 'react-redux';
import {setShareData, setStatus} from '../actions/tempData';
import {
  decryptFile,
  doesPasswordMatchHash,
  getEncryptionInfoFromFilename,
} from '../utils/encryption';
import useDoubleClick from '../hooks/useDoubleClick';
import {useIsMobile} from '../hooks/useIsMobile';
import {contextMenu} from 'react-contexify';

export function FileItem({
  data,
  sharedFs,
  setCurrentDirectory,
  ipfs,
  isParent,
  snapshot,
}) {
  const {path, type} = data;
  const pathSplit = path.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const [hoverRef, isHovered] = useHover();
  const [CID, setCID] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [enterPasswordMode, setEnterPasswordMode] = useState(false);
  const [doubleClickRef] = useDoubleClick(() => setEditMode(true));
  const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/');
  const fileExtension = getFileExtensionFromFilename(name);
  const isMobile = useIsMobile();
  const contextID = `menu-id`;

  const styles = {
    outer: {
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
      flexWrap: isMobile ? 'wrap' : 'nowrap',
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
      marginBottom: isMobile ? 10 : 0,
    },
    icon: {
      marginRight: 4,
      width: 30,
      flexShrink: 0,
    },
    tools: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      opacity:
        (isHovered || fileBlob || enterPasswordMode) && !isParent ? 1 : 0,
      pointerEvents:
        (isHovered || fileBlob || enterPasswordMode) && !isParent
          ? null
          : 'none',
      fontSize: 14,
      marginLeft: enterPasswordMode ? 8 : 0,
    },
    filename: {
      textAlign: 'left',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  };

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

  const iconComponent = getIconForPath(type, isEncrypted, name);

  const getCID = async () => {
    const cid = await sharedFs.current.read(path);
    const fileInfo = await getFileInfoFromCID(cid, ipfs);

    setFileInfo(fileInfo);
    setCID(cid);
    return cid;
  };

  useEffect(() => {
    if (type !== 'dir') {
      getCID();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      let tmpCID = CID;

      if (!CID) {
        tmpCID = await getCID();
      }

      blob = await getBlobFromPathCID(
        tmpCID,
        path,
        ipfs,
        (currentIndex, totalCount) => {
          dispatch(
            setStatus({
              message: `[${getPercent(currentIndex, totalCount)}%] Downloading`,
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

  const handleShare = () => {
    dispatch(
      setShareData({
        name,
        CID,
        path,
        pathType: type,
      }),
    );
  };

  const handleDownload = async () => {
    if (isEncrypted) {
      setEnterPasswordMode(true);
      return;
    }

    const blob = await getBlob();
    saveAsFile(blob, name);
  };

  const handleEdit = async () => {
    setEditMode(true);
  };

  const handleDelete = async () => {
    dispatch(
      setStatus({
        message: `Deleting ${type === 'dir' ? 'folder' : 'file'}`,
      }),
    );
    await sharedFs.current.remove(path);
    dispatch(setStatus({}));
  };

  const getContent = () => {
    if (!snapshot) {
      snapshot = {};
    }

    return (
      <div className={`fileItem ${isEncrypted ? 'fileItemEncrypted' : null}`}>
        <div
          onContextMenu={(event) => {
            event.preventDefault();

            contextMenu.show({
              event,
              id: contextID,
              props: {
                handleDelete,
                handleDownload,
                handleShare,
                handleEdit,
              },
            });
          }}
          style={{
            ...styles.outer,
            border:
              isHovered || fileBlob || snapshot.isDragging
                ? `1px solid ${primary2}`
                : '1px solid #FFF',
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
            <div
              style={{...styles.flexItem, maxWidth: isMobile ? null : '25%'}}>
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
            <div style={{...styles.flexItem, justifyContent: 'flex-end'}}>
              {type !== 'dir' && fileInfo && fileInfo.mtime
                ? getFileTime(fileInfo.mtime.secs)
                : null}
            </div>
            <div style={styles.tools}>
              {!enterPasswordMode ? (
                <div>
                  <ToolItem
                    id={`Share-${type}`}
                    iconComponent={FiShare2}
                    changeColor={primary}
                    tooltip={'Share'}
                    onClick={handleShare}
                  />

                  <ToolItem
                    id={`Download-${type}`}
                    iconComponent={FiDownload}
                    changeColor={primary}
                    tooltip={'Download'}
                    onClick={handleDownload}
                  />

                  <ToolItem
                    id={`Edit-${type}`}
                    iconComponent={FiEdit}
                    changeColor={primary}
                    tooltip={'Rename'}
                    onClick={handleEdit}
                  />

                  <ToolItem
                    id={`Delete-${type}`}
                    iconComponent={FiTrash}
                    tooltip={'Delete'}
                    onClick={handleDelete}
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
      </div>
    );
  };

  return <>{getContent()}</>;
}
