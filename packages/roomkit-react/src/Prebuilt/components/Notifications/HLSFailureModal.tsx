import React, { useState /*, useCallback*/ } from 'react';
import { selectHLSState, useHMSStore /*, useHMSActions, useRecordingStreaming*/ } from '@100mslive/react-sdk';
import { Button } from '../../../Button';
import { Flex } from '../../../Layout';
import { Dialog } from '../../../Modal';
import { Text } from '../../../Text';
// commented streaming retry helpers kept for future re-enable
// import { useSetAppDataByKey } from '../AppData/useUISettings';
// import { APP_DATA } from '../../common/constants';
// @ts-ignore: No implicit Any
// import { useSetAppDataByKey } from '../AppData/useUISettings';
// @ts-ignore: No implicit Any
// import { APP_DATA } from '../../common/constants';

export function HLSFailureModal() {
  const hlsError = useHMSStore(selectHLSState).error || false;
  const [openModal, setOpenModal] = useState(!!hlsError);
  /*  const hmsActions = useHMSActions();
  const { isRTMPRunning } = useRecordingStreaming();
  const [isHLSStarted, setHLSStarted] = useSetAppDataByKey(APP_DATA.hlsStarted);
 const startHLS = useCallback(async () => {
    try {
      if (isHLSStarted || isRTMPRunning) {
        return;
      }
      setHLSStarted(true);
      await hmsActions.startHLSStreaming({});
    } catch (error) {
      console.error(error);
      setHLSStarted(false);
    }
  }, [hmsActions, isHLSStarted, setHLSStarted, isRTMPRunning]);*/

  return hlsError ? (
    <Dialog.Root
      open={openModal}
      onOpenChange={value => {
        if (!value) {
          setOpenModal(false);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content css={{ w: 'min(360px, 90%)' }}>
          <Dialog.Title
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid $border_default',
              mt: '$4',
            }}
          >
            <Text variant="h6" css={{ fontWeight: '$semiBold' }}>
              Échec de la diffusion en direct
            </Text>
          </Dialog.Title>
          <Text variant="sm" css={{ mb: '$10', color: '$on_surface_medium' }}>
            Quelque chose s'est mal passé et votre diffusion en direct a échoué. Veuillez réessayer.
          </Text>
          <Flex align="center" justify="between" css={{ w: '100%', gap: '$8' }}>
            <Button outlined variant="standard" css={{ w: '100%' }} onClick={() => setOpenModal(false)}>
              Ignorer
            </Button>
            {/*  <Button css={{ w: '100%' }} onClick={startHLS}>
                Diffuser en direct
              </Button>*/}
            {/* Retry streaming disabled */}
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ) : null;
}
