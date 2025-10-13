import { HMSRoleName } from '../role';

export type HMSPollUserTrackingMode = 'peerID' | 'customerID' | 'userName';

export type HMSPollState = 'created' | 'started' | 'stopped';

export interface HMSPoll {
  id: string;
  title: string;
  state?: HMSPollState;
  type: 'poll' | 'quiz';
  duration?: number;
  anonymous?: boolean;
  visibility?: boolean;
  locked?: boolean;
  mode?: HMSPollUserTrackingMode;
  createdBy?: string;
  startedBy?: string;
  stoppedBy?: string;
  createdAt?: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  questions?: HMSPollQuestion[];
  rolesThatCanVote?: HMSRoleName[];
  rolesThatCanViewResponses?: HMSRoleName[];
  result?: HMSPollResult;
}

export interface HMSPollCreateParams
  extends Pick<
    HMSPoll,
    | 'id'
    | 'title'
    | 'type'
    | 'duration'
    | 'anonymous'
    | 'visibility'
    | 'locked'
    | 'mode'
    | 'rolesThatCanVote'
    | 'rolesThatCanViewResponses'
  > {
  questions?: HMSPollQuestionCreateParams[];
}

export interface HMSPollQuestion {
  index: number;
  text: string;
  type: HMSPollQuestionType;
  skippable?: boolean;
  duration?: number;
  once?: boolean;
  weight?: number;
  negative?: boolean;
  answerMinLen?: number;
  answerMaxLen?: number;
  options?: HMSPollQuestionOption[];
  answer?: HMSPollQuestionAnswer;
  responses?: HMSPollQuestionResponse[];
  result?: HMSPollQuestionResult;
}

export interface HMSPollQuestionCreateParams extends Pick<HMSPollQuestion, 'text' | 'skippable' | 'type' | 'answer'> {
  index?: number;
  options?: HMSPollQuestionOptionCreateParams[];
  weight?: number;
}

export interface HMSPollQuestionAnswer {
  hidden: boolean; // si vrai, la réponse ne sera pas renvoyée pendant le sondage
  option?: number; // index de l’option pour la bonne réponse, pour choix unique
  options?: number[]; // liste des options devant figurer dans la réponse
  text?: string; // texte de la réponse
  case?: boolean; // si faux, la casse est ignorée lors de la comparaison
  trim?: boolean; // si vrai, les espaces sont supprimés au début et à la fin de la réponse
}

export enum HMSPollQuestionType {
  SINGLE_CHOICE = 'Choix unique',
  MULTIPLE_CHOICE = 'Choix multiples',
  SHORT_ANSWER = 'Réponse courte',
  LONG_ANSWER = 'Réponse longue',
}

export enum HMSPollStates {
  CREATED = 'created',
  STARTED = 'started',
  STOPPED = 'stopped',
}

export interface HMSPollQuestionOption {
  index: number;
  text: string;
  weight?: number;
  voteCount?: number;
}

export interface HMSPollQuestionOptionCreateParams extends Pick<HMSPollQuestionOption, 'text' | 'weight'> {
  isCorrectAnswer?: boolean;
}

export interface HMSPollQuestionResponse {
  id?: string;
  questionIndex: number;
  peer?: HMSPollResponsePeerInfo;
  type?: HMSPollQuestionType;
  skipped?: boolean;
  option?: number;
  options?: number[];
  text?: string;
  update?: boolean; // le SDK doit suivre si nous avons déjà répondu et l’indiquer
  duration?: number; // temps nécessaire pour répondre à la question (classement)
  responseFinal?: boolean; // indique s’il s’agit de la dernière mise à jour lors de la récupération des réponses
}

export type HMSPollQuestionResponseCreateParams = Omit<
  HMSPollQuestionResponse,
  'type' | 'peer' | 'update' | 'responseFinal'
>;

interface HMSPollResponsePeerInfo {
  userHash?: string;
  peerid?: string;
  userid?: string;
  username?: string;
}

export interface HMSPollResult {
  /**
   * Nombre d’utilisateurs uniques ayant répondu au sondage
   */
  totalUsers?: number;
  /**
   * Nombre maximal d’utilisateurs dans la salle pendant le sondage
   */
  maxUsers?: number;
  totalResponses?: number;
}

export interface HMSPollQuestionResult {
  correctResponses?: number; // réponses correctes
  skippedCount?: number; // réponses ignorées
  totalResponses?: number; // nombre total de réponses
}

export interface HMSQuizLeaderboardEntry {
  position: number;
  score: number;
  totalResponses: number;
  correctResponses: number;
  duration: number;
  peer: HMSPollResponsePeerInfo;
}

export interface HMSQuizLeaderboardSummary {
  avgScore: number;
  avgTime: number;
  votedUsers: number;
  totalUsers: number;
  correctUsers: number;
}

export interface HMSQuizLeaderboardResponse {
  entries: HMSQuizLeaderboardEntry[];
  hasNext: boolean;
  summary?: HMSQuizLeaderboardSummary;
}
