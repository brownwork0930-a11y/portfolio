import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Project from "./Project";
import { ProjectData } from "@/lib/types";
import ProjectsModal from "./ProjectsModal";
import SectionWrapper from "@/components/common/SectionWrapper";

export default function Projects({ t, data }: { t: any; data: ProjectData[] }) {
  return (
    <SectionWrapper id="projects" sectionKey="Projects" className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading>{t.projects.title}</SectionHeading>
      <div>
        {data.map((project: ProjectData, index: number) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
      <ProjectsModal />
    </SectionWrapper>
  );
}
