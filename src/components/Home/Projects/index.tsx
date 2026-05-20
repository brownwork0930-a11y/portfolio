import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Project from "./Project";
import { ProjectData } from "@/lib/types";
import ProjectsModal from "./ProjectsModal";
import SectionTracker from "@/components/common/SectionTracker";

export default function Projects({ t, data }: { t: any; data: ProjectData[] }) {
  return (
    <section id="projects" className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionTracker sectionKey="Projects" />
      <SectionHeading>{t.projects.title}</SectionHeading>
      <div>
        {data.map((project: ProjectData, index: number) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
      <ProjectsModal />
    </section>
  );
}
