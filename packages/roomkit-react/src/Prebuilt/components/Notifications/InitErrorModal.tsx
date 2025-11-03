import React, { useEffect, useState } from 'react';
import { HMSNotificationTypes, useHMSNotifications } from '@100mslive/react-sdk';
import { Text } from '../../..';
// @ts-ignore: No implicit Any
import { ErrorDialog } from '../../primitives/DialogContent';

export const InitErrorModal = () => {
  const notification = useHMSNotifications(HMSNotificationTypes.ERROR);
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState({ title: "Erreur d'initialisation", description: '' });

  useEffect(() => {
    const data = notification?.data;
    if (!data || data.action !== 'INIT') {
      return;
    }
    let description;
    let title;
    if (data.description.includes('role is invalid')) {
      description = "Ce rôle n'existe pas pour la salle donnée. Réessayez avec un rôle valide.";
      title = 'Rôle invalide';
    } else if (data.description.includes('room is not active')) {
      title = 'Salle désactivée';
      description =
        "Cette salle est désactivée et ne peut pas être rejointe. Pour activer la salle, utilisez le tableau de bord 100ms ou l'API.";
    } else {
      description = data.description;
      title = "Erreur d'initialisation";
    }
    setInfo({ title, description });
    setShowModal(true);
  }, [notification]);

  return (
    <ErrorDialog open={showModal} onOpenChange={setShowModal} title={info.title}>
      <Text variant="sm" css={{ wordBreak: 'break-word' }}>
        {info.description} <br />
        URL actuelle - {window.location.href}
      </Text>
    </ErrorDialog>
  );
};
