import React from 'react';
import {Dialog} from './Dialog';
import {primary15} from '../utils/colors';
import {OptionBlock} from './OptionBlock';
import InfoItem from './InfoItem';
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
        'Everything is encrypted by default',
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
        'Can still encrypt individual files',
      ],
      onClick: onPublic,
    },
  ];

  return (
    <Dialog
      onClose={onClose}
      noPadding={isSmallScreen ? true : false}
      title={'Create a new drive'}
      body={
        <div style={styles.container}>
          <div style={styles.options}>
            {driveTypes.map((type) => (
              <OptionBlock
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
