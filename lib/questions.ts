export interface Question {
  id: string
  text: string
  type: "likert" | "multiple-choice"
  options: string[]
  category: "PHQ-9" | "PARS"
}

export const mentalHealthQuestions: Question[] = [
  // PHQ-9 Questions (Depression screening)
  {
    id: "phq1",
    text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?\nपिछले 2 सप्ताहों में, कितनी बार आप किसी काम में कम रुचि या आनंद के कारण परेशान हुए हैं?",
    type: "likert",
    options: ["Not at all (बिल्कुल नहीं)", "Several days (कई दिन)", "More than half the days (आधे से अधिक दिन)", "Nearly every day (लगभग हर दिन)"],
    category: "PHQ-9",
  },
  {
    id: "phq2",
    text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?\nपिछले 2 सप्ताहों में, कितनी बार आप उदास, अवसादित, या निराश महसूस करने के कारण परेशान हुए हैं?",
    type: "likert",
    options: ["Not at all (बिल्कुल नहीं)", "Several days (कई दिन)", "More than half the days (आधे से अधिक दिन)", "Nearly every day (लगभग हर दिन)"],
    category: "PHQ-9",
  },
  {
    id: "phq3",
    text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?\nपिछले 2 सप्ताहों में, कितनी बार आप सोने में परेशानी या अधिक सोने के कारण परेशान हुए हैं?",
    type: "likert",
    options: ["Not at all (बिल्कुल नहीं)", "Several days (कई दिन)", "More than half the days (आधे से अधिक दिन)", "Nearly every day (लगभग हर दिन)"],
    category: "PHQ-9",
  },
  {
    id: "phq4",
    text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?\nपिछले 2 सप्ताहों में, कितनी बार आप थकान या कम ऊर्जा महसूस करने के कारण परेशान हुए हैं?",
    type: "likert",
    options: ["Not at all (बिल्कुल नहीं)", "Several days (कई दिन)", "More than half the days (आधे से अधिक दिन)", "Nearly every day (लगभग हर दिन)"],
    category: "PHQ-9",
  },
  {
    id: "phq5",
    text: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?\nपिछले 2 सप्ताहों में, कितनी बार आप खराब भूख या अधिक खाने के कारण परेशान हुए हैं?",
    type: "likert",
    options: ["Not at all (बिल्कुल नहीं)", "Several days (कई दिन)", "More than half the days (आधे से अधिक दिन)", "Nearly every day (लगभग हर दिन)"],
    category: "PHQ-9",
  },
  {
    id: "phq6",
    text: "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure?\nपिछले 2 सप्ताहों में, कितनी बार आप अपने बारे में बुरा महसूस करने या असफलता के कारण परेशान हुए हैं?",
    type: "likert",
    options: ["Not at all (बिल्कुल नहीं)", "Several days (कई दिन)", "More than half the days (आधे से अधिक दिन)", "Nearly every day (लगभग हर दिन)"],
    category: "PHQ-9",
  },
  // PARS Questions (Anxiety screening)
  {
    id: "pars1",
    text: "In the past month, how often have you felt nervous, anxious, or on edge?\nपिछले महीने, कितनी बार आपने नर्वस, चिंतित, या तनावग्रस्त महसूस किया?",
    type: "likert",
    options: ["Never (कभी नहीं)", "Rarely (शायद ही कभी)", "Sometimes (कभी-कभी)", "Often (अक्सर)", "Very often (बहुत अक्सर)"],
    category: "PARS",
  },
  {
    id: "pars2",
    text: "In the past month, how often have you been unable to stop or control worrying?\nपिछले महीने, कितनी बार आपने चिंता को रोकने या नियंत्रित करने में असमर्थ महसूस किया?",
    type: "likert",
    options: ["Never (कभी नहीं)", "Rarely (शायद ही कभी)", "Sometimes (कभी-कभी)", "Often (अक्सर)", "Very often (बहुत अक्सर)"],
    category: "PARS",
  },
  {
    id: "pars3",
    text: "In the past month, how often have you had trouble relaxing?\nपिछले महीने, कितनी बार आपने आराम करने में परेशानी महसूस की?",
    type: "likert",
    options: ["Never (कभी नहीं)", "Rarely (शायद ही कभी)", "Sometimes (कभी-कभी)", "Often (अक्सर)", "Very often (बहुत अक्सर)"],
    category: "PARS",
  },
  {
    id: "pars4",
    text: "In the past month, how often have you felt restless or had difficulty sitting still?\nपिछले महीने, कितनी बार आपने बेचैनी महसूस की या चुपचाप बैठने में परेशानी महसूस की?",
    type: "likert",
    options: ["Never (कभी नहीं)", "Rarely (शायद ही कभी)", "Sometimes (कभी-कभी)", "Often (अक्सर)", "Very often (बहुत अक्सर)"],
    category: "PARS",
  },
  {
    id: "pars5",
    text: "In the past month, how often have you felt afraid that something awful might happen?\nपिछले महीने, कितनी बार आपने महसूस किया कि कुछ भयानक हो सकता है?",
    type: "likert",
    options: ["Never (कभी नहीं)", "Rarely (शायद ही कभी)", "Sometimes (कभी-कभी)", "Often (अक्सर)", "Very often (बहुत अक्सर)"],
    category: "PARS",
  },
  {
    id: "pars6",
    text: "In the past month, how often have physical symptoms of anxiety (racing heart, sweating, etc.) interfered with your daily activities?\nपिछले महीने, कितनी बार चिंता के शारीरिक लक्षणों (दिल की धड़कन, पसीना, आदि) ने आपकी दैनिक गतिविधियों में हस्तक्षेप किया?",
    type: "likert",
    options: ["Never (कभी नहीं)", "Rarely (शायद ही कभी)", "Sometimes (कभी-कभी)", "Often (अक्सर)", "Very often (बहुत अक्सर)"],
    category: "PARS",
  },
]

export interface TestResponse {
  questionId: string
  answer: number
  category: "PHQ-9" | "PARS"
}

export interface TestResult {
  responses: TestResponse[]
  phq9Score: number
  parsScore: number
  completedAt: Date
  userId: string
}

export const calculateScores = (responses: TestResponse[]): { phq9Score: number; parsScore: number } => {
  const phq9Responses = responses.filter((r) => r.category === "PHQ-9")
  const parsResponses = responses.filter((r) => r.category === "PARS")
  // Assuming Likert scale answers are mapped to numerical values as follows:
  // PHQ-9: Not at all=0, Several days=1, More than half the days=2, Nearly every day=3
  // PARS: Never=0, Rarely=1, Sometimes=2, Often=3, Very often=4
  // Adjust PARS scoring to align with a 0-3 scale for consistency
  const phq9Score = phq9Responses.reduce((sum, response) => sum + response.answer, 0)
  const parsScore = parsResponses.reduce((sum, response) => sum + response.answer, 0)

  return { phq9Score, parsScore }
}

export const getScoreInterpretation = (phq9Score: number, parsScore: number) => {
  let depressionLevel = "Minimal"
  let anxietyLevel = "Minimal"

  // PHQ-9 interpretation
  if (phq9Score >= 15) depressionLevel = "Moderately Severe"
  else if (phq9Score >= 10) depressionLevel = "Moderate"
  else if (phq9Score >= 5) depressionLevel = "Mild"

  // PARS interpretation (adjusted scale)
  if (parsScore >= 15) anxietyLevel = "Severe"
  else if (parsScore >= 10) anxietyLevel = "Moderate"
  else if (parsScore >= 5) anxietyLevel = "Mild"

  return { depressionLevel, anxietyLevel }
}
