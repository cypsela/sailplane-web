import React from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {FileBlock} from './FileBlock';
import {useWindowSize} from './hooks/useWindowSize';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
};

function App() {
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;

  return (
    <div style={styles.container}>
      {windowWidth > 600 ? <LeftPanel /> : null}

      <FileBlock />
    </div>
  );
}

export default App;
