import { DocumentReference } from '@angular/fire/firestore';

export interface ISubject {
  id: string;
  publicity: 'private' | 'public';
  sessions: ISession[];
  moderators: string[];
}

export interface IQuestion {
  type: 'simple_choices';
  question_text: string;
  question_image_url?: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  answer: string;
  score: number;
}

export interface ISession {
  id?: string;
  title?: string;
  questions: IQuestion[];
}

export interface ILiveSession {
  session_ref?: DocumentReference;
  start_stamp?: Date;
  stream_url?: string;
  participant_count?: number;
  active_question_idx?: number; // -1 if not active
}

export interface IQuizResult {
  answer: string;
  score: number;
  question_idx: number;
}

export interface IParticipant {
  code: string;
  quiz_results: IQuizResult[];
  joined_stamp: Date;
}

export interface VoiceClip {
  participantCode: string;
  fileUrl: string;
  listened: boolean;
  sent_stamp: Date;
}

export interface IRecordedSession {
  session_ref: DocumentReference;
  live_session_ref: DocumentReference;
  start_stamp?: Date;
  end_stamp?: Date;
  participants: IParticipant[];
  voiceClips: VoiceClip[];
}
