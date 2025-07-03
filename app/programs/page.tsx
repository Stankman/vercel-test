"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Clock, Award, MapPin } from "lucide-react"
import { getPrograms, getCampuses, getFeaturedImageUrl, stripHtml, type Program, type Campus } from "@/lib/wordpress"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCampus, setSelectedCampus] = useState("all")
  const [selectedCredential, setSelectedCredential] = useState("all")

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const [programsData, campusesData] = await Promise.allSettled([getPrograms(), getCampuses()])

        // Handle programs data
        if (programsData.status === "fulfilled") {
          setPrograms(programsData.value || [])
        } else {
          console.warn("Failed to fetch programs:", programsData.reason)
        }

        // Handle campuses data
        if (campusesData.status === "fulfilled") {
          setCampuses(campusesData.value || [])
        } else {
          console.warn("Failed to fetch campuses:", campusesData.reason)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Unable to load programs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get unique categories from programs
  const categories = useMemo(() => {
    const cats = programs.map((program) => program.acf?.category).filter(Boolean)
    return [...new Set(cats)]
  }, [programs])

  // Get unique credentials from programs
  const credentials = useMemo(() => {
    const creds = programs.map((program) => program.acf?.credential).filter(Boolean)
    return [...new Set(creds)]
  }, [programs])

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.acf?.description && program.acf.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        stripHtml(program.content.rendered).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || program.acf?.category === selectedCategory
      const matchesCampus = selectedCampus === "all" || program.acf?.campus?.includes(selectedCampus)
      const matchesCredential = selectedCredential === "all" || program.acf?.credential === selectedCredential

      return matchesSearch && matchesCategory && matchesCampus && matchesCredential
    })
  }, [programs, searchTerm, selectedCategory, selectedCampus, selectedCredential])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Programs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore our comprehensive range of technical programs designed to prepare you for high-demand careers.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Campuses</option>
                {campuses.map((campus) => (
                  <option key={campus.id} value={campus.acf?.city?.toLowerCase()}>
                    {campus.title.rendered}
                  </option>
                ))}
              </select>

              <select
                value={selectedCredential}
                onChange={(e) => setSelectedCredential(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Credentials</option>
                {credentials.map((credential) => (
                  <option key={credential} value={credential}>
                    {credential}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPrograms.length} of {programs.length} programs
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {program.acf?.featured && (
                  <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 absolute z-10 m-4 rounded">
                    Featured
                  </div>
                )}
                <Image
                  src={getFeaturedImageUrl(program) || "/placeholder.svg"}
                  alt={program.acf?.program_image?.alt || program.title.rendered}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{program.title.rendered}</h3>
                  <p className="text-gray-600 mb-4">
                    {program.acf?.description || stripHtml(program.content.rendered).substring(0, 150) + "..."}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{program.acf?.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="w-4 h-4 mr-2" />
                      <span>{program.acf?.credential}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="capitalize">{program.acf?.campus?.join(", ")}</span>
                    </div>
                  </div>

                  <Link href={`/programs/${program.slug}`} className="btn-secondary w-full text-center">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredPrograms.length === 0 && programs.length > 0 && (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No programs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          )}

          {programs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Programs Coming Soon</h3>
              <p className="text-gray-500">
                We're working on loading our program information. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
