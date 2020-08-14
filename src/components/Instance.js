import React, {useState} from 'react';
import {
  errorColor,
  lightErrorColor,
  primary,
  primary15,
  primary3,
  primary45,
} from '../utils/colors';
import {ToolItem} from './ToolItem';
import {FiCopy, FiHardDrive, FiTrash, FiUsers, FiEdit} from 'react-icons/fi';
import {useDispatch} from 'react-redux';
import useHover from '../hooks/useHover';
import {driveName} from '../utils/sailplane-util';
import {MobileActionsDialog} from './MobileActionsDialog';
import {copyToClipboard, hasMouse, notify} from '../utils/Utils';
import {Pill} from './Pill';
import LabelDriveDialog from './LabelDriveDialog';

export const Instance = ({
  data,
  selected,
  onClick,
  onDelete,
  instanceIndex,
  onAccess,
  displayOnly,
}) => {
  const {address, isEncrypted, label} = data;
  const dispatch = useDispatch();
  const [hoverRef, isHovered] = useHover();
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false);
  const [isLabelDialogVisible, setIsLabelDialogVisible] = useState(false);
  const isTouchDevice = !hasMouse;

  let backgroundColor = selected ? primary3 : '#FFF';

  if (isHovered && !selected) {
    backgroundColor = primary15;
  }

  const iconColor = selected ? '#FFF' : primary45;
  const styles = {
    paddingContainer: {
      paddingTop: 3,
      paddingBottom: 3,
    },
    outer: {
      backgroundColor: backgroundColor,
      color: iconColor,
      padding: 6,
      paddingTop: 6,
      fontFamily: 'Open Sans',
      cursor: 'pointer',
      borderRadius: 4,
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    address: {
      fontSize: 14,
      overflow: 'hidden',
      width: '40%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    tools: {
      display: displayOnly ? 'none' : 'flex',
      justifyContent: 'flex-end',
    },
    name: {
      fontSize: 16,
      height: 38,
      lineHeight: '19px',
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: 4,
      flexShrink: 0,
    },
    importedTxt: {
      marginLeft: 6,
      fontSize: 13,
    },
    label: {
      fontWeight: 600,
    },
    nameHolder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      lineHeight: '18px',
      position: 'relative',
      top: label ? -2 : null,
    },
  };

  const handleAddressCopy = async () => {
    await copyToClipboard(address);
    notify('Drive address copied to clipboard', dispatch);
  };

  const mobileActionItems = [
    {
      title: 'Open',
      onClick: () => {
        setMobileActionsVisible(false);
        onClick();
      },
      iconComponent: FiHardDrive,
    },
    {
      title: 'Set nickname',
      onClick: () => {
        setIsLabelDialogVisible(true);
        setMobileActionsVisible(false);
      },
      iconComponent: FiEdit,
    },
    {
      title: 'Manage users',
      onClick: () => {
        onAccess();
        setMobileActionsVisible(false);
      },
      iconComponent: FiUsers,
    },
    {
      title: 'Copy address',
      onClick: () => {
        handleAddressCopy();
        setMobileActionsVisible(false);
      },
      iconComponent: FiCopy,
    },
    {
      title: 'Delete',
      onClick: () => {
        onDelete();
        setMobileActionsVisible(false);
      },
      iconComponent: FiTrash,
      forceColor: lightErrorColor,
    },
  ];

  const thisDriveName = driveName(address);

  return (
    <div style={styles.paddingContainer} ref={hoverRef}>
      <div
        className={'drive'}
        style={styles.outer}
        onClick={(event) => {
          if (mobileActionsVisible) {
            return;
          }

          if (isTouchDevice) {
            setMobileActionsVisible(true);
          } else {
            event.stopPropagation();
            onClick();
          }
        }}>
        <MobileActionsDialog
          isVisible={mobileActionsVisible}
          name={thisDriveName}
          onClose={() => setMobileActionsVisible(false)}
          items={mobileActionItems}
        />
        <div style={styles.container}>
          <div style={styles.name}>
            <FiHardDrive
              className={'shareIcon'}
              color={iconColor}
              size={18}
              style={styles.icon}
            />
            <Pill
              title={isEncrypted ? 'private' : 'public'}
              inverted={selected}
            />
            <div style={styles.nameHolder}>
              {thisDriveName}
              {label ? <div style={styles.label}>[{label}]</div> : null}
            </div>
            {isHovered && !displayOnly && !isTouchDevice ? (
              <ToolItem
                className={'instanceLabel'}
                iconComponent={FiEdit}
                defaultColor={isHovered && selected ? '#FFF' : primary45}
                changeColor={primary}
                tooltip={'Set nickname'}
                onClick={() => setIsLabelDialogVisible(true)}
              />
            ) : null}
          </div>
          {!isTouchDevice ? (
            <div style={styles.tools}>
              <ToolItem
                className={'instanceAccess'}
                defaultColor={iconColor}
                iconComponent={FiUsers}
                size={15}
                changeColor={primary}
                onClick={() => onAccess()}
                tooltip={'Manage users'}
              />
              <ToolItem
                className={'instanceAddressCopy'}
                defaultColor={iconColor}
                iconComponent={FiCopy}
                size={15}
                changeColor={primary}
                tooltip={'Copy'}
                onClick={handleAddressCopy}
              />
              <ToolItem
                className={'instanceDelete'}
                defaultColor={iconColor}
                iconComponent={FiTrash}
                tooltip={'Delete'}
                size={15}
                changeColor={errorColor}
                onClick={() => onDelete()}
              />
            </div>
          ) : null}
        </div>
      </div>
      <LabelDriveDialog
        isVisible={isLabelDialogVisible}
        onClose={() => setIsLabelDialogVisible(false)}
        instance={data}
        instanceIndex={instanceIndex}
      />
    </div>
  );
};
