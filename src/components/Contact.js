import Jdenticon from 'react-jdenticon';
import React from 'react';
import {
  errorColor,
  primary,
  primary2,
  primary4,
  primary45,
} from '../utils/colors';
import {FiTrash, FiCopy} from 'react-icons/fi';
import {ToolItem} from './ToolItem';
import useHover from '../hooks/useHover';
import {copyToClipboard, notify} from '../utils/Utils';
import {useDispatch} from 'react-redux';
import {deleteContact} from '../actions/main';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';

export default function Contact({
  pubKey,
  myID,
  selected,
  label,
  hideTools,
  onClick,
}) {
  const iconColor = selected ? '#FFF' : primary45;
  const [hoverRef, isHovered] = useHover();
  const dispatch = useDispatch();
  const isSmallScreen = useIsSmallScreen();

  const styles = {
    outer: {
      paddingTop: 4,
      paddingBottom: 4,
    },
    userBlock: {
      backgroundColor: isHovered ? primary2 : '#FFF',
      color: primary4,
      fontSize: 18,
      fontFamily: 'Open Sans',
      lineHeight: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8,
      borderRadius: 4,
      cursor: 'pointer',
    },
    left: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    right: {
      display: hideTools ? 'none' : 'block',
    },
    iconHolder: {
      marginRight: 8,
    },
    youText: {
      fontSize: 16,
      fontWeight: 600,
    },
    key: {
      fontSize: 13,
    },
  };

  return (
    <div style={styles.outer} ref={hoverRef} onClick={onClick ? onClick : null}>
      <div style={styles.userBlock}>
        <div style={styles.left}>
          <div style={styles.iconHolder}>
            <Jdenticon value={pubKey} size={'34'} style={styles.icon} />
          </div>
          <div style={styles.adminNameHolder}>
            <div>
              <span style={styles.youText}>
                {myID === pubKey ? 'You' : label ? label : 'Unnamed'}
              </span>
            </div>
            <div style={styles.key}>
              {isSmallScreen ? pubKey.substr(0, 20) + '...' : pubKey}
            </div>
          </div>
        </div>
        <div style={styles.right}>
          <ToolItem
            className={'contactCopy'}
            defaultColor={iconColor}
            iconComponent={FiCopy}
            tooltip={'Copy'}
            size={15}
            changeColor={primary}
            onClick={() => {
              copyToClipboard(pubKey);
              notify('Contact user ID copied!', dispatch);
            }}
          />
          {myID !== pubKey ? (
            <ToolItem
              className={'contactDelete'}
              defaultColor={iconColor}
              iconComponent={FiTrash}
              tooltip={'Delete'}
              size={15}
              changeColor={errorColor}
              onClick={() => {
                dispatch(deleteContact(pubKey));
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
