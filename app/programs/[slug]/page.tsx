import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, Award, MapPin, Users, CheckCircle, ArrowLeft } from "lucide-react"
import { getProgram, getFeaturedImageUrl, stripHtml } from "@/lib/wordpress"

interface ProgramPageProps {
  params: {
    slug: string
  }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const program = await getProgram(params.slug)

  if (!program) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/programs"
            className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{program.title.rendered}</h1>
              <p className="text-xl text-blue-100 mb-6">
                {program.acf?.description || stripHtml(program.content.rendered).substring(0, 200) + "..."}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-blue-600 rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{program.acf?.duration}</span>
                </div>
                <div className="flex items-center bg-blue-600 rounded-lg px-4 py-2">
                  <Award className="w-5 h-5 mr-2" />
                  <span>{program.acf?.credential}</span>
                </div>
                <div className="flex items-center bg-blue-600 rounded-lg px-4 py-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{program.acf?.campus?.join(", ")}</span>
                </div>
              </div>
            </div>
            <div>
              <Image
                src={getFeaturedImageUrl(program) || "/placeholder.svg"}
                alt={program.acf?.program_image?.alt || program.title.rendered}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Overview</h2>
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: program.content.rendered }}
                />
              </div>

              {/* Requirements */}
              {program.acf?.requirements && program.acf.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Admission Requirements</h2>
                  <ul className="space-y-3">
                    {program.acf.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Career Outcomes */}
              {program.acf?.career_outcomes && program.acf.career_outcomes.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Opportunities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.acf.career_outcomes.map((career: string, index: number) => (
                      <div key={index} className="flex items-center bg-gray-50 rounded-lg p-4">
                        <Users className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <p className="text-gray-900">{program.acf?.duration}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Credential</span>
                    <p className="text-gray-900">{program.acf?.credential}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-gray-900">{program.acf?.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Available Campuses</span>
                    <p className="text-gray-900">{program.acf?.campus?.join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Take the first step toward your new career in {program.title.rendered.toLowerCase()}.
                </p>
                <div className="space-y-3">
                  <Link href="/admissions/apply" className="btn-primary w-full text-center">
                    Apply Now
                  </Link>
                  <Link href="/contact" className="btn-outline w-full text-center">
                    Request Information
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need More Information?</h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Speak with one of our program advisors to learn more about this program.
                  </p>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Call us:</p>
                    <p>(254) 867-4890</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Email us:</p>
                    <p>admissions@texastech.edu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProgramPageProps) {
  const program = await getProgram(params.slug)

  if (!program) {
    return {
      title: "Program Not Found",
    }
  }

  return {
    title: `${program.title.rendered} - Texas Technical College`,
    description: program.acf?.description || stripHtml(program.content.rendered).substring(0, 160),
    keywords: `${program.title.rendered}, ${program.acf?.category}, ${program.acf?.credential}, technical education, career training`,
  }
}
