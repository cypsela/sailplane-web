import React from 'react';
import {useSelector} from 'react-redux';
import Contact from './Contact';
import {Dialog} from './Dialog';

export default function ContactModal({isVisible, onClose, onSelected}) {
  const contacts = useSelector((state) => state.main.contacts);
  const styles = {
    container: {
      maxHeight: 400,
    },
    title: {
      fontSize: 18,
      fontWeight: 600,
    },
  };

  return (
    <Dialog
      positionTop={1}
      onClose={onClose}
      isVisible={isVisible}
      title={'Contacts'}
      body={
        <div style={styles.container}>
          {contacts?.length ? (
            contacts.map((contact) => (
              <Contact
                onClick={() => {
                  onSelected(contact.pubKey);
                  onClose();
                }}
                label={contact.label}
                pubKey={contact.pubKey}
                hideTools={true}
              />
            ))
          ) : (
            <div>No contacts!</div>
          )}
        </div>
      }
    />
  );
}
