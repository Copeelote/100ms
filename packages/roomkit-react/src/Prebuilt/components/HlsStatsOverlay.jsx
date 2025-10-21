import React, { memo } from 'react';
import { CrossIcon } from '@100mslive/react-icons';
import { Flex } from '../../Layout';
import { Text } from '../../Text';
import IconButton from '../IconButton';

export function HlsStatsOverlay({ hlsStatsState, onClose }) {
  return (
    <Flex
      css={{
        position: 'absolute',
        width: '$80',
        marginLeft: '$8',
        padding: '$8 $8 $10',
        zIndex: 10,
        backgroundColor: '$surface_brighter',
        borderRadius: '$1',
      }}
      direction="column"
    >
      <IconButton css={{ position: 'absolute', top: '$2', right: '$2' }} onClick={onClose}>
        <CrossIcon />
      </IconButton>
      <HlsStatsRow label="Taille vidéo">
        {` ${hlsStatsState?.videoSize?.width}x${hlsStatsState?.videoSize?.height}`}
      </HlsStatsRow>
      <HlsStatsRow label="Durée du tampon">{hlsStatsState?.bufferedDuration?.toFixed(2)} </HlsStatsRow>
      <HlsStatsRow label="Vitesse de connexion">
        {`${(hlsStatsState?.bandwidthEstimate / (1000 * 1000)).toFixed(2)} Mbps`}
      </HlsStatsRow>
      <HlsStatsRow label="Débit binaire">{`${(hlsStatsState?.bitrate / (1000 * 1000)).toFixed(2)} Mbps`}</HlsStatsRow>
      <HlsStatsRow label="distance du direct">
        {getDurationFromSeconds(hlsStatsState.distanceFromLive / 1000)}
      </HlsStatsRow>
      <HlsStatsRow label="Images supprimées">{hlsStatsState?.droppedFrames}</HlsStatsRow>
    </Flex>
  );
}

/**
 * Extracted from HLS new Player PR.
 * TODO: remove this and use HMSVideoUtils.js
 * when that code is merged
 */
export function getDurationFromSeconds(timeInSeconds) {
  let time = Math.floor(timeInSeconds);
  const hours = Math.floor(time / 3600);
  time = time - hours * 3600;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);

  const prefixedMinutes = `${minutes < 10 ? '0' + minutes : minutes}`;
  const prefixedSeconds = `${seconds < 10 ? '0' + seconds : seconds}`;

  let videoTimeStr = `${prefixedMinutes}:${prefixedSeconds}`;
  if (hours) {
    const prefixedHours = `${hours < 10 ? '0' + hours : hours}`;
    videoTimeStr = `${prefixedHours}:${prefixedMinutes}:${prefixedSeconds}`;
  }
  return videoTimeStr;
}

const HlsStatsRow = memo(({ label, children }) => {
  return (
    <Flex gap={4} justify="center" css={{ width: '100%' }}>
      <Text
        css={{
          width: '50%',
          '@md': { fontSize: '$md' },
          '@sm': { fontSize: '$sm' },
          // textAlign: "right",
        }}
      >
        {label}
      </Text>
      <Text
        css={{
          '@md': { fontSize: '$md' },
          '@sm': { fontSize: '$sm' },
          width: '50%',
          overflowWrap: 'break-word',
          // textAlign: "left",
        }}
      >
        {children}
      </Text>
    </Flex>
  );
});
