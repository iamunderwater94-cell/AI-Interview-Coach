'use client'
import { motion } from 'framer-motion'
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder'
import { Mic, Square, RotateCcw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface MicButtonProps {
  onRecordingComplete: (blob: Blob) => void
  disabled?: boolean
}

export function MicButton({ onRecordingComplete, disabled }: MicButtonProps) {
  const { recordingState, audioBlob, duration, levels, error, startRecording, stopRecording, reset } = useAudioRecorder()

  const handleStop = () => {
    stopRecording()
  }

  const handleUse = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob)
      reset()
    }
  }

  const formatDuration = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Audio waveform bars */}
      <div className="flex items-end gap-1 h-14 w-48">
        {levels.map((level, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-full transition-all',
              recordingState === 'recording'
                ? 'bg-gradient-to-t from-brand-600 to-brand-400'
                : 'bg-brand-500/10'
            )}
            style={{
              height: `${Math.max(4, level * 100)}%`,
              transitionDuration: '100ms',
            }}
          />
        ))}
      </div>

      {/* Timer */}
      {recordingState === 'recording' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-sm font-mono text-red-300">{formatDuration(duration)}</span>
        </motion.div>
      )}

      {/* Main button */}
      <div className="relative">
        {recordingState === 'recording' && (
          <>
            <div className="absolute inset-0 rounded-full bg-brand-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-[-8px] rounded-full bg-brand-500/15 animate-pulse" />
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={recordingState === 'recording' ? handleStop : startRecording}
          disabled={disabled || recordingState === 'stopped'}
          className={cn(
            'relative h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl',
            recordingState === 'recording'
              ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/40'
              : 'bg-gradient-to-br from-brand-500 to-cyan-500 shadow-brand-500/40 hover:shadow-brand-500/60'
          )}
        >
          {recordingState === 'recording' ? (
            <Square className="h-8 w-8 text-lavender-950 fill-white" />
          ) : (
            <Mic className="h-8 w-8 text-lavender-950" />
          )}
        </motion.button>
      </div>

      {/* Action buttons post-recording */}
      {recordingState === 'stopped' && audioBlob && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-500/10 bg-brand-500/5 text-sm text-gray-600 hover:bg-brand-500/10 transition-all"
          >
            <RotateCcw className="h-4 w-4" /> Re-record
          </button>
          <button
            onClick={handleUse}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-sm text-lavender-950 font-semibold hover:from-brand-400 hover:to-brand-500 transition-all shadow-lg shadow-brand-500/25"
          >
            Use Recording ✓
          </button>
        </motion.div>
      )}

      <p className="text-xs text-gray-500">
        {recordingState === 'idle' && 'Click to start recording your answer'}
        {recordingState === 'recording' && 'Click to stop recording'}
        {recordingState === 'stopped' && 'Review and submit your recording'}
      </p>
    </div>
  )
}
