import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import type { SimulationRecord } from '@/data/simulation'
import { formatDate } from '@/utils/date'
import { calcMonthlySavings } from '@/utils/simulation'
import { Goal, SquareArrowOutUpRight, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SimulationCardProps {
  simulation: SimulationRecord
}

interface ActionButtonsProps {
  onDelete: (id: string) => void
}

export function SimulationCard({ simulation, onDelete }: SimulationCardProps & ActionButtonsProps) {
  const [isDelete, setIsDelete] = useState(false)

  const monthlySavings = calcMonthlySavings(simulation)
  const navigate = useNavigate()

  const toggleDelete = () => {
    isDelete ? setIsDelete(false) : setIsDelete(true)
  }

  const handleDeleteButton = () => {
    onDelete(simulation.id)
    setIsDelete(false)
  }

  return (
    <div className="bg-card text-foreground rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
        <div className="text-primary mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#ece5f8]">
          <Goal />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{simulation.goalName}</h3>
          <span className="text-muted-foreground text-sm">{formatDate(simulation.createdAt)}</span>
        </div>
        <div className="flex-1">
          <span className="text-muted-foreground text-sm">Custo da meta</span>
          <p className="font-semibold">{`R$ ${simulation.goalAmount}`}</p>
        </div>
        <div className="flex-1">
          <span className="text-muted-foreground text-sm">Prazo</span>
          <p className="font-semibold">{`${simulation.goalDeadline} meses`}</p>
        </div>
        <div className="flex-1">
          <span className="text-muted-foreground text-sm">Economia mensal</span>
          <p className="font-semibold">
            {`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
        <Divider orientation="horizontal" className="block lg:hidden" />
        <div className="flex w-full items-center justify-between lg:w-auto lg:pt-0 lg:pl-6">
          <Divider orientation="vertical" className="hidden lg:block" />
          <div className="flex-1 items-center justify-center lg:flex-0">
            <Button variant="ghost" className="h-full w-full" onClick={toggleDelete}>
              <Trash2 className="text-red-500" />
            </Button>
          </div>
          <Divider orientation="vertical" className="block lg:hidden" />
          <div className="flex-1 items-center justify-center lg:flex-0">
            <Button
              variant="ghost"
              icon={SquareArrowOutUpRight}
              onClick={() => void navigate(`/resultado/${simulation.id}`)}
              className="lg:bg-secondary-button lg:border-border h-full w-full whitespace-nowrap lg:h-auto lg:rounded-3xl lg:border"
            >
              <span className="sm:inline">Ver detalhes</span>
            </Button>
          </div>
        </div>
      </div>
      {isDelete && (
        <div className="bg-card text-foreground mt-3 w-auto flex-col justify-items-center rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <span className="mb-3 flex font-semibold text-red-500">Excluir simulação?</span>
          <div className="flex gap-3">
            <Button variant="danger" icon={Trash2} onClick={handleDeleteButton} className="flex-1">
              Excluir
            </Button>
            <Button variant="ghost" icon={X} onClick={toggleDelete}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
