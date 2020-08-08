import {Item, Menu, Separator} from 'react-contexify';
import React from 'react';
import {FiDownload, FiEdit, FiShare2, FiTrash} from 'react-icons/fi';
import '../context.css';

const styles = {
  menuItem: {
    marginLeft: 4,
    fontSize: 14,
  },
};

export const ContextMenu = () => {
  return (
    <>
      <Menu id={'menu-id'}>
        <Item
          className={'MenuItem'}
          onClick={(obj) => obj.props.handleDownload()}>
          <FiDownload size={16} style={styles.icon} />
          <span style={{...styles.menuItem}}>Download</span>
        </Item>

        <Item className={'MenuItem'} onClick={(obj) => obj.props.handleEdit()}>
          <FiEdit size={16} style={styles.icon} />
          <span style={{...styles.menuItem}}>Rename</span>
        </Item>

        <Item className={'MenuItem'} onClick={(obj) => obj.props.handleShare()}>
          <FiShare2 size={16} style={styles.icon} />
          <span style={{...styles.menuItem}}>Share</span>
        </Item>

        <Separator />

        <Item
          className={'MenuItem delete'}
          onClick={(obj) => obj.props.handleDelete()}>
          <FiTrash size={16} style={styles.icon} />
          <span style={{...styles.menuItem}}>Delete</span>
        </Item>
      </Menu>
      <Menu id={'menu-id-no-share'}>
        <Item className={'MenuItem'} onClick={(obj) => obj.props.handleDownload()}>
          <FiDownload size={16} style={styles.icon} />
          <span style={{...styles.menuItem}}>Download</span>
        </Item>

        <Item className={'MenuItem'} onClick={(obj) => obj.props.handleEdit()}>
          <FiEdit size={16} style={styles.icon} />
          <span style={{...styles.menuItem}}>Rename</span>
        </Item>

        <Separator />

        <Item className={'MenuItem delete'} onClick={(obj) => obj.props.handleDelete()}>
          <FiTrash size={16} style={styles.icon} />
          <span style={{...styles.menuItem}}>Delete</span>
        </Item>
      </Menu>
    </>
  );
};
