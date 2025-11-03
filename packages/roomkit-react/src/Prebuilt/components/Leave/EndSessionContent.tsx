import React from 'react';
import { AlertTriangleIcon, CrossIcon } from '@100mslive/react-icons';
import { Button } from '../../../Button';
import { Box, Flex } from '../../../Layout';
import { Text } from '../../../Text';

export const EndSessionContent = ({
  setShowEndStreamAlert,
  leaveRoom,
  isModal = false,
  isStreamingOn = false,
}: {
  setShowEndStreamAlert: (value: boolean) => void;
  leaveRoom: (options?: { endStream?: boolean }) => Promise<void>;
  isModal?: boolean;
  isStreamingOn: boolean;
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
          {isStreamingOn ? 'Terminer le direct' : 'Terminer la session'}
        </Text>
        {isModal ? null : (
          <Box css={{ color: '$on_surface_high', ml: 'auto' }} onClick={() => setShowEndStreamAlert(false)}>
            <CrossIcon />
          </Box>
        )}
      </Flex>
      <Text variant="sm" css={{ color: '$on_surface_medium', mb: '$8', mt: '$4' }}>
        {isStreamingOn
          ? 'Le direct prendra fin pour tout le monde. Cette action est irréversible.'
          : 'La session prendra fin pour tout le monde. Cette action est irréversible.'}
      </Text>
      <Flex align="center" justify="between" css={{ w: '100%', gap: '$8' }}>
        <Button
          outlined
          variant="standard"
          css={{ w: '100%', '@md': { display: 'none' } }}
          onClick={() => setShowEndStreamAlert(false)}
        >
          Annuler
        </Button>
        <Button
          variant="danger"
          css={{ w: '100%' }}
          onClick={async () => {
            await leaveRoom({ endStream: true });
            setShowEndStreamAlert(false);
          }}
          id="stopStream"
          data-testid="stop_stream_btn"
        >
          {isStreamingOn ? 'Terminer le direct' : 'Terminer la session'}
        </Button>
      </Flex>
    </Box>
  );
};
