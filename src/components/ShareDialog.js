import React, {useEffect, useRef, useState} from 'react';
import {primary, primary3, primary45} from '../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {setShareData} from '../actions/tempData';
import {FiFile, FiImage, FiLoader, FiMusic} from 'react-icons/fi';
import {
  copyToClipboard,
  getShareTypeFromFolderFiles,
  notify,
} from '../utils/Utils';
import {Dialog} from './Dialog';

const styles = {
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
  const [keys, setKeys] = useState(null);

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

      if (sharedFs.current.encrypted && pathType !== 'dir') {
        const {key, iv} = sharedFs.current.fs.read(path);

        setKeys({key, iv});
      }
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

  let url = `${
    window.location.origin + window.location.pathname
  }#/download/${encodeURIComponent(loadedCID)}/${encodeURIComponent(path)}/${
    shareTypes[shareTypeIndex].name
  }`;

  if (keys?.key) {
    url = `${
      window.location.origin + window.location.pathname
    }#/download/${encodeURIComponent(loadedCID)}/${encodeURIComponent(
      keys.iv,
    )}/${encodeURIComponent(keys.key)}/${encodeURIComponent(path)}/${
      shareTypes[shareTypeIndex].name
    }`;
  }

  const handleCopy = async () => {
    await copyToClipboard(url);
    notify('Share link copied to clipboard', dispatch);
  };

  return (
    <Dialog
      title={'Share options'}
      onClose={() => dispatch(setShareData({}))}
      isVisible={path}
      body={
        <>
          <div style={styles.nameHolder}>
            <div style={styles.filename}>{name}</div>
            <div>
              {/*{pathType === 'dir' ? (*/}
              {/*  <SegmentedControl*/}
              {/*    currentIndex={shareTypeIndex}*/}
              {/*    items={shareTypes}*/}
              {/*    onSelect={(index) => setShareTypeIndex(index)}*/}
              {/*  />*/}
              {/*) : null}*/}
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
                  readOnly={true}
                />
              </div>
              <div style={styles.link}>
                <a href={'#'} className={'link'} onClick={handleCopy}>
                  Copy link
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
        </>
      }
    />
  );
}
