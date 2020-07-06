import {Item, Menu, Separator} from 'react-contexify';
import React from 'react';
import {FiDownload, FiEdit, FiShare2, FiTrash} from 'react-icons/fi';
import {errorColor, primary45} from './colors';

const styles = {
  menuItem: {
    color: primary45,
    marginLeft: 4,
    fontSize: 14,
  },
};

export const ContextMenu = () => {
  return (
    <Menu id={'menu-id'}>
      <Item onClick={(obj) => obj.props.handleDownload()}>
        <FiDownload color={primary45} size={16} style={styles.icon} />
        <span style={{...styles.menuItem}}>Download</span>
      </Item>

      <Item onClick={(obj) => obj.props.handleEdit()}>
        <FiEdit color={primary45} size={16} style={styles.icon} />
        <span style={{...styles.menuItem}}>Rename</span>
      </Item>

      <Item onClick={(obj) => obj.props.handleShare()}>
        <FiShare2 color={primary45} size={16} style={styles.icon} />
        <span style={{...styles.menuItem}}>Share</span>
      </Item>

      <Separator />

      <Item onClick={(obj) => obj.props.handleDelete()}>
        <FiTrash color={errorColor} size={16} style={styles.icon} />
        <span style={{...styles.menuItem, color: errorColor}}>Delete</span>
      </Item>
      {/*<Submenu label="Foobar">*/}
      {/*  <Item onClick={onClick}>Foo</Item>*/}
      {/*  <Item onClick={onClick}>Bar</Item>*/}
      {/*</Submenu>*/}
    </Menu>
  );
};
