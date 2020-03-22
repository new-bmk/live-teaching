import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { pingExample } from './services/commonService'
import * as liveSessionService from './services/liveSessionService'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp(functions.config().firebase)

export const ping = functions.https.onRequest((request, response) => {
  response.send(pingExample())
})

/*
body: {
  data: {
    session_id: string
    stream_url: string
  }
}
*/
export const createLiveSession = functions.https.onRequest(async (req, res) => {
  try {
    const result = await liveSessionService.createLiveSession(req?.body?.data)
    res.send({ status: 'ok', data: result })
  } catch (error) {
    res.send({ status: 'fail', reason: error.message })
  }
})

/*
body: {
  data: {
    live_session_id: string
  }
}
*/
export const endLiveSession = functions.https.onRequest(async (req, res) => {
  try {
    const result = await liveSessionService.endLiveSession(
      req?.body?.data?.live_session_id
    )
    res.send({ status: 'ok', data: result })
  } catch (error) {
    res.send({ status: 'fail', reason: error.message })
  }
})
