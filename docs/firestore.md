# Firestore structure

### Subject
*/subject/HK0OFtBINF5EY5o2zrml*
```js
interface Subject{
    id: string    
    publicity: "private" | "public"
    sessions: Session[]
    moderators: string[]
}
```
Moderator, able to manipulate corresponding sessions, is identified with user reference such as email.

### Session
*/subject/HK0OFtBINF5EY5o2zrml/sessions/B6EWvvy59XjrPjBdzbyr*
```js
interface Question {
    type: "simple_choices"
    question_text: string
    question_image_url?: string
    c1: string
    c2: string
    c3: string
    c4: string
    answer: string
    score: number
}

interface Session {
    id: string
    questions: Question[]
}
```

### Live Session
*/live_session/T0BFl855cvqa4hWHvbHl*
```js
interface LiveSession {
    session_ref: string
    start_stamp: Date
    stream_url: string
    participant_count: number
    active_question_idx: number  //-1 if not active
}
```
Live session should be deleted when ended.

### Recored Session
This is created along with live session.

*/recorded_session/CIAcia7eVR378f9z1VtM*
```js
interface QuizResult {
    answer: string
    score: number
    question_idx: number
}

interface Participant {
    code: string
    quiz_results: QuizResult[]
    joined_stamp: Date
}

interface RecordedSession {
    session_ref: string
    live_session_ref: string
    start_stamp: Date
    end_stamp?: Date
    participants: Participant[]
}
```


