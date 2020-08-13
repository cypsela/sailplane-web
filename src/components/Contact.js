import Jdenticon from 'react-jdenticon';
import React from 'react';
import {errorColor, primary, primary2, primary4, primary45} from '../utils/colors';
import {FiTrash, FiCopy} from 'react-icons/fi/index';
import {ToolItem} from './ToolItem';
import useHover from "../hooks/useHover";

export default function Contact({pubKey, myID, selected, label}) {
  const iconColor = selected ? '#FFF' : primary45;
  const [hoverRef, isHovered] = useHover();


  const styles = {
    userBlock: {
      backgroundColor: isHovered? primary2: '#FFF',
      color: primary4,
      fontSize: 18,
      fontFamily: 'Open Sans',
      lineHeight: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 4,
      borderRadius: 4,
      cursor: 'pointer'
    },
    left: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
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
    <div style={styles.userBlock} ref={hoverRef}>
      <div style={styles.left}>
        <div style={styles.iconHolder}>
          <Jdenticon value={pubKey} size={'34'} style={styles.icon} />
        </div>
        <div style={styles.adminNameHolder}>
          <div>
            <span style={styles.youText}>{myID === pubKey ? 'You' : label?label: 'Unnamed'}</span>
          </div>
          <div style={styles.key}>{pubKey} </div>
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
          // onClick={() => onDelete()}
        />
        <ToolItem
          className={'contactDelete'}
          defaultColor={iconColor}
          iconComponent={FiTrash}
          tooltip={'Delete'}
          size={15}
          changeColor={errorColor}
          // onClick={() => onDelete()}
        />
      </div>
    </div>
  );
}
