import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { useIsEmulator } from 'react-native-device-info';
import styled from 'styled-components';
import { Centered } from '../layout';
import { ErrorText } from '../text';
import QRCodeScannerCrosshair from './QRCodeScannerCrosshair';
import QRCodeScannerNeedsAuthorization from './QRCodeScannerNeedsAuthorization';
import SimulatorFakeCameraImageSource from '@rainbow-me/assets/simulator-fake-camera-image.jpg';
import { useBooleanState, useScanner } from '@rainbow-me/hooks';
import { ImgixImage } from '@rainbow-me/images';
import { position } from '@rainbow-me/styles';

const Camera = styled(RNCamera)`
  ${position.cover};
  ${position.size('100%')};
`;

const CameraWrapper = styled(Centered)`
  ${position.size('100%')};
  background-color: ${({ theme: { colors } }) => colors.trueBlack};
`;

const Container = styled(Centered).attrs({
  direction: 'column',
})`
  ${position.cover};
  background-color: ${({ theme: { colors } }) => colors.black};
`;

const ContentOverlay = styled(Centered)`
  ${position.cover};
  bottom: ${({ contentPositionBottom }) => contentPositionBottom || 0};
  top: ${({ contentPositionTop }) => contentPositionTop || 0};
`;

const EmulatorCameraFallback = styled(ImgixImage).attrs({
  source: SimulatorFakeCameraImageSource,
})`
  ${position.cover};
  ${position.size('100%')};
`;

export default function QRCodeScanner({
  contentPositionBottom,
  contentPositionTop,
  dsRef,
}) {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [error, showError] = useBooleanState();
  const [isInitialized, setInitialized] = useBooleanState();
  const { result: isEmulator } = useIsEmulator();
  const { isCameraAuthorized, onScan } = useScanner(cameraEnabled);

  const showErrorMessage = error && !isInitialized;
  const showCrosshair = !error && !showErrorMessage;
  const cameraRef = useRef();

  const onCrossMagicBorder = useCallback(
    below => {
      setCameraEnabled(below);
    },
    [setCameraEnabled]
  );
  useEffect(
    () => dsRef.current.addOnCrossMagicBorderListener(onCrossMagicBorder),
    [dsRef, onCrossMagicBorder]
  );
  useEffect(() => {
    if (ios || !isInitialized) {
      return;
    }
    if (cameraEnabled) {
      cameraRef.current?.resumePreview?.();
    } else {
      cameraRef.current?.pausePreview?.();
    }
  }, [cameraEnabled, isInitialized]);

  return (
    <Container>
      <CameraWrapper>
        {cameraEnabled && isEmulator && <EmulatorCameraFallback />}
        {(cameraEnabled || android) && !isEmulator && (
          <Camera
            captureAudio={false}
            notAuthorizedView={QRCodeScannerNeedsAuthorization}
            onBarCodeRead={onScan}
            onCameraReady={setInitialized}
            onMountError={showError}
            pendingAuthorizationView={null}
            ref={cameraRef}
          />
        )}
      </CameraWrapper>
      {isCameraAuthorized ? (
        <ContentOverlay
          contentPositionBottom={contentPositionBottom}
          contentPositionTop={contentPositionTop}
        >
          {showErrorMessage && <ErrorText error="Error mounting camera" />}
          {showCrosshair && <QRCodeScannerCrosshair />}
        </ContentOverlay>
      ) : (
        <QRCodeScannerNeedsAuthorization />
      )}
    </Container>
  );
}
