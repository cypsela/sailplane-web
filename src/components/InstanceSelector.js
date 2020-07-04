import React, {useState} from 'react';
import {primary45} from '../colors';
import {useDispatch, useSelector} from 'react-redux';
import {SmallInstanceItem} from './SmallInstanceItem';
import useHover from '../hooks/useHover';
import {setInstanceIndex} from '../actions/main';

export function InstanceSelector({}) {
  const main = useSelector((state) => state.main);
  const dispatch = useDispatch();
  const {instances, instanceIndex} = main;
  const currentInstance = instances[instanceIndex];
  const [menuEnabled, setMenuEnabled] = useState(false);
  const [hoverRef, isHovered] = useHover();

  const filteredInstances = instances.filter(
    (instance) => instance !== currentInstance,
  );

  const styles = {
    container: {
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
  };

  return (
    <span
      style={styles.container}
      ref={hoverRef}
      onClick={() => {
        if (filteredInstances.length) {
          setMenuEnabled(!menuEnabled);
        }
      }}>
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
