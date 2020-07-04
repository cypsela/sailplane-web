import React, {useState} from 'react';
import {primary4} from './colors';
import {Instance} from './components/Instance';
import {FiPlusCircle, FiUpload} from 'react-icons/fi';
import useTextInput from './hooks/useTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance, removeInstance, setInstanceIndex} from './actions/main';

const styles = {
  container: {
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Open Sans',
  },
  title: {
    color: primary4,
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 16,
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
};

export function Instances({sailplane}) {
  const [addInstanceMode, setAddInstanceMode] = useState(false);
  const [importInstanceMode, setImportInstanceMode] = useState(false);
  const dispatch = useDispatch();
  const main = useSelector((state) => state.main);
  const {instances, instanceIndex} = main;

  const createInstance = async (name) => {
    const address = await sailplane.determineAddress('superdrive', { meta: { name }});

    dispatch(addInstance(name, address.toString()));
    setAddInstanceMode(false);
  };
  const importInstance = async (address) => {
    dispatch(addInstance('Imported #' + (instances.length + 1), address));
    setImportInstanceMode(false);
  };

  const CreateInstanceInput = useTextInput(
    addInstanceMode,
    (instanceName) => createInstance(instanceName),
    () => setAddInstanceMode(false),
    '',
    {
      placeholder: 'instance name',
      actionTitle: 'Create',
    },
  );

  const ImportInstanceInput = useTextInput(
    importInstanceMode,
    (instanceAddress) => importInstance(instanceAddress),
    () => setImportInstanceMode(false),
    '',
    {
      placeholder: 'instance address',
      actionTitle: 'Import',
    },
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Instances</div>
        <div style={styles.tools}>
          {!importInstanceMode && !addInstanceMode ? (
            <>
              <div
                style={styles.tools}
                className={'addInstance'}
                onClick={() => setAddInstanceMode(true)}>
                <FiPlusCircle color={primary4} size={18} style={styles.icon} />
                <span style={{marginRight: 6}}>Create instance</span>
              </div>
              <div
                style={styles.tools}
                className={'addInstance'}
                onClick={() => setImportInstanceMode(true)}>
                <FiUpload color={primary4} size={18} style={styles.icon} />
                <span style={styles.toolTitle}>Import instance</span>
              </div>
            </>
          ) : null}

          {importInstanceMode ? ImportInstanceInput : null}
          {addInstanceMode ? CreateInstanceInput : null}
        </div>
      </div>

      <div>
        {instances.map((instance, index) => (
          <Instance
            key={instance.name}
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
    </div>
  );
}
