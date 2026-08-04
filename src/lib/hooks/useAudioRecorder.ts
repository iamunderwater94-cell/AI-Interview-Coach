'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

export function useAudioRecorder() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [levels, setLevels] = useState<number[]>(Array(20).fill(0))
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const updateLevels = useCallback(() => {
    if (!analyserRef.current) return
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)
    const barCount = 20
    const step = Math.floor(dataArray.length / barCount)
    const newLevels = Array.from({ length: barCount }, (_, i) => {
      const slice = dataArray.slice(i * step, (i + 1) * step)
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length
      return avg / 255
    })
    setLevels(newLevels)
    animFrameRef.current = requestAnimationFrame(updateLevels)
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
      }

      mediaRecorder.start(100)
      setRecordingState('recording')
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)

      updateLevels()
    } catch (err: any) {
      console.error('Mic error:', err)
      let errorMessage = 'Microphone access denied. Please allow microphone access.'
      if (err.name === 'NotFoundError' || err.message.includes('Requested device not found')) {
        errorMessage = 'No microphone found on this device. Please connect a microphone.'
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Your microphone is currently in use by another application (like Zoom or Teams) or is blocked by your OS.'
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone access denied by browser or operating system.'
      } else if (err.message) {
        errorMessage = `Microphone error: ${err.message}`
      }
      setError(errorMessage)
    }
  }, [updateLevels])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
      setRecordingState('stopped')
      setLevels(Array(20).fill(0))
    }
  }, [recordingState])

  const reset = useCallback(() => {
    stopRecording()
    setAudioBlob(null)
    setDuration(0)
    setRecordingState('idle')
    setLevels(Array(20).fill(0))
  }, [stopRecording])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return { recordingState, audioBlob, duration, levels, error, startRecording, stopRecording, reset }
}
