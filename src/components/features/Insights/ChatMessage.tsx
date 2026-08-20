import { Divider } from '@/components/shared/Divider'
import type { ChatData } from '@/services/aiService'
import { MessageCircle } from 'lucide-react'

interface ChatMessageProps {
  data: ChatData
}

export function ChatMessage({ data }: ChatMessageProps) {
  return (
    <>
      <Divider orientation="horizontal" />
      <div className="flex-col-1 w-full">
        <div className="mb-2 flex content-center items-center gap-2">
          <MessageCircle className="text-primary" />
          <p className="text-foreground font-semibold">
            {data.role === 'user' ? 'Você' : 'Resposta da IA'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm leading-relaxed">{data.message}</p>
        </div>
      </div>
    </>
  )
}
