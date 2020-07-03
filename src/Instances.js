import React, {useEffect, useState} from 'react';
import {primary3, primary4} from './colors';
import {Instance} from './components/Instance';
import {FiPlusCircle} from 'react-icons/fi';
import useTextInput from './hooks/useTextInput';

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
    // borderBottom: `2px solid ${primary3}`,
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

export function Instances({
  instanceAddresses,
  setInstanceAddressIndex,
  setInstanceAddresses,
  instanceAddressIndex,
  sailplane,
}) {
  const [addInstanceMode, setAddInstanceMode] = useState(false);

  const createInstance = async (name) => {
    const address = await sailplane.determineAddress(`superdrive_${name}`);

    setInstanceAddresses([
      ...instanceAddresses,
      {
        name,
        address: address.toString(),
      },
    ]);

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
        {instanceAddresses.map((instance, index) => (
          <Instance
            key={instance.name}
            data={instance}
            selected={instance === instanceAddresses[instanceAddressIndex]}
            onClick={() => {
              setInstanceAddressIndex(index);
              document.location.reload();

            }}
          />
        ))}
      </div>
    </div>
  );
}
