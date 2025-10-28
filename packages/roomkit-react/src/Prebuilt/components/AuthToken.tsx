import React, { useEffect, useRef, useState } from 'react';
import { useSessionStorage } from 'react-use';
import { match } from 'ts-pattern';
import { v4 as uuid } from 'uuid';
import { HMSException, useHMSActions } from '@100mslive/react-sdk';
import { Dialog } from '../../Modal';
import { Text } from '../../Text';
import { useHMSPrebuiltContext } from '../AppContext';
import { PrebuiltStates } from '../AppStateContext';
// @ts-ignore: No implicit Any
import { useSetAppDataByKey } from './AppData/useUISettings';
// @ts-ignore: No implicit Any
import { UserPreferencesKeys } from './hooks/useUserPreferences';
import { APP_DATA } from '../common/constants';

// @ts-ignore: No implicit Any
const errorImage = new URL('../images/transaction_error.svg', import.meta.url).href;

/**
 * query params exposed -
 * skip_preview=true => used by recording and streaming service, skips preview and directly joins
 *                      header and footer don't show up in this case
 * skip_preview_headful=true => used by automation testing to skip preview without impacting the UI
 * name=abc => gives the initial name for the peer joining
 * auth_token=123 => uses the passed in token to join instead of fetching from token endpoint
 * ui_mode=activespeaker => lands in active speaker mode after joining the room
 */
const AuthToken = React.memo<{
  authTokenByRoomCodeEndpoint?: string;
  defaultAuthToken?: string;
  activeState?: PrebuiltStates;
}>(({ authTokenByRoomCodeEndpoint, defaultAuthToken, activeState }) => {
  const hmsActions = useHMSActions();
  const { roomCode, userId } = useHMSPrebuiltContext();
  const [error, setError] = useState({ title: '', body: '' });
  const authToken = defaultAuthToken;
  const [tokenInAppData, setAuthTokenInAppData] = useSetAppDataByKey(APP_DATA.authToken);
  const [savedUserId, setSavedUserId] = useSessionStorage<string>(UserPreferencesKeys.USER_ID);
  const progressRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (authToken) {
      setAuthTokenInAppData(authToken);
      return;
    }

    if (tokenInAppData || progressRef.current || activeState === PrebuiltStates.LEAVE) {
      return;
    }

    if (!roomCode) {
      console.error('room code not provided');
      return;
    }

    let userIdForAuthToken = userId || savedUserId;
    if (!userIdForAuthToken) {
      userIdForAuthToken = uuid();
      setSavedUserId(userIdForAuthToken);
    }

    progressRef.current = true;
    hmsActions
      .getAuthTokenByRoomCode({ roomCode, userId: userIdForAuthToken }, { endpoint: authTokenByRoomCodeEndpoint })
      .then(token => setAuthTokenInAppData(token))
      .catch(error => setError(convertError(error)))
      .finally(() => {
        progressRef.current = false;
      });
  }, [
    hmsActions,
    authToken,
    authTokenByRoomCodeEndpoint,
    setAuthTokenInAppData,
    roomCode,
    userId,
    savedUserId,
    tokenInAppData,
    setSavedUserId,
    activeState,
  ]);

  if (error.title) {
    return (
      <Dialog.Root open={true}>
        <Dialog.Content
          css={{
            maxWidth: '$100',
            boxSizing: 'border-box',
            p: '$10 $12',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={errorImage} height={80} width={80} alt="Erreur de jeton" />
          <Text variant="h4" css={{ textAlign: 'center', mb: '$4', mt: '$10' }}>
            {error.title}
          </Text>
          <Text css={{ c: '$on_surface_medium', textAlign: 'center' }}>{error.body}</Text>
        </Dialog.Content>
      </Dialog.Root>
    );
  }
  return null;
});

const convertError = (error: HMSException) => {
  console.error('[error]', { error });
  console.warn(
    'If you think this is a mistake on our side, please reach out to us on Dashboard:',
    'https://dashboard.100ms.live/dashboard',
  );
  return match([error.action, error.code])
    .with(['GET_TOKEN', 403], () => ({
      title: 'Psst ! Cette salle est actuellement inactive.',
      body: "N'hésitez pas à rejoindre une autre salle ouverte pour plus de conversations. Merci d'être passé !",
    }))

    .with(['GET_TOKEN', 404], () => ({
      title: "Le code de salle n'existe pas",
      body: "Nous n'avons pas pu trouver un code de salle correspondant à ce lien.",
    }))
    .with(['GET_TOKEN', 2003], () => ({
      title: "Le point de terminaison n'est pas accessible",
      body: `Le point de terminaison n'est pas accessible. ${error.description}.`,
    }))
    .otherwise(() =>
      // @ts-ignore
      match(error.response?.status)
        .with(404, () => ({
          title: "La salle n'existe pas",
          body: "Nous n'avons pas pu trouver une salle correspondant à ce lien.",
        }))
        .with(403, () => ({
          title: "L'accès à la salle avec ce format de lien est désactivé",
          body: 'Vous pouvez le réactiver depuis la section développeur du tableau de bord.',
        }))
        .otherwise(() => {
          console.error('Token API Error', error);
          return {
            title: 'Erreur lors de la récupération du token',
            body: "Une erreur s'est produite lors de la récupération du token de l'application. Veuillez consulter les logs pour plus de détails.",
          };
        }),
    );
};

export default AuthToken;
