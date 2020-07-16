import React, {useEffect, useState} from 'react';
import {primary4, primary45} from './colors';
import {Instance} from './components/Instance';
import {FiPlusCircle, FiUpload} from 'react-icons/fi';
import {FaServer} from 'react-icons/fa';
import useTextInput from './hooks/useTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance, removeInstance, setInstanceIndex} from './actions/main';
import OrbitDBAddress from 'orbit-db/src/orbit-db-address';
import {StatusBar} from './StatusBar';
import usePrevious from './hooks/usePrevious';

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
  },
  title: {
    color: primary4,
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 10,
  },
  icon: {
    cursor: 'pointer',
    marginRight: 4,
  },
  tools: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: primary4,
    fontSize: 14,
  },
  toolTitle: {
    marginRight: 6,
  },
  instances: {
    marginTop: 6,
  },
};

export function Instances({sailplane}) {
  const [addInstanceMode, setAddInstanceMode] = useState(false);
  const [importInstanceMode, setImportInstanceMode] = useState(false);
  const dispatch = useDispatch();
  const main = useSelector((state) => state.main);
  const {instances, instanceIndex} = main;
  const prevInstanceLength = usePrevious(instances.length);

  useEffect(() => {
    if (prevInstanceLength && prevInstanceLength !== instances.length) {
      dispatch(setInstanceIndex(instances.length - 1));
    }
  }, [instances.length, prevInstanceLength]);

  const createInstance = async (name) => {
    const address = await sailplane.determineAddress(name, {
      meta: 'superdrive',
    });

    dispatch(addInstance(address.path, address.toString(), false));
    setAddInstanceMode(false);
  };
  const importInstance = async (address) => {
    if (OrbitDBAddress.isValid(address)) {
      address = OrbitDBAddress.parse(address);
      dispatch(addInstance(address.path, address.toString(), true));
      setImportInstanceMode(false);
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

  const CreateInstanceInput = useTextInput(
    addInstanceMode,
    (instanceName) => createInstance(instanceName),
    () => setAddInstanceMode(false),
    '',
    {
      placeholder: 'drive name',
    },
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <FaServer color={primary45} size={16} style={styles.icon} />
          Drives
        </div>
        <div style={styles.tools}>
          {!importInstanceMode && !addInstanceMode ? (
            <>
              <div
                style={styles.tools}
                className={'addInstance'}
                onClick={() => setImportInstanceMode(true)}>
                <FiUpload color={primary4} size={18} style={styles.icon} />
                <span style={styles.toolTitle}>Import drive</span>
              </div>
              <div
                style={styles.tools}
                className={'addInstance'}
                onClick={() => setAddInstanceMode(true)}>
                <FiPlusCircle color={primary4} size={18} style={styles.icon} />
                <span style={styles.toolTitle}>Create drive</span>
              </div>
            </>
          ) : null}

          {importInstanceMode ? ImportInstanceInput : null}
          {addInstanceMode ? CreateInstanceInput : null}
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
          />
        ))}
      </div>
      <StatusBar />
    </div>
  );
}
