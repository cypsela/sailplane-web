import React, {useEffect, useState} from 'react';
import Jdenticon from 'react-jdenticon';
import {
  cleanBorder,
  primary15,
  primary2,
  primary3,
  primary4,
  primary45,
} from '../utils/colors';
import {compressKey} from '../utils/Utils';
import QRDisplayDialog from './QRDisplayDialog';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    borderBottom: `1px solid ${primary2}`,
    paddingBottom: 2,
  },
  right: {
    fontSize: 16,
    lineHeight: '18px',
    color: primary45,
  },
  userItem: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 2,
  },
  leftSide: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: primary45,
    fontSize: 16,
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
  },
  headerIcon: {
    marginRight: 4,
  },
  myID: {
    fontSize: 12,
    marginRight: 4,
    color: primary4,
  },
  idContainer: {
    cursor: 'pointer',
    borderRadius: 4,
    border: cleanBorder,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: primary15,
    marginBottom: 4,
    userSelect: 'none',
  },
};

export function UserHeader({sailplane, title, iconComponent, leftSide}) {
  const [myID, setMyID] = useState(null);
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);

  useEffect(() => {
    const getID = () => {
      try {
        const tmpMyID = compressKey(sailplane._orbitdb.identity.publicKey);

        setMyID(tmpMyID);
      } catch (e) {
        console.log('err', e);
      }
    };

    if (sailplane) {
      getID();
    }
  }, [sailplane]);

  const IconComponent = iconComponent;

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        {title ? (
          <div style={styles.title}>
            <IconComponent
              color={primary3}
              size={16}
              style={styles.headerIcon}
            />
            {title}
          </div>
        ) : (
          leftSide
        )}
      </div>
      <div style={styles.right}>
        {myID ? (
          <div style={styles.userItem}>
            <div
              onClick={async () => {
                setIsQRCodeVisible(true);
              }}
              style={styles.idContainer}>
              <div style={styles.myID}>Show ID</div>
              <Jdenticon value={myID} size={'34'} style={styles.icon} />
            </div>
          </div>
        ) : null}
        <QRDisplayDialog
          value={myID}
          title={'My User ID'}
          isVisible={isQRCodeVisible}
          onClose={() => setIsQRCodeVisible(false)}
        />
      </div>
    </div>
  );
}
