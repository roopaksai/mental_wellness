export interface Activity {
  id: string
  title: string
  description: string
  duration: string
  category: "mindfulness" | "exercise" | "social" | "creative" | "academic"
  difficulty: "easy" | "medium" | "hard"
  youtubeUrl?: string
}

export interface MusicRecommendation {
  id: string
  title: string
  artist: string
  genre: string
  mood: string
  spotifyUrl?: string
  youtubeUrl?: string
}

export const activities: Activity[] = [
  {
    id: "1",
    title: "5-Minute Breathing Exercise",
    description: "A simple breathing technique to reduce anxiety and promote relaxation",
    duration: "5 minutes",
    category: "mindfulness",
    difficulty: "easy",
    youtubeUrl: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
  },
  {
    id: "2",
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for each day",
    duration: "10 minutes",
    category: "mindfulness",
    difficulty: "easy",
    youtubeUrl: "https://www.youtube.com/watch?v=WPPPFqsECz0",
  },
  {
    id: "3",
    title: "Nature Walk",
    description: "Take a peaceful walk outdoors to clear your mind",
    duration: "20-30 minutes",
    category: "exercise",
    difficulty: "easy",
    youtubeUrl: "https://www.youtube.com/watch?v=d0tU18Ybcvk",
  },
  {
    id: "4",
    title: "Progressive Muscle Relaxation",
    description: "Systematically tense and relax different muscle groups",
    duration: "15 minutes",
    category: "mindfulness",
    difficulty: "medium",
    youtubeUrl: "https://www.youtube.com/watch?v=1nZEdqcGVzo",
  },
  {
    id: "5",
    title: "Creative Art Session",
    description: "Express yourself through drawing, painting, or crafting",
    duration: "30-60 minutes",
    category: "creative",
    difficulty: "medium",
    youtubeUrl: "https://www.youtube.com/watch?v=ZczPKBbZukk",
  },
  {
    id: "6",
    title: "Connect with a Friend",
    description: "Reach out to someone you trust for a meaningful conversation",
    duration: "30 minutes",
    category: "social",
    difficulty: "easy",
    youtubeUrl: "https://www.youtube.com/watch?v=R1vskiVDwl4",
  },
]

export const musicRecommendations: MusicRecommendation[] = [
  {
    id: "1",
    title: "Weightless",
    artist: "Marconi Union",
    genre: "Ambient",
    mood: "Calming",
    youtubeUrl: "https://www.youtube.com/watch?v=UfcAVejslrU",
  },
  {
    id: "2",
    title: "Clair de Lune",
    artist: "Claude Debussy",
    genre: "Classical",
    mood: "Peaceful",
    youtubeUrl: "https://www.youtube.com/watch?v=CvFH_6DNRCY",
  },
  {
    id: "3",
    title: "River",
    artist: "Eminem ft. Ed Sheeran",
    genre: "Hip-Hop",
    mood: "Reflective",
    youtubeUrl: "https://www.youtube.com/watch?v=o_0UJ76GgNM",
  },
  {
    id: "4",
    title: "Holocene",
    artist: "Bon Iver",
    genre: "Indie Folk",
    mood: "Contemplative",
    youtubeUrl: "https://www.youtube.com/watch?v=TWcyIpul8OE",
  },
  {
    id: "5",
    title: "Mad World",
    artist: "Gary Jules",
    genre: "Alternative",
    mood: "Melancholic",
    youtubeUrl: "https://www.youtube.com/watch?v=4N3N1MlvVc4",
  },
  {
    id: "6",
    title: "The Sound of Silence",
    artist: "Simon & Garfunkel",
    genre: "Folk Rock",
    mood: "Introspective",
    youtubeUrl: "https://www.youtube.com/watch?v=4fWyzwo1xg0",
  },
]

export const getPersonalizedActivities = (phq9Score: number, parsScore: number): Activity[] => {
  let recommendedActivities = [...activities]

  // Prioritize based on scores
  if (parsScore > 10) {
    // High anxiety - prioritize mindfulness and breathing
    recommendedActivities = recommendedActivities.sort((a, b) => {
      if (a.category === "mindfulness" && b.category !== "mindfulness") return -1
      if (b.category === "mindfulness" && a.category !== "mindfulness") return 1
      return 0
    })
  }

  if (phq9Score > 10) {
    // High depression - prioritize social and exercise
    recommendedActivities = recommendedActivities.sort((a, b) => {
      if (
        (a.category === "social" || a.category === "exercise") &&
        b.category !== "social" &&
        b.category !== "exercise"
      )
        return -1
      if (
        (b.category === "social" || b.category === "exercise") &&
        a.category !== "social" &&
        a.category !== "exercise"
      )
        return 1
      return 0
    })
  }

  return recommendedActivities.slice(0, 4)
}

export const getPersonalizedMusic = (phq9Score: number, parsScore: number): MusicRecommendation[] => {
  let recommendedMusic = [...musicRecommendations]

  // Filter based on mood needs
  if (parsScore > 10) {
    // High anxiety - prioritize calming music
    recommendedMusic = recommendedMusic.filter((music) => music.mood === "Calming" || music.mood === "Peaceful")
  }

  if (phq9Score > 10) {
    // High depression - include uplifting and reflective music
    recommendedMusic = recommendedMusic.filter(
      (music) => music.mood === "Reflective" || music.mood === "Contemplative" || music.mood === "Introspective",
    )
  }

  return recommendedMusic.slice(0, 3)
}
