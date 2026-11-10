import { useEffect, useRef, useState } from 'react'
import type { VideoMarker } from '../../types'
import { FullscreenIcon, PauseIcon, PlayIcon, VolumeIcon } from '../icons/Icons'
import { PlaceholderState } from '../ui/PlaceholderState'
import { SignChip } from '../ui/SignChip'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

type VideoPlayerProps = {
  src?: string
  title?: string
  poster?: string
  explanation?: string
  markers?: VideoMarker[]
}

export function VideoPlayer({ src, title, poster, explanation, markers = [] }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onTime = () => setCurrent(el.currentTime)
    const onMeta = () => setDuration(el.duration || 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [src])

  if (!src) {
    return (
      <div className="stack">
        <PlaceholderState title="Video folgt">
          <p>{title ?? 'Für diesen Eintrag ist noch keine URL hinterlegt.'}</p>
        </PlaceholderState>
        {explanation ? <p className="player__explain">{explanation}</p> : null}
      </div>
    )
  }

  const active = markers.filter((marker) => {
    const end = marker.endSeconds ?? marker.atSeconds + 3
    return current >= marker.atSeconds && current < end
  })

  function togglePlay() {
    const el = videoRef.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }

  function seek(value: number) {
    const el = videoRef.current
    if (!el) return
    el.currentTime = value
    setCurrent(value)
  }

  function changeVolume(value: number) {
    const el = videoRef.current
    if (!el) return
    el.volume = value
    el.muted = value === 0
    setVolume(value)
    setMuted(value === 0)
  }

  async function toggleFullscreen() {
    const node = stageRef.current
    if (!node) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await node.requestFullscreen()
  }

  return (
    <div className="player">
      <div className="player__stage" ref={stageRef}>
        <video
          ref={videoRef}
          className="player__video"
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          title={title}
        />
        <div className="player__signs" aria-live="polite">
          {active.map((marker) => (
            <SignChip key={`${marker.atSeconds}-${marker.label}`} label={marker.label} />
          ))}
        </div>
      </div>
      <div className="player__controls">
        <button
          type="button"
          className="player__btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Wiedergabe'}
        >
          {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>
        <span className="player__time">{formatTime(current)}</span>
        <div className="player__timeline-wrap">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Number.isFinite(current) ? current : 0}
            aria-label="Zeitleiste"
            onChange={(event) => seek(Number(event.target.value))}
          />
          <div className="player__marks" aria-hidden="true">
            {duration > 0
              ? markers.map((marker) => (
                  <span
                    key={marker.atSeconds}
                    className="player__mark"
                    style={{ left: `${(marker.atSeconds / duration) * 100}%` }}
                  />
                ))
              : null}
          </div>
        </div>
        <span className="player__time">{formatTime(duration)}</span>
        <button
          type="button"
          className="player__btn"
          onClick={() => changeVolume(muted ? 1 : 0)}
          aria-label="Lautstärke"
        >
          <VolumeIcon size={20} />
        </button>
        <input
          type="range"
          className="player__vol"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          aria-label="Lautstärkeregler"
          onChange={(event) => changeVolume(Number(event.target.value))}
        />
        <button
          type="button"
          className="player__btn"
          onClick={() => void toggleFullscreen()}
          aria-label="Vollbild"
        >
          <FullscreenIcon size={20} />
        </button>
      </div>
      {explanation ? <p className="player__explain">{explanation}</p> : null}
    </div>
  )
}
