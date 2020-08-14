import Ipfs from 'ipfs';
import {useEffect, useState} from 'react';

let ipfs = null;

export default function useIpfsFactory(onError) {
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
            EXPERIMENTAL: {
              pubsub: true,
            },
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
          console.error(error)
          onError(error);
          ipfs = null;
          setIpfsInitError(error);
        }
      }

      window.ipfs = ipfs;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {ipfs, isIpfsReady, ipfsInitError};
}
