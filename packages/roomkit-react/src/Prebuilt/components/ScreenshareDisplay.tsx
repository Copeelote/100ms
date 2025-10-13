import React from 'react';
import { useHMSActions } from '@100mslive/react-sdk';
import { CrossIcon, ShareScreenIcon } from '@100mslive/react-icons';
import { Button } from '../../Button';
import { Flex } from '../../Layout';
import { Text } from '../../Text';

export const ScreenshareDisplay = () => {
  const hmsActions = useHMSActions();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      css={{
        size: '100%',
        bg: '$background_default',
        color: '$on_surface_high',
      }}
    >
      <ShareScreenIcon width={48} height={48} />
      <Text variant="h5" css={{ m: '$8 0' }}>
        Vous partagez votre écran
      </Text>
      <Button
        variant="danger"
        css={{ fontWeight: '$semiBold' }}
        onClick={async () => {
          await hmsActions.setScreenShareEnabled(false);
        }}
        data-testid="stop_screen_share_btn"
      >
        <CrossIcon width={18} height={18} />
        &nbsp; Arrêter le partage d’écran
      </Button>
    </Flex>
  );
};
