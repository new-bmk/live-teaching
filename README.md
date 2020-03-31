# Initialize Project
## Firebase
This project want firebase project. 
- firestore setup firebase : https://firebase.google.com/docs/firestore/quickstart
   - setup initailize collections. [this structure can be read here](https://github.com/new-bmk/live-teaching/blob/master/docs/firestore.md)
- functions
- firebase-tools
  - `npm install -g firebase-tools`

## live-teching-web (web)
1. `cd live-teching-web`
2. `yarn install`
3. config firebase
   - create file name `firebase-key.ts` in path `live-teching-web/src/environments`
   - on `firebase-key.ts` included
    ```ts
        export const firebaseKey = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: ""
        }
    ```
## live-teching-functions (server)
1. `cd live-teching-functions/functions`
2. `yarn install`
3. config your firebase functions
    - use firebase-cli for connect firebase-functions
    - 1. `firebase login` (login firebase)
    - 2. `firebase use --add` (select project and naming alias e.g. prod)
    - 3. `firebase use [alias-name|project-name]`
4. config firebase config in locally. (for dev) (optional) 
   - https://firebase.google.com/docs/functions/local-emulator
# Run Development

## live-teching-web (web)
1. `cd live-teching-web`
2. `yarn start`
   
## live-teching-functions (server)
1. `cd live-teching-functions/functions`
2. `yarn serve` (can't use firestore if don't setup number 4. (live-teching-functions))
   
# Run Production
## live-teching-web (web)
1. `cd live-teching-web`
2. `yarn build`
3. serve static folder on `./dist`
   
## live-teching-functions (server)
1. `cd live-teching-functions/functions`
2. `yarn deploy` 

enjoy :)
