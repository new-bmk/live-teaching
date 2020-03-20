import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { pingExample } from './services/commonService'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp(functions.config().firebase)

export const ping = functions.https.onRequest((request, response) => {
  response.send(pingExample())
})
