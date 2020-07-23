import React from 'react';
import {errorColor, primary45} from '../colors';
import {Modal} from './Modal';
import {MobileActionItem} from './MobileActionItem';
import {FiDownload, FiEdit, FiShare2, FiTrash} from 'react-icons/fi';

export function MobileActionsDialog({
  name,
  isVisible,
  onClose,
  onShare,
  onDownload,
  onEdit,
  onDelete,
  fileIcon,
}) {
  if (!isVisible) {
    return null;
  }

  const styles = {
    container: {
      padding: '0 8px 0 8px',
    },
    name: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 16,
      marginTop: 8,

    },
    icon: {
      height: 16,
      width: 16,
    },
    nameText: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
    }
  };

  const FileIcon = fileIcon;

  return (
    <Modal onClose={onClose}>
      <div style={styles.name}>
        <FileIcon color={primary45} size={16} style={styles.icon} />
        <span style={styles.nameText}>{name}</span>
      </div>
      <div style={styles.container}>
        <MobileActionItem
          iconComponent={FiShare2}
          title={'Share'}
          onClick={onShare}
        />
        <MobileActionItem
          iconComponent={FiDownload}
          title={'Download'}
          onClick={onDownload}
        />
        <MobileActionItem
          iconComponent={FiEdit}
          title={'Rename'}
          onClick={onEdit}
        />
        <MobileActionItem
          iconComponent={FiTrash}
          title={'Delete'}
          forceColor={errorColor}
          onClick={onDelete}
        />
      </div>
    </Modal>
  );
}
