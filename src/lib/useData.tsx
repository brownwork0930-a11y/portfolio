import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { getDictionary } from "@/app/i18n/dictionaries";

import image_lotusrmp from "/public/images/lotusrmp.png"
import image_lotusrmp2 from "/public/images/lotusrmp2.png"
import image_lotusrmp3 from "/public/images/lotusrmp3.png"
import image_lotusrmp4 from "/public/images/lotusrmp4.png"

import image_fqc_admin from "/public/images/fqc_admin.png"
import image_fqc_admin2 from "/public/images/fqc_admin2.png"
import image_fqc_admin3 from "/public/images/fqc_admin3.png"

import image_fqc_app from "/public/images/fqc_app.png"
import image_fqc_app2 from "/public/images/fqc_app2.png"
import image_fqc_app3 from "/public/images/fqc_app3.png"

// import rpgaming_mobile from "/public/images/rpgaming_mobile.png"
import rpgaming_pc from "/public/images/rpgaming_pc.png"
import rpgaming_pc2 from "/public/images/rpgaming_pc2.png"
import rpgaming_pc3 from "/public/images/rpgaming_pc3.png"
import rpgaming_pc4 from "/public/images/rpgaming_pc4.png"

import cgc from "/public/images/cgc.png"
import cgc2 from "/public/images/cgc2.png"
import cgc3 from "/public/images/cgc3.png"
import cgc4 from "/public/images/cgc4.png"
import cgc_landing from "/public/images/cgc_landing.png"

import { FaBook, FaBriefcase, FaGraduationCap, FaProjectDiagram, FaUser } from "react-icons/fa";

const useData = async (lang: string) => {
  const t = await getDictionary(lang)

  const links = [
    // {
    //   name: t.header.home,
    //   hash: "#home",
    //   key: 'Home',
    //   icon: <FaHome />
    // },
    {
      name: t.header.about,
      hash: "#about",
      key: 'About',
      icon: <FaUser />
    },
    {
      name: t.header.skills,
      hash: "#skills",
      key: 'Skills',
      icon: <FaBook />
    },
    {
      name: t.header.projects,
      hash: "#projects",
      key: 'Projects',
      icon: <FaProjectDiagram />
    },
    {
      name: t.header.experience,
      hash: "#experience",
      key: 'Experience',
      icon: <FaBriefcase />
    },
  ]

  const experiencesData = [
    {
      title: t.experience.first.title,
      role: t.experience.first.role,
      location: t.experience.first.location,
      description: t.experience.first.description,
      icon: React.createElement(CgWorkAlt),
      date: t.experience.first.date,
    },
    {
      title: t.experience.second.title,
      role: t.experience.second.role,
      location: t.experience.second.location,
      description: t.experience.second.description,
      icon: React.createElement(CgWorkAlt),
      date: t.experience.second.date,
    },
    {
      title: t.experience.third.title,
      role: t.experience.third.role,
      location: t.experience.third.location,
      description: t.experience.third.description,
      icon: React.createElement(CgWorkAlt),
      date: t.experience.third.date,
    },
    {
      title: t.experience.fourth.title,
      role: t.experience.fourth.role,
      location: t.experience.fourth.location,
      description: t.experience.fourth.description,
      icon: React.createElement(CgWorkAlt),
      date: t.experience.fourth.date,
    },
    {
      title: t.experience.fifth.title,
      role: t.experience.fifth.role,
      location: t.experience.fifth.location,
      description: t.experience.fifth.description,
      icon: React.createElement(CgWorkAlt),
      date: t.experience.fifth.date,
    },
    {
      title: t.experience.sixth.title,
      role: t.experience.sixth.role,
      location: t.experience.sixth.location,
      description: t.experience.sixth.description,
      icon: React.createElement(FaGraduationCap),
      date: t.experience.sixth.date,
    },
  ]

  const projectsData = [
    {
      title: t.projects.rpgaming_pc.title,
      brand: t.projects.rpgaming_pc.brand,
      description: t.projects.rpgaming_pc.description,
      tags: ["Next.js", "TypeScript", "TailwindCSS"],
      imageUrls: [rpgaming_pc, rpgaming_pc2, rpgaming_pc3, rpgaming_pc4],
    },
    {
      title: t.projects.cgc.title,
      brand: t.projects.cgc.brand,
      description: t.projects.cgc.description,
      tags: ["React", "NextJS", "Tailwind"],
      imageUrls: [cgc, cgc_landing, cgc2, cgc3, cgc4],
    },
    {
      title: t.projects.lotusrmp.title,
      brand: t.projects.lotusrmp.brand,
      description: t.projects.lotusrmp.description,
      tags: ["VueJS", "Typescript", "Tailwind", "Antd Design"],
      imageUrls: [image_lotusrmp, image_lotusrmp2, image_lotusrmp3, image_lotusrmp4],
    },
    {
      title: t.projects.fqc.title,
      brand: t.projects.fqc.brand,
      description: t.projects.fqc.description,
      tags: ["React", "TypeScript", "NextJS", "Bootstrap4", "Redux", ".NET", "MS SQL", "React Native", "Native Base"],
      imageUrls: [image_fqc_admin, image_fqc_admin2, image_fqc_admin3, image_fqc_app, image_fqc_app2, image_fqc_app3],
    },
  ]

  const skillsData = [
    { category: "Frontend Core", skills: ["React", "Next.js", "TypeScript", "JavaScript", "Vue", "Nuxt.js", "Zustand", "Redux", "React Native"] },
    { category: "UI & Performance", skills: ["HTML5", "CSS3", "TailwindCSS", "SCSS", "Responsive Web Design", "Core Web Vitals"] },
    { category: "Testing & Tooling", skills: ["Jest", "Cypress", "Git", "Docker", "CI/CD", "Vercel"] },
    { category: "Backend & Infra", skills: ["Node.js", "NestJS", "GraphQL", "RESTful APIs", "PostgreSQL", "MySQL", "Redis", "AWS"] },
  ]

  const softSkillsData = [
    t.soft_skills.technical_leadership,
    t.soft_skills.project_management,
    t.soft_skills.cross_functional_communication,
  ]

  return {
    links,
    experiencesData,
    projectsData,
    skillsData,
    softSkillsData,
  }
}

export default useData
