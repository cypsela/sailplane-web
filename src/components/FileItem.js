import React, {useState} from 'react';
import {errorColor, primary, primary2, primary3, primary4} from '../colors';
import {FaFolder, FaTrash, FaEdit} from 'react-icons/fa';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';

export function FileItem({data, sharedFs, setCurrentDirectory}) {
  const {path, type} = data;
  const pathSplit = path.split('/');
  const [hoverRef, isHovered] = useHover();
  const [editMode, setEditMode] = useState(false);
  const name = pathSplit[pathSplit.length - 1];

  const [editNameValue, setEditNameValue] = useState(name);
  const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/');
  console.log('parent', parentPath);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      border: isHovered ? `1px solid ${primary2}` : '1px solid #FFF',
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      padding: 7,
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
    },
    editNameAction: {
      fontSize: 13,
      padding: 4,
    },
  };

  return (
    <div
      style={styles.container}
      ref={hoverRef}
      onClick={() => {
        if (editMode) {
          return;
        }

        if (type === 'dir') {
          setCurrentDirectory(path);
        } else {
        }
      }}>
      <div style={styles.nameContainer}>
        <FaFolder color={primary4} size={16} style={styles.icon} />
        {editMode ? (
          <>
            <input
              type={'text'}
              style={styles.editInput}
              value={editNameValue}
              onChange={(event) => setEditNameValue(event.target.value)}
            />
            <ToolItem
              title={'Save'}
              onClick={async () => {
                if (type === 'dir') {
                  console.log('fs', sharedFs.current)
                  // await sharedFs.current.fs.mvdir(path, parentPath, editNameValue);
                } else {

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
          iconComponent={FaEdit}
          changeColor={primary}
          tooltip={'Edit'}
          onClick={async (event) => {
            event.stopPropagation();

            setEditMode(true);
          }}
        />

        <ToolItem
          iconComponent={FaTrash}
          tooltip={'Remove'}
          onClick={async (event) => {
            event.stopPropagation();

            await sharedFs.current.remove(path);
          }}
        />
      </div>
    </div>
  );
}
