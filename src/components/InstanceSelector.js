import React, {useState} from 'react';
import {lightBorder, primary45} from '../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {SmallInstanceItem} from './SmallInstanceItem';
import {setInstanceIndex} from '../actions/main';
import {FiHardDrive, FiLock, FiUnlock} from 'react-icons/fi';

export function InstanceSelector({}) {
  const main = useSelector((state) => state.main);
  const dispatch = useDispatch();
  const {instances, instanceIndex} = main;
  const currentInstance = instances[instanceIndex];
  const [menuEnabled, setMenuEnabled] = useState(false);

  const filteredInstances = instances.filter(
    (instance) => instance !== currentInstance,
  );

  const styles = {
    container: {
      display: instances.length > 1 ? 'flex' : 'none',
      alignItems: 'center',
      position: 'relative',
      marginRight: 6,
      border: `1px solid ${lightBorder}`,
      borderBottomWidth: menuEnabled ? 0 : 1,
      color: primary45,
      padding: '3px 6px',
      borderRadius: `4px 4px ${menuEnabled ? 0 : 4}px ${menuEnabled ? 0 : 4}px`,
      fontSize: 14,
      fontWeight: 400,
    },
    menu: {
      backgroundColor: '#FFF',
      position: 'absolute',
      minWidth: 196,
      top: 25,
      left: -1,
      border: `1px solid ${lightBorder}`,
      color: primary45,
      zIndex: 2,
    },
    icon: {
      marginRight: 4,
    },
  };

  const LockComponent = currentInstance?.isEncrypted ? FiLock : FiUnlock;

  return (
    <span
      style={styles.container}
      onClick={() => {
        if (filteredInstances.length) {
          setMenuEnabled(!menuEnabled);
        }
      }}>
      <FiHardDrive color={primary45} size={16} style={styles.icon} />
      <LockComponent color={primary45} size={14} style={styles.icon} />

      <span id={'currentInstanceSelector'}>{currentInstance?.label || currentInstance?.name}</span>
      {menuEnabled ? (
        <div style={styles.menu}>
          {filteredInstances.map((instance, index) => (
            <SmallInstanceItem
              key={index}
              data={instance}
              onClick={() => {
                const instanceIndexToUse = instances.findIndex(
                  (inst) => inst === instance,
                );
                dispatch(setInstanceIndex(instanceIndexToUse));
              }}
            />
          ))}
        </div>
      ) : null}
    </span>
  );
}
