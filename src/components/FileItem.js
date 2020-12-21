import React, {useEffect, useState} from 'react';
import {
  lightErrorColor,
  primary,
  primary15,
  primary45,
  primary5,
} from '../utils/colors';
import {FiDownload, FiEdit, FiShare2, FiTrash} from 'react-icons/fi';
import {FaFolderOpen} from 'react-icons/fa';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FilePreview} from './FilePreview';
import {
  getBlobFromPath,
  filenameExt,
  getFileInfoFromCID,
  getFileTime,
  getIconForPath,
  humanFileSize,
  getPercent,
  isFileExtensionAudio,
  hasMouse,
  getEncryptionInfoFromFilename,
  doesUserHaveWriteInInstance,
} from '../utils/Utils';
import {saveAs} from 'file-saver';
import useTextInput from '../hooks/useTextInput';
import {useDispatch} from 'react-redux';
import {setShareData, setStatus} from '../actions/tempData';
import useDoubleClick from '../hooks/useDoubleClick';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';
import {contextMenu} from 'react-contexify';
import {MobileActionsDialog} from './MobileActionsDialog';

export function FileItem({
  data,
  sharedFs,
  setCurrentDirectory,
  ipfs,
  isParent,
  snapshot,
  forceIcon,
  onIconClicked,
  readOnly,
}) {
  const {path, type} = data;
  const pathSplit = path.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const mtime = sharedFs && sharedFs.current.fs.read(path)?.mtime;
  const [hoverRef, isHovered] = useHover();
  const [CID, setCID] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [doubleClickRef] = useDoubleClick(() => setEditMode(true));
  const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/');
  const fileExtension = filenameExt(name);
  const isSmallScreen = useIsSmallScreen();
  const contextID = `menu-id`;
  const contextNoShareID = `menu-id-no-share`;
  const exists = sharedFs && sharedFs.current.fs.exists(path);
  const isTouchDevice = !hasMouse;
  const isUnsharable = sharedFs?.current.encrypted && type === 'dir';
  const hasWrite = sharedFs && doesUserHaveWriteInInstance(sharedFs.current);

  const styles = {
    paddingContainer: {
      paddingTop: 3,
      paddingBottom: 3,
    },
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
      flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
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
      marginBottom: isSmallScreen ? 10 : 0,
    },
    icon: {
      marginRight: 4,
      width: 30,
      flexShrink: 0,
    },
    tools: {
      display: isTouchDevice ? 'none' : 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      opacity: (isHovered || fileBlob) && !isParent ? 1 : 0,
      pointerEvents: (isHovered || fileBlob) && !isParent ? null : 'none',
      fontSize: 14,
      marginLeft: 0,
    },
    filename: {
      textAlign: 'left',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  };

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

  const iconComponent = forceIcon ? forceIcon : getIconForPath(type, name);

  const getCID = async () => {
    let tmpCID;

    if (data.cid) {
      tmpCID = data.cid;
    } else if (exists) {
      tmpCID = await sharedFs.current.read(path);
    }

    const tmpFileInfo = await getFileInfoFromCID(tmpCID, ipfs);

    setFileInfo(tmpFileInfo);
    setCID(tmpCID);
    return tmpCID;
  };

  useEffect(() => {
    if (exists && type !== 'dir') {
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
      const handleUpdate = (currentIndex, totalCount) => {
        dispatch(
          setStatus({
            message: `[${getPercent(currentIndex, totalCount)}%] Downloading`,
          }),
        );
      };
      blob = await getBlobFromPath(sharedFs.current, path, handleUpdate);
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
    setMobileActionsVisible(false);

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
    setMobileActionsVisible(false);

    const blob = await getBlob();
    saveAsFile(blob, name);
  };

  const handleEdit = async () => {
    setMobileActionsVisible(false);

    setEditMode(true);
  };

  const handleDelete = async () => {
    setMobileActionsVisible(false);

    dispatch(
      setStatus({
        message: `Deleting ${type === 'dir' ? 'folder' : 'file'}`,
      }),
    );
    await sharedFs.current.remove(path);
    dispatch(setStatus({}));
  };

  const fetchPreview = async () => {
    // Only fetch for audio on click now
    if (!fileBlob && isFileExtensionAudio(fileExtension)) {
      dispatch(setStatus({message: 'Fetching preview'}));
      const blob = await getBlob();
      dispatch(setStatus({}));
      setFileBlob(blob);
    } else {
      setFileBlob(null);
    }
  };

  const handleClick = async (event) => {
    event.stopPropagation();

    if (isTouchDevice && type !== 'dir') {
      setMobileActionsVisible(true);

      return;
    }

    if (onIconClicked) {
      onIconClicked();
      return;
    }

    if (editMode) {
      return;
    }

    if (type === 'dir') {
      setCurrentDirectory(path);
    } else {
      await fetchPreview();
    }
  };

  let mobileActionItems = [
    {
      title: 'Download',
      onClick: handleDownload,
      iconComponent: FiDownload,
    },
  ];

  if (hasWrite) {
    mobileActionItems = mobileActionItems.concat([
      {
        title: 'Rename',
        onClick: handleEdit,
        iconComponent: FiEdit,
      },
      {
        title: 'Delete',
        onClick: handleDelete,
        iconComponent: FiTrash,
        forceColor: lightErrorColor,
      },
    ]);
  }

  if (!isUnsharable) {
    mobileActionItems.unshift({
      title: 'Share',
      onClick: handleShare,
      iconComponent: FiShare2,
    });
  }

  if (type === 'dir') {
    mobileActionItems.unshift({
      title: 'Open folder',
      onClick: () => setCurrentDirectory(path),
      iconComponent: FaFolderOpen,
    });
  } else {
    if ((!fileBlob && isFileExtensionAudio(fileExtension)) || onIconClicked) {
      mobileActionItems.unshift({
        title: 'Open preview',
        onClick: () => {
          setMobileActionsVisible(false);

          if (onIconClicked) {
            onIconClicked();
          } else {
            fetchPreview();
          }
        },
        iconComponent: iconComponent,
      });
    }
  }

  const getContent = () => {
    if (!snapshot) {
      snapshot = {};
    }

    return (
      <div
        ref={hoverRef}
        style={styles.paddingContainer}
        className={`fileItem`}>
        <MobileActionsDialog
          isVisible={mobileActionsVisible}
          name={name}
          fileIcon={iconComponent}
          onClose={() => setMobileActionsVisible(false)}
          items={mobileActionItems}
        />
        <div
          onContextMenu={(event) => {
            event.preventDefault();

            contextMenu.show({
              event,
              id: isUnsharable ? contextNoShareID : contextID,
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
            backgroundColor:
              (isHovered ||
                fileBlob ||
                snapshot.isDragging ||
                (snapshot.combineTargetFor && type === 'dir')) &&
              !isTouchDevice
                ? primary15
                : '#FFF',
          }}>
          <div style={styles.container} onClick={handleClick}>
            <div
              style={{
                ...styles.flexItem,
                maxWidth: isSmallScreen ? null : '25%',
              }}>
              <IconComponent color={primary45} size={16} style={styles.icon} />
              {editMode ? (
                <>{InputComponent}</>
              ) : isParent ? (
                '. . /'
              ) : (
                <span ref={doubleClickRef} style={styles.filename}>
                  {name}
                </span>
              )}
            </div>
            <div style={{...styles.flexItem, justifyContent: 'flex-end'}}>
              {type !== 'dir' && fileInfo ? humanFileSize(fileInfo.size) : null}
            </div>
            <div style={{...styles.flexItem, justifyContent: 'flex-end'}}>
              {type !== 'dir' && (mtime || fileInfo?.mtime)
                ? getFileTime(mtime?.secs || fileInfo.mtime.secs)
                : null}
            </div>
            <div style={styles.tools}>
              <div>
                <ToolItem
                  id={`Share-${type}`}
                  iconComponent={FiShare2}
                  changeColor={primary}
                  tooltip={
                    isUnsharable ? 'No encrypted folder sharing yet!' : 'Share'
                  }
                  onClick={handleShare}
                  disabled={isUnsharable}
                />

                <ToolItem
                  id={`Download-${type}`}
                  iconComponent={FiDownload}
                  changeColor={primary}
                  tooltip={'Download'}
                  onClick={handleDownload}
                />

                {!readOnly && hasWrite ? (
                  <>
                    <ToolItem
                      id={`Rename-${type}`}
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
                  </>
                ) : null}
              </div>
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
