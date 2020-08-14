import React, {useState} from 'react';
import {Dialog} from './Dialog';
import {primary, primary15, primary3, primary45} from '../utils/colors';
import * as sailplaneUtil from '../utils/sailplane-util';
import {addressManifest} from '../utils/sailplane-util';
import {addInstance} from '../actions/main';
import useTextInput from '../hooks/useTextInput';
import {useDispatch} from 'react-redux';
import Well from './Well';
import {FiLoader} from 'react-icons/fi';
import {Instance} from './Instance';
import {BigButton} from './BigButton';
import OrbitDBAddress from 'orbit-db/src/orbit-db-address';

export default function ImportDriveDialog({
  onClose,
  isVisible,
  instances,
  sailplane,
}) {
  const dispatch = useDispatch();
  const [isAddressSet, setIsAddressSet] = useState(false);
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState('');
  const [driveData, setDriveData] = useState(null);

  const styles = {
    addressInput: {
      display: 'flex',
      alignItems: 'center',
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
    confirmBlock: {
      marginTop: 14,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    cancel: {
      marginRight: 8,
    },
    labelTitle: {
      marginTop: 12,
      marginBottom: 4,
    },
    optional: {
      position: 'relative',
      top: -8,
      left: 4,
      fontSize: 13,
    },
    input: {
      border: `1px solid ${primary3}`,
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      fontWeight: 200,
      padding: 4,
      marginRight: 4,
      display: 'inline-flex',
      width: '100%',
      boxSizing: 'border-box',
    },
  };

  const ImportInstanceInput = useTextInput(
    !isAddressSet,
    (instanceAddress) => getManifest(instanceAddress),
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

  const importInstance = async () => {
    const {address, manifest} = driveData;
    const driveName = sailplaneUtil.driveName(address);

    dispatch(
      addInstance(
        driveName,
        address,
        true,
        manifest.meta.enc === true,
        nickname,
      ),
    );

    onClose();
  };

  const getManifest = async (address) => {
    const handleInvalidAddress = () => {
      setError('Invalid address!');
    };

    if (OrbitDBAddress.isValid(address)) {
      setIsAddressSet(true);

      if (instances.map((s) => s.address).includes(address)) {
        const driveName = sailplaneUtil.driveName(address);

        setError(`Drive '${driveName}' already exists!`);
        setIsAddressSet(false);
        return;
      }

      const manifest = await addressManifest(sailplane, address);

      setDriveData({address, manifest});
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
          ) : !driveData ? (
            <div style={styles.loading}>
              Looking for drive
              <FiLoader
                color={primary45}
                size={16}
                style={styles.icon}
                className={'rotating'}
              />
            </div>
          ) : (
            <div>
              <div style={styles.title}>Drive has been located!</div>
              <div style={styles.loadedDrive}>
                <Instance
                  displayOnly={true}
                  selected={true}
                  data={{
                    address: driveData.address,
                    isEncrypted: driveData.manifest.meta?.enc,
                  }}
                />
              </div>

              <div style={{...styles.title, ...styles.labelTitle}}>
                Nickname
                <span style={styles.optional}>(optional)</span>
              </div>

              <input
                type={'text'}
                onChange={(event) => setNickname(event.target.value)}
                autoCorrect={'off'}
                style={styles.input}
                placeholder={`(ex: Work sketches)`}
                className={'textInput'}
              />

              <div style={styles.confirmBlock}>
                <BigButton
                  title={'Cancel'}
                  inverted={false}
                  noHover={true}
                  customWhiteColor={primary15}
                  style={styles.cancel}
                  onClick={onClose}
                />
                <BigButton
                  title={'Confirm'}
                  onClick={importInstance}
                  inverted={true}
                  customWhiteColor={primary15}
                />
              </div>
            </div>
          )}
        </div>
      }
      onClose={onClose}
    />
  );
}
