import Ipfs from 'ipfs';
import {useEffect, useState} from 'react';

let ipfs = null;

export default function useIpfsFactory() {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));
  const [ipfsInitError, setIpfsInitError] = useState(null);

  useEffect(() => {
    async function startIpfs() {
      if (ipfs) {
        console.log('IPFS already started');
      } else if (window.ipfs && window.ipfs.enable) {
        console.log('Found window.ipfs');
        ipfs = await window.ipfs.enable({commands: ['id']});
      } else {
        try {
          console.time('IPFS Started');
          ipfs = await Ipfs.create({
            config: {
              Addresses: {
                Swarm: [
                  '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                  '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
                  '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
                  '/dns4/libp2p-rdv.vps.revolunet.com/tcp/443/wss/p2p-webrtc-star/',
                ],
              },
            },
          });
          console.timeEnd('IPFS Started');
        } catch (error) {
          console.error('IPFS init error:', error);
          ipfs = null;
          setIpfsInitError(error);
        }
      }

      setIpfsReady(Boolean(ipfs));
    }

    startIpfs();
    return () => {
      if (ipfs && ipfs.stop) {
        console.log('Stopping IPFS');
        ipfs.stop().catch((err) => console.error(err));
        ipfs = null;
        setIpfsReady(false);
      }
    };
  }, []);

  return {ipfs, isIpfsReady, ipfsInitError};
}
