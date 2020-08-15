import React, {useState} from 'react';
import {ToolItem} from './ToolItem';
import {FiPlusCircle} from 'react-icons/fi';
import {cleanBorder, primary15, primary4, primary45} from '../utils/colors';
import UserItem from './UserItem';
import {capitalize} from '../utils/Utils';
import ContactModal from './ContactModal';

const styles = {
  adminTools: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  messageText: {
    color: primary45,
    textAlign: 'center',
    marginBottom: 4,
  },
  panel: {
    borderRadius: 4,
    marginBottom: 8,
    border: cleanBorder,
    boxSizing: 'border-box',
    backgroundColor: primary15,
  },
  panelTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 15,
    lineHeight: '15px',
    marginBottom: 4,
    textAlign: 'center',
    color: primary4,
    padding: 4,
    height: 20,
  },
  panelBody: {
    padding: 6,
    backgroundColor: '#FFF',
  },
  third: {
    width: '33.3%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
};
export default function AccessDialogPanel({
  type,
  admins,
  addUser,
  users,
  myID,
  message,
}) {
  const [addMode, setAddMode] = useState(false);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>
        {!addMode ? (
          <>
            <div style={styles.third} />
            <div style={styles.third}>{capitalize(type)}s</div>
          </>
        ) : null}
        <div
          style={{
            ...styles.adminTools,
            ...styles.third,
            justifyContent: 'flex-end',
            width: addMode ? '100%' : '30%',
          }}>
          {admins.includes(myID) && addUser ? (
            <>
              <ToolItem
                iconComponent={FiPlusCircle}
                title={`Add ${type}`}
                changeColor={primary4}
                defaultColor={primary4}
                onClick={() => setIsContactModalVisible(true)}
              />
            </>
          ) : null}
        </div>
      </div>
      <div style={styles.panelBody}>
        <div style={styles.users}>
          {users?.length === 0 ? (
            <div style={styles.messageText}>{message}</div>
          ) : users === null ? (
            <div style={styles.messageText}>Loading...</div>
          ) : (
            <div>
              {users.map((user) => (
                <UserItem key={user} pubKey={user} myID={myID} />
              ))}
            </div>
          )}
        </div>
      </div>
      <ContactModal
        isVisible={isContactModalVisible}
        onClose={() => setIsContactModalVisible(false)}
        onSelected={async (userID) => {
          await addUser(userID);
          setAddMode(false);
        }}
      />
    </div>
  );
}
