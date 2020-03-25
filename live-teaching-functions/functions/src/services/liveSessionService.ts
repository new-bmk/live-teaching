import * as admin from 'firebase-admin'
import { ILiveSessionInput, IParticipant } from '../types'

export const createLiveSessionRefById = (liveSessionId: string) => {
  return admin
    .firestore()
    .collection('live_session')
    .doc(liveSessionId)
}

export const createRecordedSessionRefById = (liveSessionId: string) => {
  return admin
    .firestore()
    .collection('recorded_session')
    .doc(liveSessionId)
}

export const createSessionRefById = (subjectId: string, sessionId: string) => {
  return admin
    .firestore()
    .collection('subject')
    .doc(subjectId)
    .collection('session')
    .doc(sessionId)
}

export const createLiveSession = async (
  liveSessionInput: ILiveSessionInput
) => {
  const sessionRef = createSessionRefById(
    liveSessionInput.subject_id,
    liveSessionInput.session_id
  )

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
  return {
    liveSessionCreateResult: {
      id: liveSessionCreateResult.id
    },
    recordedSessionCreateResult: {
      id: recordedSessionCreateResult.id
    }
  }
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

export const joinLiveSession = async (liveSessionId: string, code: string) => {
  const liveSessionRef = createLiveSessionRefById(liveSessionId)
  const recordedSessionDocumentData = await admin
    .firestore()
    .collection('recorded_session')
    .where('live_session_ref', '==', liveSessionRef)
    .get()
  if (!recordedSessionDocumentData.empty) {
    // should have one record
    for (const recordedSessionDoc of recordedSessionDocumentData.docs) {
      const recordedParticipants = recordedSessionDoc?.data()?.participants
      const participant = recordedParticipants?.find(
        (participantData: IParticipant) => {
          return participantData.code === code
        }
      )
      if (!participant) {
        const time = new Date()
        const updateRecordesSession = {
          participant_count: recordedParticipants.length + 1,
          participants: admin.firestore.FieldValue.arrayUnion({
            code,
            joined_stamp: time,
            quiz_results: []
          })
        }

        await admin
          .firestore()
          .collection('recorded_session')
          .doc(recordedSessionDoc.id)
          .update(updateRecordesSession)
      }
    }

    return { log: 'success' }
  }
  throw new Error('cannot find recorded_session')
}

export const submitAnswer = async (
  liveSessionId: string,
  code: string,
  quesionAnswer: string,
  questionIdx: number
) => {
  const liveSessionRef = createLiveSessionRefById(liveSessionId)
  const recordedSessionRefs = await admin
    .firestore()
    .collection('recorded_session')
    .where('live_session_ref', '==', liveSessionRef)

  await admin
    .firestore()
    .runTransaction(t => {
      return t
        .get(recordedSessionRefs)
        .then(async (doc: FirebaseFirestore.QuerySnapshot) => {
          // should have one record
          const recordedSessionDoc = doc.docs[0]
          const recordedSessionData = doc.docs[0].data()
          const recordedParticipants = recordedSessionData?.participants
          const participantIdx = recordedParticipants?.findIndex(
            (participantData: IParticipant) => {
              return participantData.code === code
            }
          )
          if (participantIdx < 0) {
            throw new Error('Cannot find Participant')
          }
          const questionSnapshot = await recordedSessionData?.session_ref?.get()
          const question = questionSnapshot?.data()?.questions[questionIdx]
          const updateParticipant = {
            ...recordedParticipants[participantIdx],
            quiz_results: [
              ...recordedParticipants[participantIdx].quiz_results,
              {
                answer: quesionAnswer,
                question_idx: questionIdx,
                score: question.score
              }
            ]
          }
          recordedParticipants[participantIdx] = updateParticipant
          const recordedSessionRef = createRecordedSessionRefById(
            recordedSessionDoc.id
          )
          return t.update(recordedSessionRef, {
            participants: recordedParticipants
          })
        })
    })
    .then(result => {
      return { log: 'success' }
    })
    .catch(err => {
      throw err
    })

  return { log: 'Transaction success' }
}
