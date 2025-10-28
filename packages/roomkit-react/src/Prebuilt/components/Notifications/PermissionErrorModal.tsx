import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import {
  HMSException,
  HMSNotificationTypes,
  HMSTrackException,
  HMSTrackExceptionTrackType,
  useHMSNotifications,
} from '@100mslive/react-sdk';
import { Button, config as cssConfig, Dialog, Flex, Text } from '../../..';
// @ts-ignore: No implicit Any
import { isAndroid, isIOS } from '../../common/constants';

// @ts-ignore: No implicit Any
const androidPermissionAlert = new URL('../../images/android-perm-1.png', import.meta.url).href;
// @ts-ignore: No implicit Any
const iosPermissions = new URL('../../images/ios-perm-0.png', import.meta.url).href;

export function PermissionErrorNotificationModal() {
  const notification = useHMSNotifications(HMSNotificationTypes.ERROR);
  return <PermissionErrorModal error={notification?.data} />;
}

export const PermissionErrorModal = ({ error }: { error?: HMSException }) => {
  const [deviceType, setDeviceType] = useState('');
  const [isSystemError, setIsSystemError] = useState(false);
  const isMobile = useMedia(cssConfig.media.md);
  useEffect(() => {
    if (
      !error ||
      (error?.code !== 3001 && error?.code !== 3011) ||
      (error?.code === 3001 && error?.message.includes('screen'))
    ) {
      return;
    }

    const errorTrackExceptionType = (error as HMSTrackException)?.trackType;
    const hasAudio = errorTrackExceptionType === HMSTrackExceptionTrackType.AUDIO;
    const hasVideo = errorTrackExceptionType === HMSTrackExceptionTrackType.VIDEO;
    const hasAudioVideo = errorTrackExceptionType === HMSTrackExceptionTrackType.AUDIO_VIDEO;
    const hasScreen = errorTrackExceptionType === HMSTrackExceptionTrackType.SCREEN;
    if (hasAudioVideo) {
      setDeviceType('caméra et microphone');
    } else if (hasAudio) {
      setDeviceType('microphone');
    } else if (hasVideo) {
      setDeviceType('caméra');
    } else if (hasScreen) {
      setDeviceType('écran');
    }
    setIsSystemError(error.code === 3011);
  }, [error]);

  return deviceType ? (
    <Dialog.Root open={!!deviceType}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          css={{
            w: 'min(380px, 90%)',
            p: '$8',
            // overlay over Sheet.tsx
            zIndex: 23,
          }}
        >
          <Dialog.Title
            css={{
              borderBottom: '1px solid $border_default',
            }}
          >
            {isMobile && isIOS ? (
              <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={iosPermissions} alt="iOS Permission flow" />
            ) : null}

            {/* Images for android */}
            {isMobile && isAndroid ? (
              <img
                src={androidPermissionAlert}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                alt="Android Permission flow "
              />
            ) : null}

            <Text variant="h6">Nous ne pouvons pas accéder à votre {deviceType}</Text>
          </Dialog.Title>

          <Text variant="sm" css={{ pt: '$4', pb: '$10', color: '$on_surface_medium' }}>
            {/* IOS prompt text */}
            {isMobile && isIOS
              ? 'Activez les permissions en rechargeant cette page et en cliquant sur "Autoriser" dans la pop-up, ou modifiez les paramètres depuis la barre d\'adresse.'
              : null}

            {/* Prompt for android devices */}
            {isMobile && isAndroid
              ? `Pour permettre aux autres utilisateurs de vous voir et vous entendre, cliquez sur l'icône de caméra bloquée dans la barre d'adresse de votre navigateur.`
              : null}

            {/* Prompt for desktops */}
            {!isMobile ? `L'accès à ${deviceType} est requis. ` : null}

            {isSystemError && !isMobile
              ? `Activez les permissions pour ${deviceType}${
                  deviceType === 'écran' ? 'partage' : ''
                } depuis les paramètres système`
              : null}
            {!isSystemError && !isMobile
              ? `Activez les permissions pour ${deviceType}${
                  deviceType === 'écran' ? 'partage' : ''
                } depuis la barre d'adresse ou les paramètres du navigateur.`
              : null}
          </Text>

          {/* CTA section */}
          {isMobile && isIOS ? (
            <>
              <Button onClick={() => window.location.reload()} css={{ w: '100%', mb: '$6' }}>
                Recharger
              </Button>
              <Button outlined variant="standard" onClick={() => setDeviceType('')} css={{ w: '100%' }}>
                Continuer quand même
              </Button>
            </>
          ) : null}

          {isMobile && isAndroid ? (
            <>
              <Button onClick={() => setDeviceType('')} css={{ w: '100%', mb: '$6' }}>
                J'ai autorisé l'accès
              </Button>
              <Button outlined variant="standard" onClick={() => setDeviceType('')} css={{ w: '100%' }}>
                Continuer quand même
              </Button>
            </>
          ) : null}

          {!isMobile ? (
            <Flex justify="end" css={{ w: '100%' }}>
              <Button outlined variant="standard" onClick={() => setDeviceType('')}>
                Ignorer
              </Button>
            </Flex>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ) : null;
};
