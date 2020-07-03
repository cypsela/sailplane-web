import React from 'react';
import {FaChevronRight} from 'react-icons/fa';
import {primary45} from '../colors';
import {useSelector} from 'react-redux';
import * as PropTypes from 'prop-types';
import {InstanceSelector} from './InstanceSelector';
import useHover from '../hooks/useHover';

export function SmallInstanceItem({name, onClick}) {
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      backgroundColor: isHovered ? primary45 : '#FFF',
      color: isHovered ? '#FFF' : primary45,
      padding: '6px 10px',
    },
  };
  return (
    <div style={styles.container} ref={hoverRef} onClick={onClick}>
      {name}
    </div>
  );
}
