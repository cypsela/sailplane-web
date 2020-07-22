import React, {useEffect, useState} from 'react';
import {driveName} from '../utils/sailplane-util';
import {Dialog} from '../Dialog';
import * as sailplaneAccess from '../utils/sailplane-access';
import Jdenticon from 'react-jdenticon';
import {cleanBorder, primary15, primary2, primary4, primary45} from '../colors';
import {ToolItem} from './ToolItem';
import {FiUserPlus} from 'react-icons/fi';
import useTextInput from '../hooks/useTextInput';
import useDimensions from 'react-use-dimensions';

export default function InstanceAccessDialog({
  instanceToModifyAccess,
  onClose,
  sharedFS,
}) {
  const [admins, setAdmins] = useState(null);
  const [writers, setWriters] = useState(null);
  const [addWriterMode, setAddWriterMode] = useState(false);
  const [myID, setMyID] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dialogDimensionsRef, dialogDimensions] = useDimensions();

  const styles = {
    userBlock: {
      color: primary4,
      fontSize: 18,
      fontFamily: 'Open Sans',
      lineHeight: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 6,
    },
    adminLeft: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    iconHolder: {
      marginRight: 8,
    },
    adminTitle: {
      fontSize: 12,
      lineHeight: '12px',
      textAlign: 'center',
      color: primary45,
      marginBottom: 3,
    },
    adminTools: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    messageText: {
      color: primary45,
      textAlign: 'center',
      marginTop: 8,
    },
    body: {
      color: primary45,
    },
    panels: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    panel: {
      borderRadius: 4,
      width: '49%',
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
    youText: {
      fontSize: 14,
    },
    alert: {
      backgroundColor: primary15,
      color: primary4,
      fontSize: 14,
      padding: 6,
      borderRadius: 4,
      marginBottom: 6,
      border: cleanBorder,
    },
  };

  useEffect(() => {
    const getPerms = async () => {
      const tmpAdmins = await sailplaneAccess.admin(sharedFS.current);
      const tmpWriters = await sailplaneAccess.writers(sharedFS.current);
      const tmpMyID = await sailplaneAccess.localUserId(sharedFS.current);
      setAdmins(Array.from(tmpAdmins));
      setWriters(Array.from(tmpWriters));
      setMyID(tmpMyID);
    };

    getPerms();
  }, [instanceToModifyAccess.address, sharedFS, lastUpdate]);

  const addWriter = async (writerID) => {
    if (!sailplaneAccess.userIdValid(writerID)) {
      return;
    }

    await sailplaneAccess.grantWrite(sharedFS.current, writerID);
    setLastUpdate(Date.now());
    setAddWriterMode(false);
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
            <div style={styles.panel}>
              <div style={styles.panelTitle}>
                <div style={styles.third} />
                <div style={styles.third}>Admins</div>
                <div
                  style={{
                    ...styles.adminTools,
                    ...styles.third,
                    justifyContent: 'flex-end',
                  }}></div>
              </div>
              <div style={styles.panelBody}>
                {admins.map((admin) => (
                  <div style={styles.userBlock}>
                    <div style={styles.adminLeft}>
                      <div style={styles.iconHolder}>
                        <Jdenticon
                          value={admin}
                          size={34}
                          style={styles.icon}
                        />
                      </div>
                      <div style={styles.adminNameHolder}>
                        <div style={styles.adminTitle}></div>
                        <div>
                          {admin.slice(0, 6)}{' '}
                          {myID === admin ? (
                            <span style={styles.youText}>[You]</span>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.panel}>
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
                        iconComponent={FiUserPlus}
                        // title={
                        //   dialogDimensions?.width > 540 ? 'Add writer' : null
                        // }
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
                        <div
                          style={{
                            ...styles.userBlock,
                          }}>
                          <div style={styles.adminLeft}>
                            <div style={styles.iconHolder}>
                              <Jdenticon
                                value={writer}
                                size={34}
                                style={styles.icon}
                              />
                            </div>
                            <div style={styles.adminNameHolder}>
                              <div>
                                {writer.slice(0, 6)}{' '}
                                {myID === writer ? (
                                  <span style={styles.youText}>[You]</span>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={styles.adminTools}></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}
