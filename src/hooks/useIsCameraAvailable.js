import React, {useEffect, useState} from 'react';

export default function useIsCameraAvailable() {
  const [cameraAvailable, setCameraAvailable] = useState(false);

  useEffect(() => {
    async function checkCamera() {
      try {
        const res = await navigator.mediaDevices.getUserMedia({video: true});
        setCameraAvailable(res);
      } catch (e) {}
    }

    checkCamera();
  }, []);

  return cameraAvailable;
}
