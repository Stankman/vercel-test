import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Calendar, Users, Award, Briefcase } from "lucide-react"
import {
  getFeaturedPrograms,
  getTestimonials,
  getPosts,
  getCampuses,
  getFeaturedImageUrl,
  stripHtml,
  formatDate,
} from "@/lib/wordpress"

export default async function HomePage() {
  // Fetch data from WordPress with fallbacks
  const [featuredPrograms, testimonials, posts, campuses] = await Promise.allSettled([
    getFeaturedPrograms(),
    getTestimonials(),
    getPosts("news", 3),
    getCampuses(),
  ])

  // Extract data from settled promises with fallbacks
  const programs = featuredPrograms.status === "fulfilled" ? featuredPrograms.value : []
  const studentTestimonials = testimonials.status === "fulfilled" ? testimonials.value : []
  const newsPosts = posts.status === "fulfilled" ? posts.value : []
  const campusLocations = campuses.status === "fulfilled" ? campuses.value : []

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/60 z-10"></div>
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Student working on automotive repair"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Step into a high-demand career.</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Get hands-on training in growing industries with our industry-leading technical programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admissions/apply" className="btn-primary text-lg px-8 py-4">
              Apply Now
            </Link>
            <Link
              href="/programs"
              className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-700 text-lg px-8 py-4"
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular programs designed to prepare you for high-demand careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.length > 0 ? (
              programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
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
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-blue-600 font-medium">{program.acf?.duration}</span>
                      <span className="text-sm text-green-600 font-medium">{program.acf?.credential}</span>
                    </div>
                    <Link href={`/programs/${program.slug}`} className="btn-secondary w-full text-center">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading programs...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our graduates who are thriving in their careers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentTestimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.acf?.student_photo?.url || "/placeholder.svg?height=100&width=100"}
                    alt={testimonial.acf?.student_photo?.alt || testimonial.acf?.student_name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.acf?.student_name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.acf?.program}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.acf?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.acf?.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">News & Events</h2>
            <p className="text-xl text-gray-600">Stay updated with the latest happenings on campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">{formatDate(post.date)}</span>
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">News</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{post.title.rendered}</h3>
                <p className="text-gray-600">{stripHtml(post.excerpt.rendered)}</p>
                <Link
                  href={`/news/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Campus Locations</h2>
            <p className="text-xl text-gray-600">Find a campus near you across Texas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campusLocations.map((campus) => (
              <div key={campus.id} className="text-center p-6 bg-gray-50 rounded-lg">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">{campus.title.rendered}</h3>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center justify-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{campus.acf?.student_count} Students</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span className="text-sm">{campus.acf?.program_count} Programs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Career?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students who have launched successful careers through our programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admissions/apply" className="btn-primary bg-red-600 hover:bg-red-700">
              Apply Today
            </Link>
            <Link
              href="/contact"
              className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-700"
            >
              Schedule a Visit
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
