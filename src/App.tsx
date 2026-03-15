import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import SectionWrapper from './components/Layout/SectionWrapper';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import ComingSoon from './components/sections/ComingSoon';
import Contact from './components/sections/Contact';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />

        <SectionWrapper id="about" title="About">
          <About />
        </SectionWrapper>

        <SectionWrapper id="skills" title="Skills">
          <Skills />
        </SectionWrapper>

        <SectionWrapper id="projects" title="Projects">
          <Projects />
        </SectionWrapper>

        <SectionWrapper id="experience" title="Experience">
          <Experience />
        </SectionWrapper>

        <SectionWrapper id="education" title="Education">
          <Education />
        </SectionWrapper>

        <SectionWrapper id="currently-working-on" title="Currently Working On">
          <ComingSoon
            title="Currently Working On"
            message="Exciting projects in progress. Stay tuned for updates!"
          />
        </SectionWrapper>

        <SectionWrapper id="personal-fun" title="Personal / Fun">
          <ComingSoon
            title="Personal / Fun"
            message="Hobbies, side projects, and things I do for fun -- coming soon."
          />
        </SectionWrapper>

        <SectionWrapper id="contact" title="Contact">
          <Contact />
        </SectionWrapper>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
