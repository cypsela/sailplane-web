import React from 'react';
import {primary15, primary3} from '../utils/colors';
import {Modal} from './Modal';
import {MobileActionItem} from './MobileActionItem';

export function MobileActionsDialog({
  name,
  isVisible,
  fileIcon,
  items,
  onClose,
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
      marginTop: 8,
      padding: 6,
      backgroundColor: primary15,
      color: primary3,
      boxShadow: 'inset 1px 1px 3px #adcadf',
      borderRadius: 4,
      margin: 8,
    },
    icon: {
      height: 20,
      width: 20,
      marginRight: 4,
    },
    nameText: {
      fontSize: 16,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  };

  const FileIcon = fileIcon;

  return (
    <Modal onClose={onClose} isVisible={isVisible}>
      <div style={styles.name}>
        {fileIcon ? (
          <FileIcon color={primary3} size={20} style={styles.icon} />
        ) : null}
        <span style={styles.nameText}>{name}</span>
      </div>
      <div style={styles.container}>
        {items.map((item, index) => (
          <MobileActionItem
            key={index}
            iconComponent={item.iconComponent}
            title={item.title}
            onClick={item.onClick}
            forceColor={item.forceColor}
          />
        ))}
      </div>
    </Modal>
  );
}
