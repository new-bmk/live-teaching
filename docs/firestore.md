#Firestore structure

*/subject/HK0OFtBINF5EY5o2zrml*
```js
interface Subject{
    id: string    
    publicity: "private" | "public"
    sessions: Session[]
}
```

*/subject/HK0OFtBINF5EY5o2zrml/sessions/B6EWvvy59XjrPjBdzbyr*
```js
interface Question {
    type: "simple_choices"
    question_text: string
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

*/live_session/T0BFl855cvqa4hWHvbHl*
```js
interface LiveSession {
    session_ref: string
    start_stamp: Date
    end_stamp: Date
}
```
Live session should be deleted when ended.

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
    end_stamp: Date
    participants: Participant[]
}
```


