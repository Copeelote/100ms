const connectionTooltip = {
  0: 'Reconnexion en cours',
  1: 'Connexion très mauvaise',
  2: 'Mauvaise connexion',
  3: 'Connexion modérée',
  4: 'Bonne connexion',
  5: 'Excellente connexion',
};
connectionTooltip[-1] = 'Réseau inconnu';

/**
 * @param connectionScore -> 1-5 connection score for network quality
 */
export const getTooltipText = connectionScore => {
  return connectionTooltip[connectionScore];
};

/**
 * position is needed here as we don't want all the dots/arcs to be colored,
 * the non colored ones will be passed in the default color. If user is
 * disconnected(score=0), no dot/arc will be colored.
 * @param position -> 1 to 5
 * @param connectionScore -> 0 to 5, 0 means disconnected
 * @param defaultColor -> color for components not taking the connection color
 */
export const getColor = (position, connectionScore, defaultColor, theme) => {
  const shouldBeColored = position <= connectionScore;
  if (!shouldBeColored) {
    return defaultColor;
  }
  if (connectionScore >= 4) {
    return theme.colors.alert_success;
  } else if (connectionScore >= 1) {
    return theme.colors.alert_warning;
  }
  return defaultColor;
};
