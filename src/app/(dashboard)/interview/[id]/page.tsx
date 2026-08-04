'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Send, Type, Mic2, X, Brain, Code2 } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useInterviewStore } from '@/store/interviewStore'
import { interviewApi } from '@/lib/api/interview'
import { Button } from '@/components/ui/Button'
import { MicButton } from '@/components/interview/MicButton'
import { FeedbackOverlay } from '@/components/interview/FeedbackOverlay'
import { cn } from '@/lib/utils/cn'

export default function ActiveInterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const {
    interview,
    currentQuestionIndex,
    currentEvaluation,
    isSubmitting,
    setInterview,
    setEvaluation,
    nextQuestion,
    setSubmitting,
    completeInterview,
  } = useInterviewStore()
  const { theme } = useTheme()

  const [answerText, setAnswerText] = useState('')
  const [codeContent, setCodeContent] = useState('// Write your solution here...\n')
  const [language, setLanguage] = useState('javascript')
  const [activeTab, setActiveTab] = useState<'type' | 'speak' | 'code'>('type')
  const [isLoadingInterview, setIsLoadingInterview] = useState(!interview || interview.id !== params.id)

  // Load interview if not in store
  useEffect(() => {
    if (!interview || interview.id !== params.id) {
      interviewApi.getById(params.id).then((res) => {
        setInterview(res.interview)
        setIsLoadingInterview(false)
      }).catch(() => {
        router.push('/dashboard')
      })
    } else {
      setIsLoadingInterview(false)
    }
  }, [params.id])

  if (isLoadingInterview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (!interview) return null

  const questions = interview.questions || []
  const currentQ = questions[currentQuestionIndex]
  const isLast = currentQuestionIndex === questions.length - 1
  const progress = ((currentQuestionIndex + (currentEvaluation ? 1 : 0)) / questions.length) * 100

  const submitAnswer = async (text?: string, audio?: Blob, code?: string) => {
    if (!currentQ) return
    if (!text?.trim() && !audio && !code?.trim()) {
      toast.error('Please provide an answer before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const res = await interviewApi.submitAnswer(interview.id, {
        questionId: currentQ.id,
        text: text || undefined,
        audio: audio || undefined,
        code: code || undefined,
        language: code ? language : undefined
      })
      setEvaluation(res.evaluation)
      setAnswerText('')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit answer. Try again.')
      setSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (isLast) {
      completeInterview()
      try {
        await interviewApi.complete(interview.id)
      } catch {}
      router.push(`/interview/${interview.id}/report`)
    } else {
      nextQuestion()
    }
  }

  return (
    <div className="min-h-screen bg-lavender-50 flex flex-col">
      {/* Focus mode header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-lavender-50/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <Brain className="h-4 w-4 text-lavender-950" />
          </div>
          <div>
            <p className="text-sm font-semibold text-lavender-950">{interview.role}</p>
            <p className="text-xs text-gray-500 capitalize">{interview.difficulty} · {interview.experience}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
          <div className="w-32 h-1.5 bg-brand-500/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 rounded-lg text-gray-600 hover:text-lavender-950 hover:bg-brand-500/5 transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-7xl mx-auto w-full p-4 md:p-6 gap-6">
        {/* Left: Question + Answer */}
        <div className="flex flex-col gap-5">
          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                  Question {currentQuestionIndex + 1}
                </span>
                {currentQ?.type && (
                  <span className="text-xs text-gray-500 bg-brand-500/5 px-2.5 py-1 rounded-full border border-brand-500/10 capitalize">
                    {currentQ.type}
                  </span>
                )}
              </div>
              <p className="text-lavender-950 text-lg md:text-xl font-medium leading-relaxed">
                {currentQ?.text || 'Loading question...'}
              </p>
              {currentQ?.hint && (
                <p className="text-xs text-gray-500 mt-4 italic border-t border-white/[0.06] pt-3">
                  💡 {currentQ.hint}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Answer panel */}
          {!currentEvaluation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden"
            >
              {/* Tabs */}
              <div className="flex border-b border-white/[0.06]">
                {[
                  { key: 'type', label: 'Type Answer', icon: Type },
                  { key: 'speak', label: 'Speak Answer', icon: Mic2 },
                  { key: 'code', label: 'Write Code', icon: Code2 },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all duration-200',
                      activeTab === key
                        ? 'text-brand-700 border-b-2 border-brand-500 bg-brand-500/5'
                        : 'text-gray-600 hover:text-lavender-950'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'type' ? (
                  <div className="space-y-4">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type your answer here... Be specific, use examples, and structure your thoughts clearly."
                      rows={6}
                      className="w-full bg-transparent text-sm text-lavender-950 placeholder:text-gray-500 resize-none focus:outline-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-xs text-gray-500">{answerText.length} characters</span>
                      <Button
                        variant="glow"
                        size="md"
                        isLoading={isSubmitting}
                        onClick={() => submitAnswer(answerText)}
                        disabled={!answerText.trim() || isSubmitting}
                        rightIcon={<Send className="h-4 w-4" />}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                ) : activeTab === 'code' ? (
                  <div className="space-y-4">
                    <div className="h-[300px] border border-white/[0.06] rounded-xl overflow-hidden bg-[#1e1e1e]">
                      <Editor
                        height="100%"
                        language={language}
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        value={codeContent}
                        onChange={(value) => setCodeContent(value || '')}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          padding: { top: 16, bottom: 16 },
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                    <div className="flex flex-col space-y-3">
                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Explain your approach (optional)..."
                        rows={2}
                        className="w-full bg-transparent text-sm text-lavender-950 dark:text-white placeholder:text-gray-500 resize-none focus:outline-none border-b border-white/[0.06] pb-2"
                      />
                      <div className="flex items-center justify-between">
                        <select 
                          value={language} 
                          onChange={(e) => setLanguage(e.target.value)}
                          className="bg-brand-500/10 text-brand-700 text-xs px-3 py-1.5 rounded-lg border border-brand-500/20 focus:outline-none cursor-pointer"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </select>
                        <Button
                          variant="glow"
                          size="md"
                          isLoading={isSubmitting}
                          onClick={() => submitAnswer(answerText, undefined, codeContent)}
                          disabled={isSubmitting}
                          rightIcon={<Send className="h-4 w-4" />}
                        >
                          Submit Code
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <MicButton
                      onRecordingComplete={(blob) => submitAnswer(undefined, blob)}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Loading submission state */}
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20"
            >
              <Loader2 className="h-5 w-5 text-brand-600 animate-spin" />
              <p className="text-sm text-brand-700">AI is evaluating your answer...</p>
            </motion.div>
          )}
        </div>

        {/* Right: Feedback panel */}
        <div className="lg:sticky lg:top-20 self-start">
          {currentEvaluation ? (
            <FeedbackOverlay
              evaluation={currentEvaluation}
              isLastQuestion={isLast}
              onNext={handleNext}
            />
          ) : (
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-brand-500/5 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">Submit your answer to receive<br />instant AI feedback here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
