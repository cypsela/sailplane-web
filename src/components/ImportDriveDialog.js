import React, {useState} from 'react';
import {Dialog} from './Dialog';
import {primary15, primary45} from '../utils/colors';
import * as sailplaneUtil from '../utils/sailplane-util';
import {addressManifest} from '../utils/sailplane-util';
import {addInstance} from '../actions/main';
import useTextInput from '../hooks/useTextInput';
import {useDispatch} from 'react-redux';
import Well from './Well';
import {FiLoader} from 'react-icons/fi';

export default function ImportDriveDialog({
  onClose,
  isVisible,
  instances,
  sailplane,
}) {
  const dispatch = useDispatch();
  const [isAddressSet, setIsAddressSet] = useState(false);
  const [error, setError] = useState(null);

  const styles = {
    addressInput: {
      display: 'flex',
    },
    title: {
      fontSize: 16,
      color: primary45,
      marginBottom: 8,
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      color: primary45,
    },
    icon: {
      marginLeft: 4,
    },
  };

  const ImportInstanceInput = useTextInput(
    !isAddressSet,
    (instanceAddress) => importInstance(instanceAddress),
    null,
    '',
    {
      placeholder: 'drive address',
      confirmTitle: 'Import drive',
    },
  );

  if (!isVisible) {
    return null;
  }

  const importInstance = async (address) => {
    const handleInvalidAddress = () => {
      setError('Invalid address!');
    };
    if (await sailplaneUtil.addressValid(sailplane, address)) {
      setIsAddressSet(true);

      const driveName = sailplaneUtil.driveName(address);
      const manifest = await addressManifest(sailplane, address);

      if (instances.map((s) => s.address).includes(address)) {
        setError(`Drive '${driveName}' already exists!`);
        setIsAddressSet(false);
        return;
      }

      dispatch(
        addInstance(driveName, address, true, manifest.meta.enc === true),
      );

      onClose();
    } else {
      handleInvalidAddress();
    }
  };

  return (
    <Dialog
      backgroundColor={primary15}
      isVisible={true}
      title={`Import drive`}
      body={
        <div style={styles.body}>
          {!isAddressSet ? (
            <div>
              <div style={styles.title}>
                Paste a drive address below to import it into your drives
              </div>

              {error ? <Well isError={true}>{error}</Well> : null}

              <div style={styles.addressInput}>
                {!isAddressSet ? ImportInstanceInput : null}
              </div>
            </div>
          ) : (
            <div style={styles.loading}>
              Looking for drive
              <FiLoader
                color={primary45}
                size={16}
                style={styles.icon}
                className={'rotating'}
              />
            </div>
          )}
        </div>
      }
      onClose={onClose}
    />
  );
}
