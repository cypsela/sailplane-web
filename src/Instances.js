import React, {useState} from 'react';
import {primary4} from './colors';
import {Instance} from './components/Instance';
import {FiPlusCircle} from 'react-icons/fi';
import useTextInput from './hooks/useTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance, setInstanceIndex} from './actions/main';

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
    paddingBottom: 6,
    marginBottom: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
  const dispatch = useDispatch();
  const main = useSelector((state) => state.main);
  const {instances, instanceIndex} = main;
  const currentInstance = instances[instanceIndex];

  const createInstance = async (name) => {
    const address = await sailplane.determineAddress(`superdrive_${name}`);

    dispatch(addInstance(name, address.toString()));
    setAddInstanceMode(false);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Instances</div>
        <div style={styles.tools}>
          {!addInstanceMode ? (
            <div
              style={styles.tools}
              className={'addInstance'}
              onClick={() => setAddInstanceMode(true)}>
              <FiPlusCircle color={primary4} size={18} style={styles.icon} />
              Add instance
            </div>
          ) : (
            CreateInstanceInput
          )}
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
          />
        ))}
      </div>
    </div>
  );
}
