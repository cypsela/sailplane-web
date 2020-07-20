import React, {useEffect, useState} from 'react';
import {driveName} from '../utils/sailplane-util';
import {Dialog} from '../Dialog';
import * as SailplaneAccess from '../utils/sailplaneAccess';
import Jdenticon from 'react-jdenticon';

export default function InstanceAccessDialog({
  instanceToModifyAccess,
  onClose,
  sharedFS,
}) {
  const [admin, setAdmin] = useState(null);
  const [writers, setWriters] = useState(null);
  console.log('state', admin, writers);

  useEffect(() => {
    const getPerms = async () => {
      console.log('share', sharedFS);
      const admin = await SailplaneAccess.admin(sharedFS.current);
      const writers = await SailplaneAccess.writers(sharedFS.current);
      setAdmin(Array.from(admin)[0]);
      setWriters(Array.from(writers));
    };
    getPerms();
  }, [instanceToModifyAccess.address, sharedFS]);

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
          <div>
            <Jdenticon value={instanceToModifyAccess.address} size={34} />
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}
