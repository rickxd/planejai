import { buildAIQuestion } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/data/simulation'
import { getAnswer, type ChatData } from '@/services/aiService'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSimulationStorage } from './useSimulationStorage'

export const useChat = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const mockAnswer = {
    id: crypto.randomUUID(),
    role: 'assistant',
    message: 'Testando resposta.',
  } as ChatData

  const isRequestPending = useRef(false)
  const [chat, setChat] = useState<ChatData[]>(() => {
    const simulation = getFormData(id)
    // console.log(simulation?.chat)
    if (simulation?.chat) {
      return simulation.chat
    }

    return []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChat = useCallback(
    async (simulationId: string, message?: ChatData) => {
      const simulation = getFormData(simulationId)
      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }
      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        if (message) {
          const prompt = buildAIQuestion(simulation, message)
          const answer = await getAnswer(prompt)
          const answerData: ChatData = {
            id: crypto.randomUUID(),
            role: 'assistant',
            message: answer,
          }
          const updatedChat = [...chat, message, answerData] as ChatData[]
          setChat(updatedChat)
          updateSimulation(simulation.id, {
            ...simulation,
            chat: updatedChat,
          } as SimulationRecord)
          return updatedChat
        }
        return chat
      } catch {
        setError('Erro ao gerar resposta. Tente novamente.')
        console.log(error)
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  useEffect(() => {
    if (chat || isLoading || error || isRequestPending.current) {
      return
    }

    fetchChat(id).then((data) => {
      if (!data) return
      setChat(data)
    })
  }, [id, chat, isLoading, fetchChat])

  return { chat, fetchChat, error, isLoading }
}
