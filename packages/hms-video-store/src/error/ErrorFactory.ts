/*
 * ErrorFactory.ts
 *
 * Created by codegen
 * Copyright © 2021 100ms. All rights reserved.
 */

import { ErrorCodes } from './ErrorCodes';
import { HMSAction } from './HMSAction';
import { HMSException } from './HMSException';
import { HMSTrackException } from './HMSTrackException';
import { HMSTrackExceptionTrackType } from '../media/tracks/HMSTrackExceptionTrackType';
import { HMSSignalMethod } from '../signal/jsonrpc/models';

const terminalActions: (HMSSignalMethod | HMSAction)[] = [
  HMSSignalMethod.JOIN,
  HMSSignalMethod.OFFER,
  HMSSignalMethod.ANSWER,
  HMSSignalMethod.TRICKLE,
  HMSSignalMethod.SERVER_ERROR,
  HMSAction.JOIN,
];

export const ErrorFactory = {
  WebSocketConnectionErrors: {
    FailedToConnect(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebSocketConnectionErrors.FAILED_TO_CONNECT,
        'WebsocketFailedToConnect',
        action,
        `[WS]: ${description}`,
        `[WS]: ${description}`,
      );
    },

    WebSocketConnectionLost(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebSocketConnectionErrors.WEBSOCKET_CONNECTION_LOST,
        'WebSocketConnectionLost',
        action,
        `Connexion réseau perdue`,
        description,
      );
    },

    AbnormalClose(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebSocketConnectionErrors.ABNORMAL_CLOSE,
        'WebSocketAbnormalClose',
        action,
        `La connexion WebSocket s’est fermée anormalement`,
        description,
      );
    },
  },

  APIErrors: {
    ServerErrors(code: number, action: HMSAction, description = '', isTerminal = true) {
      return new HMSException(
        code,
        'ServerErrors',
        action,
        `[${action}]: Erreur serveur ${description}`,
        description,
        isTerminal,
      );
    },

    EndpointUnreachable(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.APIErrors.ENDPOINT_UNREACHABLE,
        'EndpointUnreachable',
        action,
        `Point de terminaison inaccessible - ${description}`,
        description,
      );
    },

    InvalidTokenFormat(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.APIErrors.INVALID_TOKEN_FORMAT,
        'InvalidTokenFormat',
        action,
        `Le jeton n’est pas au format JWT valide - ${description}`,
        description,
        true,
      );
    },

    InitConfigNotAvailable(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.APIErrors.INIT_CONFIG_NOT_AVAILABLE,
        'InitError',
        action,
        `[INIT]: ${description}`,
        `[INIT]: ${description}`,
      );
    },
  },

  TracksErrors: {
    GenericTrack(action: HMSAction, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.GENERIC_TRACK,
        'GenericTrack',
        action,
        `[TRACK]: ${description}`,
        `[TRACK]: ${description}`,
        HMSTrackExceptionTrackType.AUDIO_VIDEO,
      );
    },
    CantAccessCaptureDevice(action: HMSAction, deviceInfo: string, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.CANT_ACCESS_CAPTURE_DEVICE,
        'CantAccessCaptureDevice',
        action,
        `L’utilisateur a refusé l’accès au périphérique de capture - ${deviceInfo}`,
        description,
        deviceInfo as HMSTrackExceptionTrackType,
      );
    },

    DeviceNotAvailable(action: HMSAction, deviceInfo: string, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.DEVICE_NOT_AVAILABLE,
        'DeviceNotAvailable',
        action,
        `[PISTE]: Le périphérique de capture n’est plus disponible - ${deviceInfo}`,
        description,
        deviceInfo as HMSTrackExceptionTrackType,
      );
    },

    DeviceInUse(action: HMSAction, deviceInfo: string, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.DEVICE_IN_USE,
        'DeviceInUse',
        action,
        `[PISTE]: Le périphérique de capture est utilisé par une autre application - ${deviceInfo}`,
        description,
        deviceInfo as HMSTrackExceptionTrackType,
      );
    },

    DeviceLostMidway(action: HMSAction, deviceInfo: string, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.DEVICE_LOST_MIDWAY,
        'DeviceLostMidway',
        action,
        `Perte d’accès au périphérique de capture en cours d’utilisation - ${deviceInfo}`,
        description,
        deviceInfo as HMSTrackExceptionTrackType,
      );
    },

    NothingToReturn(
      action: HMSAction,
      description = '',
      message = `Aucun média à retourner. Veuillez sélectionner la vidéo, l’audio ou les deux.`,
    ) {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.NOTHING_TO_RETURN,
        'NothingToReturn',
        action,
        message,
        description,
        HMSTrackExceptionTrackType.AUDIO_VIDEO,
      );
    },

    InvalidVideoSettings(action: HMSAction, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.INVALID_VIDEO_SETTINGS,
        'InvalidVideoSettings',
        action,
        `Impossible d’activer le simulcast sans paramètres vidéo fournis`,
        description,
        HMSTrackExceptionTrackType.VIDEO,
      );
    },

    AutoplayBlocked(action: HMSAction, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.AUTOPLAY_ERROR,
        'AutoplayBlocked',
        action,
        "Lecture automatique bloquée car l’utilisateur n’a pas interagi avec le document",
        description,
        HMSTrackExceptionTrackType.AUDIO,
      );
    },

    CodecChangeNotPermitted(action: HMSAction, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.CODEC_CHANGE_NOT_PERMITTED,
        'CodecChangeNotPermitted',
        action,
        `Le codec ne peut pas être modifié en cours d’appel.`,
        description,
        HMSTrackExceptionTrackType.AUDIO_VIDEO,
      );
    },

    OverConstrained(action: HMSAction, deviceInfo: string, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.OVER_CONSTRAINED,
        'OverConstrained',
        action,
        `[PISTE]: Les contraintes demandées ne peuvent pas être satisfaites par le matériel du périphérique - ${deviceInfo}`,
        description,
        deviceInfo as HMSTrackExceptionTrackType,
      );
    },

    NoAudioDetected(action: HMSAction, description = 'Veuillez vérifier le micro ou utiliser une autre entrée audio') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.NO_AUDIO_DETECTED,
        'NoAudioDetected',
        action,
        'Aucune entrée audio détectée depuis le microphone',
        description,
        HMSTrackExceptionTrackType.AUDIO,
      );
    },

    SystemDeniedPermission(action: HMSAction, deviceInfo: string, description = '') {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.SYSTEM_DENIED_PERMISSION,
        'SystemDeniedPermission',
        action,
        `Le système d’exploitation a refusé l’accès au périphérique de capture - ${deviceInfo}`,
        description,
        deviceInfo as HMSTrackExceptionTrackType,
      );
    },

    CurrentTabNotShared() {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.CURRENT_TAB_NOT_SHARED,
        'CurrentTabNotShared',
        HMSAction.TRACK,
        'L’application nécessite le partage de l’onglet actuel',
        'Vous devez partager l’onglet actuel pour continuer',
        HMSTrackExceptionTrackType.SCREEN,
      );
    },

    AudioPlaybackError(description: string) {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.AUDIO_PLAYBACK_ERROR,
        'Erreur de lecture audio',
        HMSAction.TRACK,
        description,
        description,
        HMSTrackExceptionTrackType.AUDIO,
      );
    },

    SelectedDeviceMissing(deviceType: string) {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.SELECTED_DEVICE_MISSING,
        'SelectedDeviceMissing',
        HMSAction.TRACK,
        `Impossible de détecter le périphérique ${deviceType} sélectionné`,
        `Veuillez vérifier la connexion au périphérique ${deviceType}`,
        deviceType as HMSTrackExceptionTrackType,
      );
    },

    NoDataInTrack(description: string) {
      return new HMSTrackException(
        ErrorCodes.TracksErrors.NO_DATA,
        'La piste ne contient aucune donnée',
        HMSAction.TRACK,
        description,
        'Cela peut être dû à une autre application prioritaire sur l’accès à la caméra ou au micro, ou à un appel entrant',
        HMSTrackExceptionTrackType.AUDIO_VIDEO,
      );
    },
  },

  WebrtcErrors: {
    CreateOfferFailed(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebrtcErrors.CREATE_OFFER_FAILED,
        'CreateOfferFailed',
        action,
        `[${action.toString()}]: Échec de la création de l’offre. `,
        description,
      );
    },

    CreateAnswerFailed(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebrtcErrors.CREATE_ANSWER_FAILED,
        'CreateAnswerFailed',
        action,
        `[${action.toString()}]: Échec de la création de la réponse. `,
        description,
      );
    },

    SetLocalDescriptionFailed(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebrtcErrors.SET_LOCAL_DESCRIPTION_FAILED,
        'SetLocalDescriptionFailed',
        action,
        `[${action.toString()}]: Échec de l’application de l’offre. `,
        description,
      );
    },

    SetRemoteDescriptionFailed(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebrtcErrors.SET_REMOTE_DESCRIPTION_FAILED,
        'SetRemoteDescriptionFailed',
        action,
        `[${action.toString()}]: Échec de l’application de la réponse. `,
        description,
        true,
      );
    },

    ICEFailure(action: HMSAction, description = '', isTerminal = false) {
      return new HMSException(
        ErrorCodes.WebrtcErrors.ICE_FAILURE,
        'ICEFailure',
        action,
        `[${action.toString()}]: État de connexion ICE ÉCHEC`,
        description,
        isTerminal,
      );
    },

    ICEDisconnected(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebrtcErrors.ICE_DISCONNECTED,
        'ICEDisconnected',
        action,
        `[${action.toString()}]: État de connexion ICE DÉCONNECTÉ`,
        description,
      );
    },

    StatsFailed(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebrtcErrors.STATS_FAILED,
        'StatsFailed',
        action,
        `Échec de la récupération des statistiques WebRTC - ${description}`,
        description,
      );
    },
  },

  WebsocketMethodErrors: {
    ServerErrors(code: number, action: HMSAction | HMSSignalMethod, description: string) {
      return new HMSException(code, 'ServerErrors', action, description, description, terminalActions.includes(action));
    },

    AlreadyJoined(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebsocketMethodErrors.ALREADY_JOINED,
        'AlreadyJoined',
        action,
        `[JOIN]: Vous avez déjà rejoint cette salle.`,
        description,
      );
    },

    CannotJoinPreviewInProgress(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.WebsocketMethodErrors.CANNOT_JOIN_PREVIEW_IN_PROGRESS,
        'CannotJoinPreviewInProgress',
        action,
        `[JOIN]: Impossible de rejoindre si l’aperçu est en cours`,
        description,
      );
    },
  },

  GenericErrors: {
    NotConnected(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.GenericErrors.NOT_CONNECTED,
        'NotConnected',
        action,
        `Le client n’est pas connecté`,
        description,
      );
    },

    Signalling(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.GenericErrors.SIGNALLING,
        'Signalling',
        action,
        `Erreur de signalisation inconnue : ${action.toString()} ${description} `,
        description,
      );
    },

    Unknown(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.GenericErrors.UNKNOWN,
        'Unknown',
        action,
        `Exception inconnue : ${description}`,
        description,
      );
    },

    NotReady(action: HMSAction, description = '') {
      return new HMSException(ErrorCodes.GenericErrors.NOT_READY, 'NotReady', action, description, description);
    },

    JsonParsingFailed(action: HMSAction, jsonMessage: string, description = '') {
      return new HMSException(
        ErrorCodes.GenericErrors.JSON_PARSING_FAILED,
        'JsonParsingFailed',
        action,
        `Échec de l’analyse du message JSON - ${jsonMessage}`,
        description,
      );
    },

    TrackMetadataMissing(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.GenericErrors.TRACK_METADATA_MISSING,
        'TrackMetadataMissing',
        action,
        `Métadonnées de piste manquantes`,
        description,
      );
    },

    RTCTrackMissing(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.GenericErrors.RTC_TRACK_MISSING,
        'RTCTrackMissing',
        action,
        `Piste RTC manquante`,
        description,
      );
    },

    PeerMetadataMissing(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.GenericErrors.PEER_METADATA_MISSING,
        'PeerMetadataMissing',
        action,
        `Métadonnées du pair manquantes`,
        description,
      );
    },

    ValidationFailed(message: string, entity?: any) {
      return new HMSException(
        ErrorCodes.GenericErrors.VALIDATION_FAILED,
        'ValidationFailed',
        HMSAction.VALIDATION,
        message,
        entity ? JSON.stringify(entity) : '',
      );
    },

    InvalidRole(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.GenericErrors.INVALID_ROLE,
        'InvalidRole',
        action,
        `Rôle invalide. Rejoignez avec un rôle valide`,
        description,
        true,
      );
    },

    PreviewAlreadyInProgress(action: HMSAction, description = '') {
      return new HMSException(
        ErrorCodes.GenericErrors.PREVIEW_IN_PROGRESS,
        'PreviewAlreadyInProgress',
        action,
        `[Prévisualisation] : Impossible de rejoindre si l’aperçu est en cours`,
        description,
      );
    },

    LocalStorageAccessDenied(description = 'Access to localStorage has been denied') {
      return new HMSException(
        ErrorCodes.GenericErrors.LOCAL_STORAGE_ACCESS_DENIED,
        'LocalStorageAccessDenied',
        HMSAction.NONE,
        `Accès à localStorage refusé`,
        description,
      );
    },

    MissingMediaDevices() {
      return new HMSException(
        ErrorCodes.GenericErrors.MISSING_MEDIADEVICES,
        'MissingMediaDevices',
        HMSAction.JOIN,
        `navigator.mediaDevices est indéfini. Le SDK 100ms ne fonctionnera pas sur ce site car WebRTC n’est pas pris en charge sur HTTP (navigator.mediaDevices manquant). Veuillez utiliser le SDK en local (localhost) ou sur une URL HTTPS valide.`,
        '',
        true,
      );
    },

    MissingRTCPeerConnection() {
      return new HMSException(
        ErrorCodes.GenericErrors.MISSING_RTCPEERCONNECTION,
        'MissingRTCPeerConnection',
        HMSAction.JOIN,
        `RTCPeerConnection, requis pour les appels WebRTC, est introuvable. Cela peut être dû à un navigateur non pris en charge ou à une extension bloquant WebRTC`,
        '',
        true,
      );
    },
  },

  MediaPluginErrors: {
    PlatformNotSupported(action: HMSAction, description = '') {
      return new HMSException(
        7001,
        'PlatformNotSupported',
        action,
        'Consultez la documentation HMS pour la liste des plateformes prises en charge',
        description,
      );
    },

    InitFailed(action: HMSAction, description = '') {
      return new HMSException(7002, 'InitFailed', action, "Échec de l’initialisation du plugin", description);
    },

    ProcessingFailed(action: HMSAction, description = '') {
      return new HMSException(7003, 'ProcessingFailed', action, 'Échec du traitement du plugin', description);
    },

    AddAlreadyInProgress(action: HMSAction, description = '') {
      return new HMSException(7004, 'AddAlreadyInProgress', action, "Ajout du plugin déjà en cours", description);
    },

    DeviceNotSupported(action: HMSAction, description = '') {
      return new HMSException(
        7005,
        'DeviceNotSupported',
        action,
        'Consultez la documentation HMS pour la liste des appareils pris en charge',
        description,
      );
    },
  },

  PlaylistErrors: {
    NoEntryToPlay(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.PlaylistErrors.NO_ENTRY_TO_PLAY,
        'NoEntryToPlay',
        action,
        'Fin de la liste de lecture atteinte',
        description,
      );
    },
    NoEntryPlaying(action: HMSAction, description: string) {
      return new HMSException(
        ErrorCodes.PlaylistErrors.NO_ENTRY_IS_PLAYING,
        'NoEntryIsPlaying',
        action,
        'Aucune entrée en lecture pour le moment',
        description,
      );
    },
  },
};
