import React, {useEffect, useState} from 'react';
import {driveName} from '../utils/sailplane-util';
import {Dialog} from './Dialog';
import * as sailplaneAccess from '../utils/sailplane-access';
import {primary45} from '../utils/colors';
import {compressKey, decompressKey} from '../utils/Utils';
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
    body: {
      color: primary45,
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
              ? 'You are an editor on this drive.'
              : 'You have view access only.'}
          </Well>

          {error ? <Well isError={true}>{error}</Well> : null}

          <div style={styles.panels}>
            <AccessDialogPanel
              myID={myID}
              admins={admins}
              users={admins}
              type={'admin'}
            />

            <AccessDialogPanel
              myID={myID}
              addUser={addWriter}
              admins={admins}
              users={writers}
              type={'editor'}
              message={'Add users to editor access'}
            />

            {instanceToModifyAccess.isEncrypted ? (
              <AccessDialogPanel
                myID={myID}
                addUser={addReader}
                admins={admins}
                users={readers}
                type={'viewer'}
                message={'Add users to view access'}
              />
            ) : null}
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}
