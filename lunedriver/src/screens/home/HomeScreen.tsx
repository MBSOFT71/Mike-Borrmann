import { Logo } from '../../components/brand/Logo'
import { ClassSelectButton } from '../../components/ui/ClassSelectButton'
import { classButtons } from '../../navigation/classButtons'

export function HomeScreen() {
  return (
    <section className="screen">
      <div className="home-hero">
        <Logo />
        <h1>
          Willkommen bei
          <br />
          LüneDriver
        </h1>
        <p>Deine Vorbereitung auf die praktische Führerscheinprüfung.</p>
      </div>
      <div className="class-list">
        {classButtons.map((config) => (
          <ClassSelectButton key={config.id} config={config} />
        ))}
      </div>
    </section>
  )
}
