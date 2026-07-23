import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import GuideExperience from './GuideExperience'
import { DOTNET_GUIDE } from './guides/dotnetGuide'
import { STACKS } from './guideIndex'

export default function DotnetDeployPage() {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const stackData = STACKS.find(s => s.id === 'dotnet')

  return (
    <GuideExperience
      guide={DOTNET_GUIDE}
      stackData={stackData}
      toggleTheme={toggleTheme}
      onBack={() => navigate('/deployment')}
    />
  )
}
