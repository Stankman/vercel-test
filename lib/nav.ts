export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export const navigationConfig: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about/story" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Accreditation", href: "/about/accreditation" },
      { label: "Campus Locations", href: "/about/locations" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "All Programs", href: "/programs" },
      { label: "Automotive", href: "/programs?category=automotive" },
      { label: "Healthcare", href: "/programs?category=healthcare" },
      { label: "Technology", href: "/programs?category=technology" },
      { label: "Skilled Trades", href: "/programs?category=trades" },
    ],
  },
  {
    label: "Admissions",
    href: "/admissions",
    children: [
      { label: "Apply Now", href: "/admissions/apply" },
      { label: "Requirements", href: "/admissions/requirements" },
      { label: "Financial Aid", href: "/admissions/financial-aid" },
      { label: "Visit Campus", href: "/admissions/visit" },
    ],
  },
  {
    label: "Student Life",
    href: "/student-life",
    children: [
      { label: "Campus Life", href: "/student-life" },
      { label: "Student Services", href: "/student-life/services" },
      { label: "Housing", href: "/student-life/housing" },
      { label: "Activities", href: "/student-life/activities" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
]
