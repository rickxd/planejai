import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Send } from 'lucide-react'
import { useState, type SyntheticEvent } from 'react'

interface SendButtonProps {
  onSend: (value: string) => void
}

export function AIInsightChat({ onSend }: SendButtonProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputValue) {
      return
    }

    onSend(inputValue)
    setInputValue('')
  }

  return (
    <form className="mt-2 flex justify-between gap-3" onSubmit={handleSubmit}>
      <div className="w-full">
        <Input
          placeholder="Pergunte qualquer coisa"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
      </div>
      <Button type="submit" variant="primary" icon={Send} disabled={!inputValue} />
    </form>
  )
}
