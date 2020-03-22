export interface Question {
  type: "simple_choices";
  question_text: string;
  question_image_url?: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  answer: string;
  score: number;
}
