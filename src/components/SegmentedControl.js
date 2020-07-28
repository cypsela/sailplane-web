import React, {useState} from 'react';
import {FiImage, FiFile} from 'react-icons/fi';
import {primary45} from '../utils/colors';

export function SegmentedControl({onSelect, items, currentIndex}) {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: 6,
      borderRadius: 4,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      {items.map((type, index) => {
        const IconComponent = type.icon;
        return (
          <div
            id={`shareType-${items[index].name}`}
            style={{
              ...styles.item,
              backgroundColor: index === currentIndex ? primary45 : null,
            }}
            onClick={() => {
              onSelect(index);
            }}>
            <IconComponent
              color={index === currentIndex ? '#FFF' : primary45}
              size={16}
              style={styles.icon}
            />
          </div>
        );
      })}
    </div>
  );
}
