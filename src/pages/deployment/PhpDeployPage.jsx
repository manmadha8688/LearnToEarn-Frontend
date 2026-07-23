import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import GuideExperience from './GuideExperience'
import { PHP_GUIDE } from './guides/phpGuide'
import { STACKS } from './guideIndex'

export default function PhpDeployPage() {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const stackData = STACKS.find(s => s.id === 'php')

  return (
    <GuideExperience
      guide={PHP_GUIDE}
      stackData={stackData}
      toggleTheme={toggleTheme}
      onBack={() => navigate('/deployment')}
    />
  )
}
