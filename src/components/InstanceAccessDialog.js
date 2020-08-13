import React, {useEffect, useState} from 'react';
import {driveName} from '../utils/sailplane-util';
import {Dialog} from './Dialog';
import * as sailplaneAccess from '../utils/sailplane-access';
import {cleanBorder, primary15, primary4, primary45} from '../utils/colors';
import {compressKey, decompressKey} from '../utils/Utils';
import UserItem from './UserItem';
import Well from './Well';
import AccessDialogPanel from './AccessDialogPanel';

export default function InstanceAccessDialog({
  instanceToModifyAccess,
  onClose,
  sharedFS,
}) {
  const [admins, setAdmins] = useState(null);
  const [writers, setWriters] = useState(null);
  const [readers, setReaders] = useState(null);
  const [myID, setMyID] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const styles = {
    adminTools: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    messageText: {
      color: primary45,
      textAlign: 'center',
      marginBottom: 4,
    },
    body: {
      color: primary45,
    },
    panel: {
      borderRadius: 4,
      marginBottom: 8,
      border: cleanBorder,
      boxSizing: 'border-box',
    },
    panelTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 15,
      lineHeight: '15px',
      marginBottom: 4,
      textAlign: 'center',
      backgroundColor: primary15,
      color: primary4,
      padding: 4,
      height: 20,
    },
    panelBody: {
      padding: 6,
    },
    third: {
      width: '33.3%',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'center',
    },
  };

  useEffect(() => {
    const getPerms = () => {
      let tmpAdmins = sailplaneAccess.admin(sharedFS.current);
      let tmpWriters = sailplaneAccess.writers(sharedFS.current);
      let tmpMyID = compressKey(sailplaneAccess.localUserPub(sharedFS.current));

      let tmpReaders = sailplaneAccess.readers(sharedFS.current);

      tmpAdmins = Array.from(tmpAdmins).map((key) => compressKey(key));
      tmpWriters = Array.from(tmpWriters).map((key) => compressKey(key));

      setAdmins(tmpAdmins);
      setWriters(tmpWriters);

      tmpReaders = Array.from(tmpReaders)
        .map((key) => compressKey(key))
        .filter((key) => !tmpAdmins.includes(key))
        .filter((key) => !tmpWriters.includes(key));

      setReaders(tmpReaders);
      setMyID(tmpMyID);
    };

    getPerms();
  }, [instanceToModifyAccess.address, sharedFS, lastUpdate]);

  const addWriter = async (writerID) => {
    setError(null);

    if (!sailplaneAccess.userPubValid(writerID)) {
      setError('Invalid user ID!');
      return;
    }

    await sailplaneAccess.grantWrite(sharedFS.current, decompressKey(writerID));
    await sailplaneAccess.grantRead(sharedFS.current, decompressKey(writerID));

    setLastUpdate(Date.now());
  };

  const addReader = async (readerID) => {
    setError(null);

    if (!sailplaneAccess.userPubValid(readerID)) {
      setError('Invalid user ID!');
      return;
    }

    await sailplaneAccess.grantRead(sharedFS.current, decompressKey(readerID));
    setLastUpdate(Date.now());
  };

  if (!admins || !writers) {
    return null;
  }

  return (
    <Dialog
      isVisible={true}
      title={`User permissions for ${
        instanceToModifyAccess.label ||
        driveName(instanceToModifyAccess.address)
      }`}
      body={
        <div style={styles.body}>
          <Well>
            {admins.includes(myID)
              ? 'You are an admin of this drive. You have full access.'
              : writers.includes(myID)
              ? 'You are a writer on this drive.'
              : 'You have read access only.'}
          </Well>
          {error ? <Well isError={true}>{error}</Well> : null}
          <div style={styles.panels}>
            <div style={styles.panel} id={'adminPanel'}>
              <div style={styles.panelTitle}>
                <div style={styles.third} />
                <div style={styles.third}>Admins</div>
                <div
                  style={{
                    ...styles.adminTools,
                    ...styles.third,
                    justifyContent: 'flex-end',
                    width: '30%',
                  }}
                />
              </div>
              <div style={styles.panelBody}>
                {admins.map((admin) => (
                  <UserItem key={admin} pubKey={admin} myID={myID} />
                ))}
              </div>
            </div>

            <AccessDialogPanel
              myID={myID}
              addUser={addWriter}
              admins={admins}
              users={writers}
              type={'writer'}
              message={'Add users to grant write privileges'}
            />

            {instanceToModifyAccess.isEncrypted ? (
              <AccessDialogPanel
                myID={myID}
                addUser={addReader}
                admins={admins}
                users={readers}
                type={'reader'}
                message={'Add users to grant read privileges'}
              />
            ) : null}
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}
