import React from 'react';
import { useMedia } from 'react-use';
import { Box, Flex } from '../../../Layout';
import { Text } from '../../../Text';
import { config as cssConfig } from '../../../Theme';
// @ts-ignore
import { useRoomLayoutConferencingScreen } from '../../provider/roomLayoutProvider/hooks/useRoomLayoutScreen';
import { useIsPeerBlacklisted } from '../hooks/useChatBlacklist';
import { useLandscapeHLSStream, useMobileHLSStream } from '../../common/hooks';

export const EmptyChat = () => {
  const { elements } = useRoomLayoutConferencingScreen();
  const isLocalPeerBlacklisted = useIsPeerBlacklisted({ local: true });
  const isMobile = useMedia(cssConfig.media.md);
  const canSendMessages =
    elements.chat &&
    (elements.chat.public_chat_enabled ||
      elements.chat.private_chat_enabled ||
      (elements.chat.roles_whitelist && elements.chat.roles_whitelist.length)) &&
    !isLocalPeerBlacklisted;
  const isMobileHLSStream = useMobileHLSStream();
  const isLandscapeStream = useLandscapeHLSStream();
  const streaming = isMobileHLSStream || isLandscapeStream;

  if (isMobile && elements?.chat?.is_overlay && !streaming) return <></>;

  return (
    <Flex
      css={{
        width: '100%',
        flex: '1 1 0',
        textAlign: 'center',
        px: '$4',
      }}
      align="center"
      justify="center"
    >
      <Box>

        <Text variant="h5" css={{ mt: '$8', c: '$on_surface_high' }}>
          {canSendMessages ? 'Commencer une conversation' : 'Aucun message pour le moment'}
        </Text>
        {canSendMessages ? (
          <Text
            variant="sm"
            css={{ mt: '$4', maxWidth: '80%', textAlign: 'center', mx: 'auto', c: '$on_surface_medium' }}
          >
            Il n'y a pas encore de messages ici. Commencez une conversation en envoyant un message.
          </Text>
        ) : null}
      </Box>
    </Flex>
  );
};
