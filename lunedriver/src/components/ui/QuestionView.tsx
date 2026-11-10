import { useState } from 'react'
import type { PracticeQuestion } from '../../types'
import { DemoBanner } from './DemoBanner'

type QuestionViewProps = {
  question: PracticeQuestion
}

export function QuestionView({ question }: QuestionViewProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div className="stack">
      {question.demo ? <DemoBanner>Selbst erstellte Übungsfrage, kein Theoriekatalog.</DemoBanner> : null}
      <h2 className="question-prompt">{question.prompt}</h2>
      <div className="option-list">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex
          const isSelected = selected === index
          let className = 'option'
          if (answered && isCorrect) className += ' option--correct'
          else if (answered && isSelected && !isCorrect) className += ' option--wrong'
          return (
            <button
              key={option}
              type="button"
              className={className}
              disabled={answered}
              onClick={() => setSelected(index)}
            >
              {option}
            </button>
          )
        })}
      </div>
      {answered ? (
        <div className="card">
          <strong>{selected === question.correctIndex ? 'Passend' : 'Anders lösen'}</strong>
          <p className="detail-body detail-body--tight">{question.explanation}</p>
        </div>
      ) : (
        <p className="muted-hint">Wähle eine Antwort. Danach erscheint die Erklärung — ohne Wertung oder Fortschritt.</p>
      )}
    </div>
  )
}
