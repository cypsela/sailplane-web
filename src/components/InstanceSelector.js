import React, {useState} from 'react';
import {primary45} from '../colors';
import {useDispatch, useSelector} from 'react-redux';
import {SmallInstanceItem} from './SmallInstanceItem';
import {setInstanceIndex} from '../actions/main';
import {FiHardDrive} from 'react-icons/fi';

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
      backgroundColor: primary45,
      color: '#FFF',
      padding: '4px 6px',
      borderRadius: `4px 4px ${menuEnabled ? 0 : 4}px ${menuEnabled ? 0 : 4}px`,
      fontSize: 14,
    },
    menu: {
      backgroundColor: '#FFF',
      position: 'absolute',
      top: 26,
      left: 0,
      border: `1px solid ${primary45}`,
      color: primary45,
    },
    icon: {
      marginRight: 4,
    }
  };

  return (
    <span
      style={styles.container}
      onClick={() => {
        if (filteredInstances.length) {
          setMenuEnabled(!menuEnabled);
        }
      }}>
      <FiHardDrive color={'#FFF'} size={16} style={styles.icon} />

      {currentInstance.name}
      {menuEnabled ? (
        <div style={styles.menu}>
          {filteredInstances.map((instance, index) => (
            <SmallInstanceItem
              key={index}
              name={instance.name}
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
