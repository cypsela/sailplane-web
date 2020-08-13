import React from 'react';
import {UserHeader} from '../components/UserHeader';
import {FaAddressBook} from 'react-icons/fa';
import {ToolItem} from '../components/ToolItem';
import {lightBorder, primary15, primary4, primary45} from '../utils/colors';
import {FiPlusCircle} from 'react-icons/fi/index';
import Contact from '../components/Contact';
import {compressKey} from "../utils/Utils";
import * as sailplaneAccess from "../utils/sailplane-access";

const styles = {
  container: {
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
  }
};

export function Contacts({sailplane, sharedFS}) {
  let myID = compressKey(sailplaneAccess.localUserPub(sharedFS.current));

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
              // onClick={() => setIsCreateDialogVisible(true)}
            />
          </>
        </div>
      </div>

      <div style={styles.contacts}>
        <Contact pubKey={myID} myID={myID}/>
      </div>
    </div>
  );
}
