import React, {useEffect, useRef, useState} from 'react';
import {primary, primary2, primary3, primary4} from '../colors';
import {FaFolder} from 'react-icons/fa';
import {FiEdit, FiFile, FiTrash, FiDownload} from 'react-icons/fi';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FilePreview} from './FilePreview';
import {getBlobFromPath} from '../utils/Utils';
import { saveAs } from 'file-saver';

export function FileItem({data, sharedFs, setCurrentDirectory, ipfs}) {
  const {path, type} = data;
  const pathSplit = path.split('/');
  const [hoverRef, isHovered] = useHover();
  const [editMode, setEditMode] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const name = pathSplit[pathSplit.length - 1];
  const editInputRef = useRef(null);
  const [editNameValue, setEditNameValue] = useState(name);
  const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/');

  useEffect(() => {
    if (editMode) {
      editInputRef.current.focus();
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
      opacity: isHovered ? 1 : 0,
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

  return (
    <div style={styles.outer}>
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
            if (!fileBlob) {
              const blob = await getBlobFromPath(sharedFs, path, ipfs);
              setFileBlob(blob);
            } else {
              setFileBlob(null);
            }
            // saveAs(blob, name);
          }
        }}>
        <div style={styles.nameContainer}>
          {type === 'dir' ? (
            <FaFolder color={primary4} size={16} style={styles.icon} />
          ) : (
            <FiFile color={primary4} size={16} style={styles.icon} />
          )}
          {editMode ? (
            <>
              <input
                ref={editInputRef}
                type={'text'}
                style={styles.editInput}
                value={editNameValue}
                onChange={(event) => setEditNameValue(event.target.value)}
              />
              <ToolItem
                title={'Save'}
                onClick={async () => {
                  try {
                    await sharedFs.current.move(
                      path,
                      parentPath,
                      editNameValue,
                    );
                  } catch (e) {
                    console.log('Error moving!', e);
                  }
                }}
              />
              <ToolItem title={'Cancel'} onClick={() => setEditMode(false)} />
            </>
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
            tooltip={'Edit'}
            onClick={async (event) => {
              event.stopPropagation();

              setEditMode(true);
            }}
          />

          <ToolItem
            iconComponent={FiTrash}
            tooltip={'Remove'}
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
  );
}
