import React, {useEffect, useRef} from 'react';
import {errorColor, goodColor, primary, primary3, primary45} from './colors';
import {useDispatch, useSelector} from 'react-redux';
import {FaTimes} from 'react-icons/fa';
import {setShareData} from './actions/tempData';
import {Link} from 'react-router-dom';

const styles = {
  container: {
    position: 'absolute',
    backgroundColor: '#FFF',
    border: `1px solid ${primary45}`,
    borderRadius: 4,
    top: 150,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    fontFamily: 'Open Sans',
    zIndex: 10000,
  },
  header: {
    backgroundColor: primary45,
    color: '#FFF',
    padding: 8,
    fontSize: 14,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    padding: 14,
  },
  filename: {
    color: primary45,
  },
  input: {
    border: `1px solid ${primary3}`,
    borderRadius: 4,
    color: primary,
    fontSize: 14,
    fontWeight: 200,
    padding: 4,
    display: 'inline-flex',
    flexGrow: 2,
    marginTop: 8,
  },
  flex: {
    display: 'flex',
  },
  icon: {
    cursor: 'pointer',
  },
  link: {
    marginTop: 8,
    color: `${primary45} !important`,
  }
};

export function ShareDialog() {
  const dispatch = useDispatch();
  const shareData = useSelector((state) => state.tempData.shareData);
  const inputRef = useRef(null);
  const {url, name} = shareData;

  useEffect(() => {
    if (name) {
      inputRef.current.select();
    }
  }, [name]);

  if (!url) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>Share options</div>
        <FaTimes
          color={'#FFF'}
          size={16}
          style={styles.icon}
          onClick={() => {
            dispatch(setShareData({}));
          }}
        />
      </div>
      <div style={styles.body}>
        <div style={styles.filename}>{name}</div>
        <div style={styles.flex}>
          <input
            ref={inputRef}
            style={styles.input}
            type={'text'}
            value={url}
          />
        </div>
        <div style={styles.link}>
          <a href={url} className={'link'} target={'_blank'}>Open link</a>
        </div>
      </div>
    </div>
  );
}
