import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';
import { HMSRecordingState } from '@100mslive/hms-video-store';
import {
  HMSRoomState,
  selectHLSState,
  // selectIsConnectedToRoom, // re-enable if StartRecording is used
  selectPermissions,
  selectRecordingState,
  selectRoomState,
  useHMSStore,
  useRecordingStreaming,
} from '@100mslive/react-sdk';
import { AlertTriangleIcon, CrossIcon, PauseCircleIcon, RecordIcon } from '@100mslive/react-icons';
import { Box, Button, config as cssConfig, Flex, HorizontalDivider, Text, Tooltip } from '../../..';
import { Sheet } from '../../../Sheet';
import { useRoomLayoutConferencingScreen } from '../../provider/roomLayoutProvider/hooks/useRoomLayoutScreen';
// @ts-ignore
import { formatTime } from '../../common/utils';

// Re-enable this component and related imports to restore Start/Stop Recording in header
/*
import { Popover, Loading } from '../../..';
// @ts-ignore
import { ToastManager } from '../Toast/ToastManager';
import { useRecordingHandler } from '../../common/hooks';
import { useHMSActions } from '@100mslive/react-sdk';
*/

export const getRecordingText = (
  {
    isBrowserRecordingOn,
    isServerRecordingOn,
    isHLSRecordingOn,
  }: { isBrowserRecordingOn: boolean; isServerRecordingOn: boolean; isHLSRecordingOn: boolean },
  delimiter = ', ',
) => {
  if (!isBrowserRecordingOn && !isServerRecordingOn && !isHLSRecordingOn) {
    return '';
  }
  const title: string[] = [];
  if (isBrowserRecordingOn) {
    title.push('Navigateur');
  }
  if (isServerRecordingOn) {
    title.push('Serveur');
  }
  if (isHLSRecordingOn) {
    title.push('HLS');
  }
  return title.join(delimiter);
};

export const LiveStatus = () => {
  const { isHLSRunning, isRTMPRunning } = useRecordingStreaming();
  const hlsState = useHMSStore(selectHLSState);
  const isMobile = useMedia(cssConfig.media.md);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { screenType } = useRoomLayoutConferencingScreen();
  const [liveTime, setLiveTime] = useState(0);

  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      const timeStamp = hlsState?.variants[0]?.[screenType === 'hls_live_streaming' ? 'startedAt' : 'initialisedAt'];
      if (hlsState?.running && timeStamp) {
        setLiveTime(Date.now() - timeStamp.getTime());
      }
    }, 1000);
  }, [hlsState?.running, hlsState?.variants, screenType]);

  useEffect(() => {
    if (hlsState?.running) {
      startTimer();
    }
    if (!hlsState?.running && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hlsState.running, isMobile, startTimer]);

  if (!isHLSRunning && !isRTMPRunning) {
    return null;
  }
  return (
    <Flex
      align="center"
      gap="1"
      css={{
        border: '1px solid $border_default',
        padding: '$4 $6 $4 $6',
        borderRadius: '$1',
      }}
    >
      <Box css={{ w: '$4', h: '$4', r: '$round', bg: '$alert_error_default', mr: '$2' }} />
      <Flex align="center" gap="2">
        <Text variant={!isMobile ? 'button' : 'body2'}>EN DIRECT</Text>
        <Text variant="caption">{hlsState?.variants?.length > 0 && isHLSRunning ? formatTime(liveTime) : ''}</Text>
      </Flex>
    </Flex>
  );
};

export const RecordingStatus = () => {
  const { isBrowserRecordingOn, isServerRecordingOn, isHLSRecordingOn, isRecordingOn } = useRecordingStreaming();
  const permissions = useHMSStore(selectPermissions);
  const isMobile = useMedia(cssConfig.media.md);

  if (
    !isRecordingOn ||
    // if only browser recording is enabled, stop recording is shown
    // so no need to show this as it duplicates
    [permissions?.browserRecording, !isServerRecordingOn, !isHLSRecordingOn, isBrowserRecordingOn].every(
      value => !!value,
    )
  ) {
    // show recording icon in mobile without popover
    if (!(isMobile && isRecordingOn)) return null;
  }

  return (
    <Tooltip
      boxCss={{ zIndex: 1 }}
      title={getRecordingText({
        isBrowserRecordingOn,
        isServerRecordingOn,
        isHLSRecordingOn,
      })}
    >
      <Flex
        css={{
          color: '$alert_error_default',
          alignItems: 'center',
        }}
      >
        <RecordIcon width={24} height={24} />
      </Flex>
    </Tooltip>
  );
};

export const RecordingPauseStatus = () => {
  const recording = useHMSStore(selectRecordingState);
  if (recording.hls && recording.hls.state === HMSRecordingState.PAUSED) {
    return (
      <Tooltip
        boxCss={{ zIndex: 1 }}
        title={getRecordingText({
          isBrowserRecordingOn: false,
          isServerRecordingOn: false,
          isHLSRecordingOn: true,
        })}
      >
        <Flex
          css={{
            color: '$on_surface_high',
            alignItems: 'center',
          }}
        >
          <PauseCircleIcon width={24} height={24} />
        </Flex>
      </Tooltip>
    );
  }
  return null;
};

// StartRecording control removed – streaming/recording start disabled

/**
 * @description only start recording button will be shown.
 */
export const StreamActions = () => {
  // const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isMobile = useMedia(cssConfig.media.md);
  const roomState = useHMSStore(selectRoomState);

  return (
    <Flex align="center" css={{ gap: '$4' }}>
      {!isMobile && (
        <Flex align="center" css={{ gap: '$4' }}>
          <RecordingPauseStatus />
          <RecordingStatus />
          {roomState !== HMSRoomState.Preview ? <LiveStatus /> : null}
        </Flex>
      )}
      {/* Re-enable to show Start/Stop recording in header */}
      {/* {isConnected && !isMobile ? <StartRecording /> : null} */}
    </Flex>
  );
};

export const StopRecordingInSheet = ({
  onStopRecording,
  onClose,
}: {
  onStopRecording: () => void;
  onClose: () => void;
}) => {
  return (
    <Sheet.Root open={true}>
      <Sheet.Content>
        <Sheet.Title css={{ p: '$10' }}>
          <Flex direction="row" justify="between" css={{ w: '100%', c: '$alert_error_default' }}>
            <Flex justify="start" align="center" gap="3">
              <AlertTriangleIcon />
              <Text variant="h5" css={{ c: '$alert_error_default' }}>
                Arrêter l’enregistrement
              </Text>
            </Flex>
            <Sheet.Close css={{ color: 'white' }} onClick={onClose}>
              <CrossIcon />
            </Sheet.Close>
          </Flex>
        </Sheet.Title>
        <HorizontalDivider />
        <Box as="div" css={{ p: '$10', overflowY: 'scroll', maxHeight: '70vh' }}>
          <Text variant="caption" css={{ c: '$on_surface_medium', pb: '$8' }}>
            Voulez-vous vraiment arrêter l’enregistrement ? Cette action est irréversible.
          </Text>
          <Button
            variant="danger"
            css={{ width: '100%' }}
            type="submit"
            data-testid="popup_change_btn"
            onClick={onStopRecording}
          >
            Arrêter
          </Button>
        </Box>
      </Sheet.Content>
    </Sheet.Root>
  );
};
