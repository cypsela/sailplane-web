import React, {useState} from 'react';
import {Dialog} from './Dialog';
import {cleanBorder, primary15} from '../utils/colors';
import QRCode from 'qrcode.react';
import {BigButton} from './BigButton';
import {copyToClipboard} from '../utils/Utils';

export default function QRDisplayDialog({isVisible, onClose, value, title}) {
  const [copied, setCopied] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
    },
    key: {
      fontSize: 18,
      fontWeight: 600,
      marginTop: 8,
      textAlign: 'center',
    },
    buttonHolder: {
      marginTop: 12,
      textAlign: 'center',
    },
    dialog: {
      maxWidth: 360,
    },
    qr: {
      border: cleanBorder,
      borderRadius: 4,
    }
  };

  return (
    <Dialog
      style={styles.dialog}
      title={title}
      isVisible={isVisible}
      backgroundColor={primary15}
      onClose={onClose}
      body={
        <div style={styles.container}>
          <div>
            <QRCode value={value} size={256} includeMargin={true} style={styles.qr}/>
            <div style={styles.copy}>
              <div style={styles.key}>{value?.substr(0, 10)}...</div>
              <div style={styles.buttonHolder}>
                <BigButton
                  title={copied ? 'Copied!' : 'Copy ID'}
                  style={styles.copyButton}
                  onClick={async () => {
                    await copyToClipboard(value);
                    setCopied(true);

                    setTimeout(() => setCopied(false), 1500);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
