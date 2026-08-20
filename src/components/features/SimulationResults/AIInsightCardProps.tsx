import 'react-loading-skeleton/dist/skeleton.css'

import { Divider } from '@/components/shared/Divider'
import { useChat } from '@/hooks/useChat'
import { useInsight } from '@/hooks/useInsight'
import type { ChatData } from '@/services/aiService'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { ChatMessage } from '../Insights/ChatMessage'
import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'
import { AIInsightChat } from './AIInsightChat'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const { chat, fetchChat, error: chatError, isLoading: isChatLoading } = useChat(simulationId)
  const [question, setQuestion] = useState<ChatData | null>(null)

  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [question])

  const handleSend = (value: string) => {
    const newQuestion: ChatData = {
      id: crypto.randomUUID(),
      role: 'user',
      message: value,
    }
    setQuestion(newQuestion)
    fetchChat(simulationId, newQuestion)
  }

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}
      {!isLoading && insight && !error && (
        <>
          <Content insight={insight}>
            {chat.length > 0 &&
              chat.map((c) => {
                return <ChatMessage data={c} key={c.id} />
              })}
            {isChatLoading && (
              <>
                <Divider orientation="horizontal" />
                <Skeleton
                  count={3.5}
                  baseColor="var(--color-skeleton-base)"
                  highlightColor="var(--color-skeleton-highlight)"
                  className="mb-3 flex rounded-lg"
                  containerClassName="flex-1"
                  inline
                />
              </>
            )}
            {!isChatLoading && chatError && (
              <>
                <Divider orientation="horizontal" />
                <Error
                  simulationId={simulationId}
                  message={chatError}
                  onRetry={() => {
                    fetchChat(simulationId, question!)
                  }}
                />
              </>
            )}
            <div ref={messageEndRef} />
          </Content>
          <AIInsightChat onSend={handleSend} />
        </>
      )}
    </div>
  )
}
