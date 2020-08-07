import React, {useEffect, useState} from 'react';
import {driveName} from '../utils/sailplane-util';
import {Dialog} from './Dialog';
import * as sailplaneAccess from '../utils/sailplane-access';
import Jdenticon from 'react-jdenticon';
import {cleanBorder, primary15, primary4, primary45} from '../utils/colors';
import {ToolItem} from './ToolItem';
import {FiPlusCircle} from 'react-icons/fi';
import useTextInput from '../hooks/useTextInput';
import useDimensions from 'react-use-dimensions';
import {compressKey, decompressKey} from '../utils/Utils';
import UserItem from './UserItem';

export default function InstanceAccessDialog({
  instanceToModifyAccess,
  onClose,
  sharedFS,
}) {
  const [admins, setAdmins] = useState(null);
  const [writers, setWriters] = useState(null);
  const [readers, setReaders] = useState(null);
  const [addWriterMode, setAddWriterMode] = useState(false);
  const [addReaderMode, setAddReaderMode] = useState(false);
  const [myID, setMyID] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dialogDimensionsRef, dialogDimensions] = useDimensions();

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
    panels: {
      // display: 'flex',
      // justifyContent: 'space-between',
    },
    panel: {
      borderRadius: 4,
      // width: '49%',
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
    alert: {
      backgroundColor: primary15,
      color: primary4,
      fontSize: 14,
      padding: 6,
      borderRadius: 4,
      marginBottom: 8,
      border: cleanBorder,
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
    if (!sailplaneAccess.userPubValid(writerID)) {
      return;
    }

    await sailplaneAccess.grantWrite(sharedFS.current, decompressKey(writerID));
    await sailplaneAccess.grantRead(sharedFS.current, decompressKey(writerID));

    setLastUpdate(Date.now());
    setAddWriterMode(false);
  };

  const addReader = async (readerID) => {
    if (!sailplaneAccess.userPubValid(readerID)) {
      return;
    }

    await sailplaneAccess.grantRead(sharedFS.current, decompressKey(readerID));
    setLastUpdate(Date.now());
    setAddReaderMode(false);
  };

  const AddWriterInput = useTextInput(
    addWriterMode,
    (writerID) => addWriter(writerID),
    () => setAddWriterMode(false),
    '',
    {
      placeholder: 'user id',
      confirmTitle: 'Add writer',
    },
  );

  const AddReaderInput = useTextInput(
    addReaderMode,
    (readerID) => addReader(readerID),
    () => setAddReaderMode(false),
    '',
    {
      placeholder: 'user id',
      confirmTitle: 'Add reader',
    },
  );

  if (!admins || !writers) {
    return null;
  }

  return (
    <Dialog
      isVisible={true}
      title={`User permissions for ${driveName(
        instanceToModifyAccess.address,
      )}`}
      body={
        <div style={styles.body} ref={dialogDimensionsRef}>
          <div style={styles.alert}>
            {admins.includes(myID)
              ? 'You are an admin of this drive. You have full access.'
              : writers.includes(myID)
              ? 'You are a writer on this drive.'
              : 'You have read access only.'}
          </div>
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
                    width: addWriterMode ? '100%' : '30%',
                  }}
                />
              </div>
              <div style={styles.panelBody}>
                {admins.map((admin) => (
                  <UserItem pubKey={admin} myID={myID} />
                ))}
              </div>
            </div>

            <div style={styles.panel} id={'writerPanel'}>
              <div style={styles.panelTitle}>
                {!addWriterMode ? (
                  <>
                    <div style={styles.third} />
                    <div style={styles.third}>Writers</div>
                  </>
                ) : null}
                <div
                  style={{
                    ...styles.adminTools,
                    ...styles.third,
                    justifyContent: 'flex-end',
                    width: addWriterMode ? '100%' : '30%',
                  }}>
                  {!addWriterMode && admins.includes(myID) ? (
                    <>
                      <ToolItem
                        iconComponent={FiPlusCircle}
                        title={'Add writer'}
                        changeColor={primary4}
                        defaultColor={primary4}
                        onClick={() => setAddWriterMode(true)}
                      />
                    </>
                  ) : null}
                  {addWriterMode ? AddWriterInput : null}
                </div>
              </div>
              <div style={styles.panelBody}>
                <div style={styles.writers}>
                  {writers?.length === 0 ? (
                    <div style={styles.messageText}>
                      Add users to grant write privileges
                    </div>
                  ) : writers === null ? (
                    <div style={styles.messageText}>Loading...</div>
                  ) : (
                    <div>
                      {writers.map((writer) => (
                        <UserItem pubKey={writer} myID={myID} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {instanceToModifyAccess.isEncrypted ? (
              <div style={styles.panel} id={'readerPanel'}>
                <div style={styles.panelTitle}>
                  {!addReaderMode ? (
                    <>
                      <div style={styles.third} />
                      <div style={styles.third}>Readers</div>
                    </>
                  ) : null}
                  <div
                    style={{
                      ...styles.adminTools,
                      ...styles.third,
                      justifyContent: 'flex-end',
                      width: addReaderMode ? '100%' : '30%',
                    }}>
                    {!addReaderMode && admins?.includes(myID) ? (
                      <>
                        <ToolItem
                          iconComponent={FiPlusCircle}
                          title={'Add reader'}
                          changeColor={primary4}
                          defaultColor={primary4}
                          onClick={() => setAddReaderMode(true)}
                        />
                      </>
                    ) : null}
                    {addReaderMode ? AddReaderInput : null}
                  </div>
                </div>
                <div style={styles.panelBody}>
                  <div style={styles.writers}>
                    {readers?.length === 0 ? (
                      <div style={styles.messageText}>
                        Add users to grant read privileges
                      </div>
                    ) : readers === null ? (
                      <div style={styles.messageText}>Loading...</div>
                    ) : (
                      <div>
                        {readers.map((reader) => (
                          <UserItem pubKey={reader} myID={myID} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}
