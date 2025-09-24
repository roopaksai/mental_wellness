"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MusicRecommendation } from "@/lib/recommendations"
import { Music, Play } from "lucide-react"

interface MusicRecommendationsProps {
  music: MusicRecommendation[]
}

export function MusicRecommendations({ music }: MusicRecommendationsProps) {
  const handlePlayMusic = (track: MusicRecommendation) => {
    if (track.youtubeUrl) {
      window.open(track.youtubeUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Music for Your Mood
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {music.map((track) => (
            <div key={track.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">{track.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {track.artist} • {track.genre}
                </p>
                <span className="text-xs text-primary">{track.mood}</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => handlePlayMusic(track)}>
                <Play className="h-4 w-4 mr-2" />
                Listen
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
