import React, {useEffect, useRef, useState} from 'react';
import {primary, primary3, primary45} from './colors';
import {useDispatch, useSelector} from 'react-redux';
import {FaTimes} from 'react-icons/fa';
import {setShareData} from './actions/tempData';
import {FiFile, FiImage, FiLoader, FiMusic} from 'react-icons/fi';
import {SegmentedControl} from './components/SegmentedControl';
import {getShareTypeFromFolderFiles} from './utils/Utils';

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
  xIcon: {
    cursor: 'pointer',
  },
  link: {
    marginTop: 8,
    color: `${primary45} !important`,
    fontSize: 14,
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    color: primary45,
    marginTop: 10,
    fontSize: 14,
  },
  icon: {
    marginRight: 4,
  },
  nameHolder: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

const shareTypes = [
  {
    name: 'default',
    icon: FiFile,
  },
  {
    name: 'image',
    icon: FiImage,
  },
  {
    name: 'audio',
    icon: FiMusic,
  },
];

export function ShareDialog({sharedFs}) {
  const dispatch = useDispatch();
  const shareData = useSelector((state) => state.tempData.shareData);
  const inputRef = useRef(null);
  const {CID, path, name, pathType} = shareData;
  const [shareTypeIndex, setShareTypeIndex] = useState(0);
  const [loadedCID, setLoadedCID] = useState(CID);

  useEffect(() => {
    if (!name) {
      setLoadedCID(null);
      setShareTypeIndex(0);
    } else {
      setLoadedCID(CID);
    }
  }, [name, CID]);

  useEffect(() => {
    const getCID = async () => {
      const cid = await sharedFs.current.read(path);
      setLoadedCID(cid);

      if (pathType === 'dir') {
        const dirContents = sharedFs.current.fs.ls(path).map((tmpPath) => {
          const type = sharedFs.current.fs.content(tmpPath);
          const pathSplit = path.split('/');
          const tmpName = pathSplit[pathSplit.length - 1];

          return {path: tmpPath, name: tmpName, type};
        });

        const shareType = getShareTypeFromFolderFiles(dirContents);
        const shareTypeIndexToSwitchTo = shareTypes.findIndex(
          (curShareType) => curShareType.name === shareType,
        );

        setShareTypeIndex(shareTypeIndexToSwitchTo);
      }
    };

    if (!loadedCID && path) {
      getCID();
    } else {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedCID, path]);

  if (!path) {
    return null;
  }

  const url = `${
    window.location.origin + window.location.pathname
  }#/download/${encodeURIComponent(loadedCID)}/${encodeURIComponent(path)}/${
    shareTypes[shareTypeIndex].name
  }`;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>Share options</div>
        <FaTimes
          color={'#FFF'}
          size={16}
          style={styles.xIcon}
          onClick={() => {
            dispatch(setShareData({}));
          }}
        />
      </div>
      <div style={styles.body}>
        <div style={styles.nameHolder}>
          <div style={styles.filename}>{name}</div>
          <div>
            {pathType === 'dir' ? (
              <SegmentedControl
                currentIndex={shareTypeIndex}
                items={shareTypes}
                onSelect={(index) => setShareTypeIndex(index)}
              />
            ) : null}
          </div>
        </div>
        {loadedCID ? (
          <div>
            <div style={styles.flex}>
              <input
                ref={inputRef}
                style={styles.input}
                type={'text'}
                value={url}
              />
            </div>
            <div style={styles.link}>
              <a href={url} className={'link'} target={'_blank'}>
                Open link
              </a>
            </div>
          </div>
        ) : (
          <div style={styles.loading}>
            <FiLoader
              color={primary45}
              size={16}
              style={styles.icon}
              className={'rotating'}
            />
            Loading share link...
          </div>
        )}
      </div>
    </div>
  );
}
