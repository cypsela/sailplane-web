import React, {useState} from 'react';
import {UserHeader} from '../components/UserHeader';
import {FaAddressBook} from 'react-icons/fa';
import {ToolItem} from '../components/ToolItem';
import {lightBorder, primary15, primary4, primary45} from '../utils/colors';
import {FiPlusCircle} from 'react-icons/fi';
import Contact from '../components/Contact';
import {compressKey} from '../utils/Utils';
import AddContactDialog from '../components/AddContactDialog';
import {useSelector} from 'react-redux';
import {StatusBar} from '../components/StatusBar';

const styles = {
  container: {
    position: 'relative',
    padding: 10,
    paddingTop: 6,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    height: '100%',
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
  contacts: {
    marginTop: 8,
  },
};

export function Contacts({sailplane, sharedFS}) {
  const contacts = useSelector((state) => state.main.contacts);

  const myID = sharedFS.current?.running
    ? compressKey(sharedFS.current.identity.publicKey)
    : null;

  const [isAddContactDialogVisible, setIsAddContactDialogVisible] = useState(
    false,
  );

  return (
    <div style={styles.container}>
      <UserHeader
        sailplane={sailplane}
        title={'Contacts'}
        iconComponent={FaAddressBook}
      />

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

      <div style={styles.contacts}>
        <Contact pubKey={myID} myID={myID} key={'myid'} />
        {contacts
          ? contacts.map((contact, index) => (
              <Contact
                key={index}
                pubKey={contact.pubKey}
                label={contact.label}
              />
            ))
          : null}
      </div>

      <AddContactDialog
        isVisible={isAddContactDialogVisible}
        onClose={() => setIsAddContactDialogVisible(false)}
        contacts={contacts}
        myID={myID}
      />

      <StatusBar />
    </div>
  );
}
