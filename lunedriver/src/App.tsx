import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AreaOverviewScreen } from './screens/area/AreaOverviewScreen'
import { ClassMenuScreen } from './screens/class-menu/ClassMenuScreen'
import { DownloadsScreen } from './screens/downloads/DownloadsScreen'
import { HitchingDetailScreen } from './screens/hitching/HitchingDetailScreen'
import { HomeScreen } from './screens/home/HomeScreen'
import { ManeuverDetailScreen } from './screens/maneuver/ManeuverDetailScreen'
import { SettingsScreen } from './screens/settings/SettingsScreen'
import { TechniqueDetailScreen } from './screens/technique/TechniqueDetailScreen'
import { VehicleTopicsScreen } from './screens/technique/VehicleTopicsScreen'
import { QuestionDetailScreen } from './screens/question/QuestionDetailScreen'
import { SignCategoryScreen } from './screens/signs/SignCategoryScreen'
import { SignDetailScreen } from './screens/signs/SignDetailScreen'
import { VideoDetailScreen } from './screens/video/VideoDetailScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/downloads" element={<DownloadsScreen />} />
          <Route path="/einstellungen" element={<SettingsScreen />} />
          <Route path="/klasse/:classId" element={<ClassMenuScreen />} />
          <Route path="/klasse/:classId/fahrstrecken/:videoId" element={<VideoDetailScreen />} />
          <Route path="/klasse/:classId/technik/:vehicleId/:topicId" element={<TechniqueDetailScreen />} />
          <Route path="/klasse/:classId/technik/:vehicleId" element={<VehicleTopicsScreen />} />
          <Route path="/klasse/:classId/anhaengertechnik/:topicId" element={<TechniqueDetailScreen />} />
          <Route path="/klasse/:classId/grundfahraufgaben/:maneuverId" element={<ManeuverDetailScreen />} />
          <Route path="/klasse/:classId/an-abkuppeln/:stepId" element={<HitchingDetailScreen />} />
          <Route path="/klasse/:classId/fragen/:questionId" element={<QuestionDetailScreen />} />
          <Route path="/klasse/:classId/verkehrszeichen/:category/:signId" element={<SignDetailScreen />} />
          <Route path="/klasse/:classId/verkehrszeichen/:category" element={<SignCategoryScreen />} />
          <Route path="/klasse/:classId/:areaId" element={<AreaOverviewScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
