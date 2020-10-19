import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Contact from './Contact';
import {Dialog} from './Dialog';
import {ToolItem} from './ToolItem';
import {lightBorder, primary15, primary4, primary45} from '../utils/colors';
import {FiPlusCircle} from 'react-icons/fi';
import AddContactDialog from './AddContactDialog';

export default function ContactModal({isVisible, onClose, onSelected}) {
  const contacts = useSelector((state) => state.main.contacts);
  const [isAddContactDialogVisible, setIsAddContactDialogVisible] = useState(
    false,
  );

  const styles = {
    container: {
      maxHeight: 400,
    },
    title: {
      fontSize: 18,
      fontWeight: 600,
    },
    toolsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 2,
      marginBottom: 4,
      color: primary45,
      fontSize: 12,
    },
    tools: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      color: primary45,
      fontSize: 12,
      backgroundColor: primary15,
      borderRadius: 2,
      padding: 2,
      border: `1px solid ${lightBorder}`,
    },
    noContacts: {
      marginTop: 8,
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
          <div style={styles.toolsContainer}>
            <div style={styles.tools}>
              <>
                <ToolItem
                  className={'addContact'}
                  defaultColor={primary45}
                  changeColor={primary4}
                  iconComponent={FiPlusCircle}
                  title={'Add contact'}
                  onClick={() => setIsAddContactDialogVisible(true)}
                />
              </>
            </div>
          </div>

          {contacts?.length ? (
            contacts.map((contact, i) => (
              <Contact
                key={i}
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
            <div style={styles.noContacts}>No existing contacts</div>
          )}

          <AddContactDialog
            isVisible={isAddContactDialogVisible}
            onClose={() => setIsAddContactDialogVisible(false)}
            contacts={contacts}
          />
        </div>
      }
    />
  );
}
