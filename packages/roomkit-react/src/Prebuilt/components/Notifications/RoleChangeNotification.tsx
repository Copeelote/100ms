import { useEffect } from 'react';
import { HMSNotificationTypes, useHMSNotifications } from '@100mslive/react-sdk';
import { useUpdateRoomLayout } from '../../provider/roomLayoutProvider';
// @ts-ignore: No implicit Any
import { ToastManager } from '../Toast/ToastManager';

// Translate role names for display; keep raw names for logic/config
const translateRoleName = (roleName?: string): string => {
  if (!roleName) return '';
  const map: Record<string, string> = {
    viewer: 'Spectateur',
    host: 'Hôte',
    speaker: 'Intervenant',
    moderator: 'Modérateur',
    guest: 'Invité',
    participant: 'Participant',
    admin: 'Administrateur',
    broadcaster: 'Diffuseur',
    'viewer-on-stage': 'Spectateur sur scène',
  };
  const key = roleName.toLowerCase();
  return map[key] || roleName;
};

export const RoleChangeNotification = () => {
  const notification = useHMSNotifications(HMSNotificationTypes.ROLE_UPDATED);
  const updateRoomLayoutForRole = useUpdateRoomLayout();

  useEffect(() => {
    if (!notification?.data) {
      return;
    }
    if (notification.data?.isLocal && notification.data?.roleName) {
      ToastManager.addToast({
        title: `Vous êtes maintenant ${translateRoleName(notification.data.roleName)}`,
      });
      updateRoomLayoutForRole?.(notification.data.roleName);
    }
  }, [notification]);

  return null;
};
