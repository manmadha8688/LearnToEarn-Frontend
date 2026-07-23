import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import GuideExperience from './GuideExperience'
import { GOLANG_GUIDE } from './guides/golangGuide'
import { STACKS } from './guideIndex'

export default function GolangDeployPage() {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const stackData = STACKS.find(s => s.id === 'golang')

  return (
    <GuideExperience
      guide={GOLANG_GUIDE}
      stackData={stackData}
      toggleTheme={toggleTheme}
      onBack={() => navigate('/deployment')}
    />
  )
}
