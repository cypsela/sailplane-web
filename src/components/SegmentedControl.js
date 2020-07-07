import React, {useState} from 'react';
import {FiImage, FiFile} from 'react-icons/fi';
import {primary45} from '../colors';

export function SegmentedControl({onSelect, items}) {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div style={styles.container}>
      {items.map((type, index) => {
        const IconComponent = type.icon;
        return (
          <div
            style={{
              ...styles.item,
              backgroundColor: index === currentIndex ? primary45 : null,
            }}
            onClick={() => {
              setCurrentIndex(index);
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
