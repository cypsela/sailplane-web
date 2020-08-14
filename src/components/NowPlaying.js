import React, {useRef} from 'react';
import {isChrome} from '../utils/Utils';
import {primary2, primary3, primary4} from '../utils/colors';

export function NowPlaying({currentAudio, setPlaying}) {
  const styles = {
    outer: {
      width: '100%',
      backgroundColor: primary2,
      padding: 18,
      borderRadius: 4,
      boxShadow: `rgb(70, 145, 191) 0px 0px 4px`,
      marginTop: 10,
      marginBottom: 8,
    },
    container: {
      width: '100%',
      color: '#FFF',
      backgroundColor: primary3,
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: 10,
      height: 50,
      boxShadow: `1px 2px 3px #4691bfad inset`,
    },
    name: {
      fontFamily: 'MuseoModerno',
      lineHeight: '16px',
      fontWeight: '500',
      fontStyle: 'italic',
      textAlign: 'center',
    },
    audio: {
      width: '100%',
      userSelect: 'none',
      outline: 0,
      boxShadow: `0px 0px 2px ${primary4}`,
      borderRadius: 30,
    },
  };

  const audioRef = useRef(null);

  let audioInfo = {
    filename: 'Not Playing',
  };
  if (currentAudio) {
    audioInfo = currentAudio;
  }
  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        <div style={styles.name}>
          {isChrome ? (
            <marquee scrollamount={4} behavior={'scroll'}>
              {audioInfo.filename ? audioInfo.filename : 'Not playing'}
            </marquee>
          ) : (
            <div>{audioInfo.filename ? audioInfo.filename : 'Not playing'}</div>
          )}
        </div>
      </div>
      <audio
        ref={audioRef}
        style={styles.audio}
        onPlay={() => {
          setPlaying(true);
        }}
        onPause={() => {
          setPlaying(false);
        }}
        onEnded={() => {
          setPlaying(false);

          // if (!autoplay) return;
          //
          // playNext();
        }}
        autoPlay={true}
        // preload={'none'}
        src={audioInfo.url}
        controls
      />
    </div>
  );
}
