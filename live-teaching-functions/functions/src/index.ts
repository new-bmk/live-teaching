import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { pingExample } from './services/commonService'
import * as liveSessionService from './services/liveSessionService'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp(functions.config().firebase)
const cors = require('cors')
const corsHandler = cors({ origin: true })

export const ping = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    res.send({data: pingExample()})
  })
})

/*
body: {
  data: {
    subject_id: string
    session_id: string
    stream_url: string
  }
}
*/
export const createLiveSession = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const result = await liveSessionService.createLiveSession(req?.body?.data)
      res.send({data: { status: 'ok', data: result }})
    } catch (error) {
      res.send({data: { status: 'fail', reason: error.message }})
    }
  })
})

export const joinLiveSession = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const result = await liveSessionService.joinLiveSession(
        req?.body?.data?.live_session_id,
        req?.body?.data?.code
      )
      res.send({ status: 'ok', data: { ...result, valid: true } })
    } catch (error) {
      res.send({ status: 'fail', reason: error.message })
    }
  })
})

export const submitAnswer = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const result = await liveSessionService.submitAnswer(
        req?.body?.data?.live_session_id,
        req?.body?.data?.code,
        req?.body?.data?.quesionAnswer,
        req?.body?.data?.questionIdx
      )
      res.send({ status: 'ok', data: { ...result, valid: true } })
    } catch (error) {
      res.send({ status: 'fail', reason: error.message })
    }
  })
})

/*
body: {
  data: {
    live_session_id: string
  }
}
*/
export const endLiveSession = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const result = await liveSessionService.endLiveSession(
        req?.body?.data?.live_session_id
      )
      res.send({data: { status: 'ok', data: result }})
    } catch (error) {
      res.send({data: { status: 'fail', reason: error.message }})
    }
  })
})
