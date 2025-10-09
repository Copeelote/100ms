import React from 'react';
import { AlertTriangleIcon, CrossIcon } from '@100mslive/react-icons';
import { Button } from '../../../Button';
import { Box, Flex } from '../../../Layout';
import { Text } from '../../../Text';

export const LeaveSessionContent = ({
  setShowLeaveRoomAlert,
  leaveRoom,
  isModal = false,
}: {
  setShowLeaveRoomAlert: (value: boolean) => void;
  leaveRoom: (options?: { endStream?: boolean; sendReason?: boolean }) => Promise<void>;
  isModal?: boolean;
}) => {
  return (
    <Box>
      <Flex
        css={{
          color: '$alert_error_default',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AlertTriangleIcon style={{ marginRight: '0.5rem' }} />
        <Text variant="lg" css={{ color: 'inherit', fontWeight: '$semiBold' }}>
          Quitter
        </Text>
        {isModal ? null : (
          <Box css={{ color: '$on_surface_high', ml: 'auto' }} onClick={() => setShowLeaveRoomAlert(false)}>
            <CrossIcon />
          </Box>
        )}
      </Flex>
      <Text variant="sm" css={{ color: '$on_surface_low', mb: '$8', mt: '$4' }}>
        Les autres continueront après votre départ. Vous pouvez rejoindre la session à nouveau.
      </Text>
      <Flex align="center" justify="between" css={{ w: '100%', gap: '$8' }}>
        <Button
          outlined
          variant="standard"
          css={{ w: '100%', '@md': { display: 'none' } }}
          onClick={() => setShowLeaveRoomAlert(false)}
        >
          Annuler
        </Button>
        <Button
          variant="danger"
          css={{ w: '100%' }}
          onClick={async () => {
            await leaveRoom({ sendReason: true });
          }}
          id="leaveRoom"
          data-testid="leave_room"
        >
          Quitter la session
        </Button>
      </Flex>
    </Box>
  );
};
