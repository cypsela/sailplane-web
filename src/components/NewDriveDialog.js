import React from 'react';
import {Dialog} from './Dialog';
import {primary15} from '../utils/colors';
import {OptionBlock} from './OptionBlock';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';

export default function NewDriveDialog({
  isVisible,
  onClose,
  onPrivate,
  onPublic,
}) {
  const isSmallScreen = useIsSmallScreen();

  const styles = {
    container: {},
    options: {
      display: isSmallScreen ? 'block' : 'flex',
      justifyContent: 'space-between',
    },
  };

  const driveTypes = [
    {
      title: 'Private',
      infos: [
        'End-to-end encrypted drive data',
        'Add other users to view or modify drives',
        'AES 128 Encryption',
      ],
      onClick: onPrivate,
    },
    {
      title: 'Public',
      infos: [
        'Everything is not encrypted by default',
        'Easily share files with many people',
        'Host content publicly on IPFS',
      ],
      onClick: onPublic,
    },
  ];

  return (
    <Dialog
      onClose={onClose}
      noPadding={isSmallScreen}
      title={'Create a new drive'}
      body={
        <div style={styles.container}>
          <div style={styles.options}>
            {driveTypes.map((type) => (
              <OptionBlock
                key={type.title}
                title={type.title}
                infos={type.infos}
                onClick={type.onClick}
              />
            ))}
          </div>
        </div>
      }
      isVisible={isVisible}
      backgroundColor={primary15}
    />
  );
}
