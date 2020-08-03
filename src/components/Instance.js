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
import {FiCopy, FiTrash, FiUsers} from 'react-icons/fi';
import {FiHardDrive} from 'react-icons/fi';
import {useDispatch} from 'react-redux';
import {setStatus} from '../actions/tempData';
import useHover from '../hooks/useHover';
import {driveName} from '../utils/sailplane-util';
import {MobileActionsDialog} from './MobileActionsDialog';
import {hasMouse} from '../utils/Utils';

export const Instance = ({
  data,
  selected,
  onClick,
  onDelete,
  instanceIndex,
  onAccess,
}) => {
  const {address, isImported} = data;
  const dispatch = useDispatch();
  const [hoverRef, isHovered] = useHover();
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false);
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
      display: 'flex',
      justifyContent: 'flex-end',
    },
    name: {
      fontSize: 16,
      lineHeight: '19px',
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: 4,
    },
    importedTxt: {
      marginLeft: 6,
      fontSize: 13,
    },
  };

  // const shareURL = `${
  //   window.location.origin + window.location.pathname
  // }#/importInstance/${encodeURIComponent(address)}`;

  const handleAddressCopy = async () => {
    await navigator.clipboard.writeText(address);
    dispatch(
      setStatus({
        message: 'Drive address copied to clipboard',
        isInfo: true,
      }),
    );
    setTimeout(() => dispatch(setStatus({})), 1500);
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
              size={15}
              style={styles.icon}
            />
            {thisDriveName}
            {isImported ? (
              <span style={styles.importedTxt}>[imported]</span>
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
              {/*<ToolItem*/}
              {/*  className={'instanceURLCopy'}*/}
              {/*  defaultColor={iconColor}*/}
              {/*  iconComponent={FiShare2}*/}
              {/*  size={15}*/}
              {/*  changeColor={primary}*/}
              {/*  onClick={async () => {*/}
              {/*    await navigator.clipboard.writeText(shareURL);*/}
              {/*    dispatch(*/}
              {/*      setStatus({*/}
              {/*        message: 'Drive URL copied to clipboard',*/}
              {/*        isInfo: true,*/}
              {/*      }),*/}
              {/*    );*/}
              {/*    setTimeout(() => dispatch(setStatus({})), 1500);*/}
              {/*  }}*/}
              {/*/>*/}
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
    </div>
  );
};
