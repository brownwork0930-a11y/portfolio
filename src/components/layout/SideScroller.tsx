"use client"

import { useActiveSectionContext } from "@/context/active-section-context"
import { useTheme } from "@/context/theme-context"
import { LinkData } from "@/lib/types"
import clsx from "clsx"
import { useMemo } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

const SideScroller = ({ data }: { data: LinkData[] }) => {
  const { theme } = useTheme()
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSectionContext()

  const handleLinkClick = (link: LinkData) => {
    setActiveSection(link.key)
    setTimeOfLastClick(Date.now())
    const dom = document.querySelector(link.hash)
    dom?.scrollIntoView({ behavior: 'smooth' })
  }

  const showArrowUp = useMemo(() => {
    if (data.length > 0) {
      return activeSection !== data[0].key
    }
    return false
  }, [activeSection, data])

  const showArrowDown = useMemo(() => {
    if (data.length > 0) {
      return activeSection !== data[data.length - 1].key
    }
    return false
  }, [activeSection, data])

  const handleArrowUpClick = () => {
    const currIndex = data.findIndex((link) => link.key === activeSection)
    if (currIndex > -1 && showArrowUp) {
      handleLinkClick(data[currIndex - 1])
    }
  }

  const handleArrowDownClick = () => {
    const currIndex = data.findIndex((link) => link.key === activeSection)
    if (currIndex > -1 && showArrowDown) {
      handleLinkClick(data[currIndex + 1])
    }
  }

  return (
    <div className="hidden lg:flex fixed right-[1rem] top-[50%] translate-y-[-50%] flex-col gap-2 justify-center items-center">
      <div
        className={clsx(showArrowUp ? "cursor-pointer" : "pointer-events-none text-gray-600")}
        onClick={handleArrowUpClick}
      >
        <FaArrowUp />
      </div>
      {data.map((link, index) => {
        return (
          <div key={index} className="cursor-pointer" onClick={() => handleLinkClick(link)}>
            <span className={clsx(
              "text-[24px]",
              activeSection === link.key ? theme === 'light' ? 'text-[rgb(105,85,62)]' : 'text-gray-500' : ''
            )}>
              {link.icon}
            </span>
          </div>
        )
      })}
      <div
        className={clsx(showArrowDown ? "cursor-pointer" : "pointer-events-none text-gray-600")}
        onClick={handleArrowDownClick}
      >
        <FaArrowDown />
      </div>
    </div>
  )
}

export default SideScroller
