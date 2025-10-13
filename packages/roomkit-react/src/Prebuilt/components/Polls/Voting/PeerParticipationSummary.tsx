import React from 'react';
import { HMSPoll, selectLocalPeerID, useHMSStore } from '@100mslive/react-sdk';
import { Box } from '../../../../Layout';
import { Text } from '../../../../Text';
import { StatisticBox } from './StatisticBox';
import { useQuizSummary } from './useQuizSummary';
import { getFormattedTime } from '../common/utils';

export const PeerParticipationSummary = ({ quiz }: { quiz: HMSPoll }) => {
  const localPeerId = useHMSStore(selectLocalPeerID);
  const { quizLeaderboard, summary } = useQuizSummary(quiz.id);
  if (quiz.state !== 'stopped') {
    return <></>;
  }
  const isLocalPeerQuizCreator = localPeerId === quiz.startedBy;
  const peerEntry = quizLeaderboard?.entries.find(entry => entry.peer?.peerid === localPeerId);

  const boxes = isLocalPeerQuizCreator
    ? [
        {
          title: 'A voté',
          value: `${summary.totalUsers ? ((100 * summary.votedUsers) / summary.totalUsers).toFixed(0) : 0}% (${
            summary.votedUsers
          }/${summary.totalUsers})`,
        },
        {
          title: 'Bonnes réponses',
          value: `${summary.totalUsers ? ((100 * summary.correctUsers) / summary.totalUsers).toFixed(0) : 0}% (${
            summary.correctUsers
          }/${summary.totalUsers})`,
        },
        // Time in ms
        { title: 'Temps moyen écoulé', value: getFormattedTime(summary.avgTime) },
        {
          title: 'Score moyen',
          value: Number.isInteger(summary.avgScore) ? summary.avgScore : summary.avgScore.toFixed(2),
        },
      ]
    : [
        { title: 'Votre classement', value: peerEntry?.position || '-' },
        { title: 'Points', value: peerEntry?.score || 0 },
        // Time in ms
        { title: 'Temps écoulé', value: getFormattedTime(peerEntry?.duration) },
        {
          title: 'Bonnes réponses',
          value: peerEntry?.totalResponses ? `${peerEntry?.correctResponses}/${peerEntry.totalResponses}` : '-',
        },
      ];

  return (
    <Box>
      <Text css={{ fontWeight: '$semiBold', my: '$8' }}>Résumé de participation</Text>
      <Box css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '$4' }}>
        {boxes.map(box => (
          <StatisticBox key={box.title} title={box.title} value={box.value} />
        ))}
      </Box>
    </Box>
  );
};
