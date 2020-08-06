import React, {useEffect, useState} from 'react';
import {lightBorder, primary15, primary4, primary45} from '../utils/colors';
import {Instance} from '../components/Instance';
import {FiPlusCircle, FiUpload} from 'react-icons/fi';
import {FaServer} from 'react-icons/fa';
import useTextInput from '../hooks/useTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance, removeInstance, setInstanceIndex} from '../actions/main';
import {setStatus} from '../actions/tempData';
import {StatusBar} from '../components/StatusBar';
import usePrevious from '../hooks/usePrevious';
import {delay} from '../utils/Utils';
import * as sailplaneUtil from '../utils/sailplane-util';
import InstanceAccessDialog from '../components/InstanceAccessDialog';
import {UserHeader} from '../components/UserHeader';
import {ToolItem} from '../components/ToolItem';
import NewDriveDialog from '../components/NewDriveDialog';
import {addressManifest} from "../utils/sailplane-util";

const styles = {
  container: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Open Sans',
    boxSizing: 'border-box',
    paddingTop: 6,
  },
  toolsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
    color: primary45,
    fontSize: 12,
  },
  icon: {
    cursor: 'pointer',
    marginRight: 4,
  },
  tools: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: primary45,
    fontSize: 12,
    backgroundColor: primary15,
    borderRadius: 2,
    padding: 2,
    border: `1px solid ${lightBorder}`,
  },
};

export function Instances({sailplane, sharedFS}) {
  const [addInstanceMode, setAddInstanceMode] = useState(false);
  const [importInstanceMode, setImportInstanceMode] = useState(false);
  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
  const [instanceToModifyAccess, setInstanceToModifyAccess] = useState(null);
  const dispatch = useDispatch();
  const main = useSelector((state) => state.main);
  const {instances, instanceIndex} = main;
  const prevInstanceLength = usePrevious(instances.length);

  useEffect(() => {
    if (prevInstanceLength && prevInstanceLength < instances.length) {
      dispatch(setInstanceIndex(instances.length - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instances.length, prevInstanceLength]);

  const createInstance = async (isEncrypted) => {
    setIsCreateDialogVisible(false);

    const address = await sailplaneUtil.determineAddress(sailplane, {
      enc: isEncrypted,
    });
    const driveName = sailplaneUtil.driveName(address);

    dispatch(addInstance(driveName, address.toString(), false, isEncrypted));
    setAddInstanceMode(false);
  };

  const importInstance = async (address) => {
    const handleInvalidAddress = () => {
      dispatch(setStatus({message: 'Invalid address', isError: true}));
      delay(5500).then(() => dispatch(setStatus({})));
    };
    if (await sailplaneUtil.addressValid(sailplane, address)) {
      const driveName = sailplaneUtil.driveName(address);

      const manifest = await addressManifest(sailplane, address);
      console.log('manifest', manifest)

      if (instances.map((s) => s.address).includes(address)) {
        dispatch(
          setStatus({
            message: `Drive [${driveName}] already exists`,
            isError: true,
          }),
        );
        delay(5500).then(() => dispatch(setStatus({})));
        return;
      }

      dispatch(addInstance(driveName, address, true, manifest.meta.enc === true));
      setImportInstanceMode(false);
    } else {
      handleInvalidAddress();
    }
  };

  const ImportInstanceInput = useTextInput(
    importInstanceMode,
    (instanceAddress) => importInstance(instanceAddress),
    () => setImportInstanceMode(false),
    '',
    {
      placeholder: 'drive address',
    },
  );

  return (
    <div style={styles.container}>
      <UserHeader
        sharedFS={sharedFS}
        title={'Drives'}
        iconComponent={FaServer}
      />
      <div style={styles.toolsContainer}>
        <div style={styles.tools}>
          {!importInstanceMode && !addInstanceMode ? (
            <>
              <ToolItem
                className={'importInstance'}
                defaultColor={primary45}
                changeColor={primary4}
                iconComponent={FiUpload}
                title={'Import drive'}
                onClick={() => setImportInstanceMode(true)}
              />

              <ToolItem
                className={'addInstance'}
                defaultColor={primary45}
                changeColor={primary4}
                iconComponent={FiPlusCircle}
                title={'Create drive'}
                onClick={() => setIsCreateDialogVisible(true)}
              />
            </>
          ) : null}

          {importInstanceMode ? ImportInstanceInput : null}
        </div>
      </div>

      <div style={styles.instances}>
        {instances.map((instance, index) => (
          <Instance
            instanceIndex={index}
            key={instance.address.toString()}
            data={instance}
            selected={instance === instances[instanceIndex]}
            onClick={() => {
              dispatch(setInstanceIndex(index));
            }}
            onDelete={() => {
              dispatch(removeInstance(index));
            }}
            onAccess={() => {
              dispatch(setInstanceIndex(index));
              setTimeout(() => setInstanceToModifyAccess(instance), 500);
            }}
          />
        ))}
      </div>
      {instanceToModifyAccess ? (
        <InstanceAccessDialog
          onClose={() => setInstanceToModifyAccess(null)}
          instanceToModifyAccess={instanceToModifyAccess}
          sharedFS={sharedFS}
        />
      ) : null}
      <NewDriveDialog
        isVisible={isCreateDialogVisible}
        onClose={() => setIsCreateDialogVisible(false)}
        onPrivate={() => createInstance(true)}
        onPublic={() => createInstance(false)}
      />
      <StatusBar />
    </div>
  );
}
