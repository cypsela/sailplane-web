import React, {useEffect, useState} from 'react';
import {driveName} from '../utils/sailplane-util';
import {Dialog} from '../Dialog';
import * as sailplaneAccess from '../utils/sailplane-access';
import Jdenticon from 'react-jdenticon';
import {primary3, primary4, primary45} from '../colors';
import {ToolItem} from './ToolItem';
import {FiPlusCircle} from 'react-icons/fi';
import useTextInput from '../hooks/useTextInput';

export default function InstanceAccessDialog({
  instanceToModifyAccess,
  onClose,
  sharedFS,
}) {
  const [admin, setAdmin] = useState(null);
  const [writers, setWriters] = useState(null);
  const [addWriterMode, setAddWriterMode] = useState(false);
  const [myID, setMyID] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const styles = {
    adminUser: {
      color: primary4,
      fontSize: 18,
      fontFamily: 'Open Sans',
      lineHeight: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 8,
      borderBottom: `1px solid ${primary3}`,
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
    },
  };
  console.log('users', admin, writers);
  useEffect(() => {
    const getPerms = async () => {
      const tmpAdmin = await sailplaneAccess.admin(sharedFS.current);
      const tmpWriters = await sailplaneAccess.writers(sharedFS.current);
      const tmpMyID = await sailplaneAccess.localUserId(sharedFS.current);
      setAdmin(Array.from(tmpAdmin)[0]);
      setWriters(Array.from(tmpWriters));
      setMyID(tmpMyID);
    };

    getPerms();
  }, [instanceToModifyAccess.address, sharedFS, lastUpdate]);

  const addWriter = async (writerID) => {
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
      confirmTitle: 'Add user',
    },
  );

  if (!admin) {
    return null;
  }

  return (
    <Dialog
      isVisible={true}
      title={`User permissions for ${driveName(
        instanceToModifyAccess.address,
      )}`}
      body={
        <div>
          <div style={styles.adminUser}>
            <div style={styles.adminLeft}>
              <div style={styles.iconHolder}>
                <Jdenticon value={admin} size={34} style={styles.icon} />
              </div>
              <div style={styles.adminNameHolder}>
                <div style={styles.adminTitle}>
                  {myID === admin ? 'Admin [You]' : 'Admin'}
                </div>
                <div>{admin.slice(0, 6)}</div>
              </div>
            </div>
            <div style={styles.adminTools}>
              {!addWriterMode ? (
                <>
                  <ToolItem
                    iconComponent={FiPlusCircle}
                    title={'Add user'}
                    changeColor={primary4}
                    defaultColor={primary45}
                    onClick={() => setAddWriterMode(true)}
                  />
                </>
              ) : null}
              {addWriterMode ? AddWriterInput : null}
            </div>
          </div>
          <div style={styles.writers}>
            {writers?.length === 0 ? <div>
              Add some users
            </div> : <div></div>}
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}
