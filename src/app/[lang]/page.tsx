import { getDictionary } from '@/app/i18n/dictionaries'
import Intro from "@/components/Home/Intro";
import SectionDivider from "@/components/common/SectionDivider";
import Projects from "@/components/Home/Projects";
import About from "@/components/Home/About";
import Skills from "@/components/Home/Skills";
import useData from "@/lib/useData";
import Experience from '@/components/Home/Experience';
import SoftSkills from '@/components/Home/SoftSkills';
import BackToTop from '@/components/Home/BackToTop';

export default async function Home({ params }: any) {
  const { lang } = params
  
  const t = await getDictionary(lang)
  const { projectsData, skillsData, experiencesData, softSkillsData } = await useData(lang)  

  return (
    <main className="flex flex-col items-center px-4">
      <Intro t={t} lang={lang} />
      <SectionDivider />
      <About t={t} />
      <SectionDivider />
      <div className='sm:mb-40 mb-28'></div>
      <Skills t={t} data={skillsData} />
      <SoftSkills t={t} data={softSkillsData} />
      <Projects t={t} data={projectsData} />
      <Experience t={t} data={experiencesData} />
      <BackToTop t={t} />
    </main>
  );
}
