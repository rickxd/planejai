import { SimulationCard } from '@/components/features/SimulationHistory/SimulationCardProps'
import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SimulationHistoryPage() {
  const { loadSimulationData, deleteSimulation } = useSimulationStorage()
  const [savedData, setSavedData] = useState(loadSimulationData())
  const navigate = useNavigate()

  const handleDelete = (id: string) => {
    setSavedData(deleteSimulation(id))
  }

  return (
    <main className="max-w-6x1 mx-auto px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros"
      />
      <div className="mb-6 grid grid-cols-1 gap-4">
        {savedData.length === 0 ? (
          <div className="justify-items-center">
            <p>Nenhum registro de simulação encontrado.</p>
            <p>Faça uma nova simulação.</p>
            <Button
              variant="secondary"
              icon={TrendingUp}
              onClick={() => void navigate('/')}
              className="mt-3"
            >
              <span className="sm:inline">Nova Simulação</span>
            </Button>
          </div>
        ) : (
          savedData.map((simulation: SimulationRecord) => {
            return (
              <SimulationCard key={simulation.id} simulation={simulation} onDelete={handleDelete} />
            )
          })
        )}
      </div>
    </main>
  )
}
