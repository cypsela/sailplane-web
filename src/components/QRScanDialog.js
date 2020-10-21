import React, {useState} from 'react';
import {Dialog} from './Dialog';
import {primary15} from '../utils/colors';
import QrReader from 'react-qr-reader';
import Well from './Well';
import {publicKeyValid} from '../utils/Utils';

export default function QRScanDialog({isVisible, onClose, onScan}) {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
    },
    dialog: {
      maxWidth: 360,
    }
  };

  const [error, setError] = useState(null);

  return (
    <Dialog
      style={styles.dialog}
      positionTop={1}
      title={'Scan user ID'}
      isVisible={isVisible}
      backgroundColor={primary15}
      onClose={onClose}
      body={
        <div style={styles.container}>
          {!error ? (
            <QrReader
              showViewFinder={false}
              delay={300}
              onError={(err) => setError(err)}
              onScan={(data) => {
                if (publicKeyValid(data)) {
                  onScan(data);
                }
              }}
              style={{width: '100%', maxWidth: 400, alignSelf: 'center'}}
            />
          ) : (
            <div>
              <Well isError={true}>
                This browser does not support camera access.
              </Well>
            </div>
          )}
        </div>
      }
    />
  );
}
