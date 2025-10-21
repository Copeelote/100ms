import React, { useEffect } from 'react';
// eslint-disable-next-line
import { HMSVirtualBackgroundTypes } from '@100mslive/hms-virtual-background/hmsvbplugin';
import {
  HMSRoomState,
  selectAppData,
  selectIsAllowedToPublish,
  selectIsEffectsEnabled,
  selectIsLocalVideoEnabled,
  selectIsVBEnabled,
  selectRoomState,
  useHMSActions,
  useHMSStore,
} from '@100mslive/react-sdk';
import { VirtualBackgroundIcon } from '@100mslive/react-icons';
import { Loading } from '../../../Loading';
import { Tooltip } from '../../../Tooltip';
import IconButton from '../../IconButton';
import { VBHandler } from './VBHandler';
// @ts-ignore
import { useIsSidepaneTypeOpen, useSidepaneToggle } from '../AppData/useSidepane';
import { APP_DATA, isSafari, SIDE_PANE_OPTIONS } from '../../common/constants';

export const VBToggle = () => {
  const toggleVB = useSidepaneToggle(SIDE_PANE_OPTIONS.VB);
  const isVBOpen = useIsSidepaneTypeOpen(SIDE_PANE_OPTIONS.VB);
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);
  const isVBEnabled = useHMSStore(selectIsVBEnabled);
  const isEffectsEnabled = useHMSStore(selectIsEffectsEnabled);
  const loadingEffects = useHMSStore(selectAppData(APP_DATA.loadingEffects));
  const hmsActions = useHMSActions();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const roomState = useHMSStore(selectRoomState);

  useEffect(() => {
    // Only reset VB if user doesn't have video publishing permissions
    if (!isAllowedToPublish?.video) {
      VBHandler?.reset();
      hmsActions.setAppData(APP_DATA.background, HMSVirtualBackgroundTypes.NONE);
    }
  }, [hmsActions, isAllowedToPublish?.video]);

  // Show VB if video is on and effects are enabled
  // In preview mode, always show if conditions are met
  // In room mode, show if video is on and effects are enabled (regardless of when video was enabled)
  const shouldShowVB =
    isVideoOn &&
    isEffectsEnabled &&
    (isVBEnabled || roomState === HMSRoomState.Preview || roomState === HMSRoomState.Connected);

  if (!shouldShowVB || (!isEffectsEnabled && isSafari)) {
    return null;
  }

  return (
    <Tooltip side="top" disabled={isVBOpen} title="Configurer l'arrière-plan virtuel">
      <IconButton active={!isVBOpen} onClick={toggleVB} data-testid="virtual_bg_btn">
        {loadingEffects ? <Loading size={18} /> : <VirtualBackgroundIcon />}
      </IconButton>
    </Tooltip>
  );
};
