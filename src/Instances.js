import React from 'react';
import {primary3, primary4} from './colors';
import {Instance} from './components/Instance';

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
};

export function Instances({
  instanceAddresses,
  setInstanceAddressIndex,
  instanceAddressIndex,
}) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>Instances</div>

      <div>
        {instanceAddresses.map((instance) => (
          <Instance key={instance.name} data={instance} selected={instance === instanceAddresses[instanceAddressIndex]} />
        ))}
      </div>
    </div>
  );
}
