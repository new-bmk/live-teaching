import * as admin from 'firebase-admin'
import { ILiveSessionInput } from '../types'

export const createLiveSessionRefById = (liveSessionId: string) => {
  return admin
    .firestore()
    .collection('live_session')
    .doc(liveSessionId)
}

export const createSessionRefById = (sessionId: string) => {
  return admin
    .firestore()
    .collection('session')
    .doc(sessionId)
}

export const createLiveSession = async (
  liveSessionInput: ILiveSessionInput
) => {
  const sessionRef = createSessionRefById(liveSessionInput.session_id)

  const liveSessionCreateResult = await admin
    .firestore()
    .collection('live_session')
    .add({
      session_ref: sessionRef,
      start_stamp: admin.firestore.FieldValue.serverTimestamp(),
      end_stamp: null,
      stream_url: liveSessionInput.stream_url,
      participant_count: 0,
      active_question_idx: -1
    })
  const recordedSessionCreateResult = await admin
    .firestore()
    .collection('recorded_session')
    .add({
      session_ref: sessionRef,
      live_session_ref: createLiveSessionRefById(liveSessionCreateResult.id),
      start_stamp: admin.firestore.FieldValue.serverTimestamp(),
      end_stamp: null,
      participants: []
    })
  return { liveSessionCreateResult, recordedSessionCreateResult }
}

export const endLiveSession = async (liveSessionId: string) => {
  const liveSessionRef = createLiveSessionRefById(liveSessionId)
  const liveSessionResult = await liveSessionRef.update({
    end_stamp: admin.firestore.FieldValue.serverTimestamp()
  })

  const snapshot = await admin
    .firestore()
    .collection('recorded_session')
    .where('live_session_ref', '==', liveSessionRef)
    .get()
  const recordedSessionResults = []
  if (!snapshot.empty) {
    for (const doc of snapshot.docs) {
      const recordedSessionResult = await doc.ref.update({
        end_stamp: admin.firestore.FieldValue.serverTimestamp()
      })
      recordedSessionResults.push(recordedSessionResult)
    }
  }
  return { liveSessionResult, recordedSessionResults }
}
