import React from 'react';
import { AlertOctagonIcon, HandIcon, PeopleAddIcon, PeopleRemoveIcon } from '@100mslive/react-icons';
import { Box } from '../../..';
import SwitchWithLabel from './SwitchWithLabel';
// @ts-ignore: No implicit Any
import { useSetSubscribedNotifications, useSubscribedNotifications } from '../AppData/useUISettings';
import { settingOverflow } from './common';
import { SUBSCRIBED_NOTIFICATIONS } from '../../common/constants';

const NotificationItem = ({
  type,
  label,
  icon,
  checked,
}: {
  type: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
}) => {
  const [, setSubscribedNotifications] = useSetSubscribedNotifications(type);
  return (
    <SwitchWithLabel
      label={label}
      id={type}
      icon={icon}
      checked={checked}
      onChange={value => {
        setSubscribedNotifications(value);
      }}
    />
  );
};

export const NotificationSettings = () => {
  const subscribedNotifications = useSubscribedNotifications();

  return (
    <Box className={settingOverflow()}>
      <NotificationItem
        label="Arrivée d'un participant"
        type={SUBSCRIBED_NOTIFICATIONS.PEER_JOINED}
        icon={<PeopleAddIcon />}
        checked={subscribedNotifications.PEER_JOINED}
      />
      <NotificationItem
        label="Départ d'un participant"
        type={SUBSCRIBED_NOTIFICATIONS.PEER_LEFT}
        icon={<PeopleRemoveIcon />}
        checked={subscribedNotifications.PEER_LEFT}
      />
      <NotificationItem
        label="Main levée"
        type={SUBSCRIBED_NOTIFICATIONS.METADATA_UPDATED}
        icon={<HandIcon />}
        checked={subscribedNotifications.METADATA_UPDATED}
      />
      <NotificationItem
        label="Erreur"
        type={SUBSCRIBED_NOTIFICATIONS.ERROR}
        icon={<AlertOctagonIcon />}
        checked={subscribedNotifications.ERROR}
      />
    </Box>
  );
};
