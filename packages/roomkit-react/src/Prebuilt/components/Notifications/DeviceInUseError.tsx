import React, { useEffect, useState } from 'react';
import {
  HMSNotificationTypes,
  HMSTrackException,
  HMSTrackExceptionTrackType,
  useHMSNotifications,
} from '@100mslive/react-sdk';
import { Button, Dialog, Text } from '../../..';
// @ts-ignore: No implicit Any
import { DialogContent, DialogRow } from '../../primitives/DialogContent';
// @ts-ignore: No implicit Any
import { ToastManager } from '../Toast/ToastManager';

const Instruction = ({ description }: { description: string }) => (
  <li>
    <DialogRow css={{ ml: '$4' }}>
      <Text variant="body2">{description}</Text>
    </DialogRow>
  </li>
);

export function DeviceInUseError() {
  const notification = useHMSNotifications(HMSNotificationTypes.ERROR);
  const [showDeviceInUseModal, setShowDeviceInUseModal] = useState(false);
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    const error = notification?.data;
    if (!error || error.code !== 3003) {
      return;
    }
    const errorTrackExceptionType = (error as HMSTrackException)?.trackType;
    const hasAudio = errorTrackExceptionType === HMSTrackExceptionTrackType.AUDIO;
    const hasVideo = errorTrackExceptionType === HMSTrackExceptionTrackType.VIDEO;
    const hasAudioVideo = errorTrackExceptionType === HMSTrackExceptionTrackType.AUDIO_VIDEO;
    const hasScreen = errorTrackExceptionType === HMSTrackExceptionTrackType.SCREEN;

    const errorMessage = error?.message;
    ToastManager.addToast({
      title: `Erreur : ${errorMessage} - ${error?.description}`,
      action: (
        <Button outlined variant="standard" css={{ w: 'max-content' }} onClick={() => setShowDeviceInUseModal(true)}>
          Aide
        </Button>
      ),
    });

    if (hasAudioVideo) {
      setDeviceType('caméra et microphone');
    } else if (hasAudio) {
      setDeviceType('microphone');
    } else if (hasVideo) {
      setDeviceType('caméra');
    } else if (hasScreen) {
      setDeviceType('écran');
    }
  }, [notification]);

  return (
    <Dialog.Root
      open={showDeviceInUseModal}
      onOpenChange={() => {
        setShowDeviceInUseModal(false);
      }}
    >
      <DialogContent title="Erreur d'accès au périphérique">
        <DialogRow>
          <Text variant="body2">
            Nous n'avons pas pu accéder à votre {deviceType} car il est soit utilisé par une autre application, soit mal
            configuré. Veuillez suivre les instructions suivantes pour résoudre ce problème.
          </Text>
        </DialogRow>
        <ol>
          <Instruction
            description={`Veuillez vérifier si le(s) périphérique(s) ${deviceType} sont utilisés par un autre navigateur ou application et fermez-le.`}
          />
          <Instruction
            description={`Allez dans Paramètres du navigateur > Confidentialité et sécurité > Paramètres du site > ${deviceType} et vérifiez si votre périphérique préféré est sélectionné par défaut.`}
          />
          <Instruction description="Essayez de redémarrer le navigateur." />
          <Instruction description="Essayez de déconnecter et reconnecter le périphérique externe si vous souhaitez en utiliser un." />
        </ol>
      </DialogContent>
    </Dialog.Root>
  );
}
