import React, { useEffect, useState } from 'react';
import {
  HMSChangeTrackStateRequest,
  HMSNotificationTypes,
  useHMSActions,
  useHMSNotifications,
} from '@100mslive/react-sdk';
import { MicOnIcon } from '@100mslive/react-icons';
// @ts-ignore: No implicit Any
import { RequestDialog } from '../../primitives/DialogContent';
// @ts-ignore: No implicit Any
import { ToastManager } from '../Toast/ToastManager';

const notificationTypes = [
  HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST,
  HMSNotificationTypes.ROOM_ENDED,
  HMSNotificationTypes.REMOVED_FROM_ROOM,
];

export const TrackUnmuteModal = () => {
  const hmsActions = useHMSActions();
  const notification = useHMSNotifications(notificationTypes);
  const [muteNotification, setMuteNotification] = useState<HMSChangeTrackStateRequest | null>(null);

  useEffect(() => {
    switch (notification?.type) {
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
      case HMSNotificationTypes.ROOM_ENDED:
        {
          const base =
            notification.type === HMSNotificationTypes.ROOM_ENDED
              ? 'La session est terminée'
              : 'Vous avez été retiré de la session';
          const reason = notification?.data?.reason ? ` Raison : ${notification.data.reason}` : '';
          ToastManager.addToast({ title: `${base}.${reason}` });
        }
        setMuteNotification(null);
        break;
      case HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST:
        if (notification?.data.enabled) {
          setMuteNotification(notification.data);
        }
        break;
      default:
        return;
    }
  }, [notification]);

  if (!muteNotification) {
    return null;
  }

  const { requestedBy: peer, track, enabled } = muteNotification;

  return (
    <RequestDialog
      title={`Réactiver votre ${track.type} ?`}
      onOpenChange={(value: boolean) => !value && setMuteNotification(null)}
      body={`${peer?.name} vous demande de réactiver votre ${track?.type}.`}
      onAction={() => {
        hmsActions.setEnabledTrack(track.id, enabled);
        setMuteNotification(null);
      }}
      Icon={MicOnIcon}
    />
  );
};
