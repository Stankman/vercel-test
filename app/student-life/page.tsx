import Image from "next/image"
import Link from "next/link"
import { Users, Home, Calendar, Heart, BookOpen, Trophy } from "lucide-react"
import { getCampuses, getPosts, getFeaturedImageUrl, stripHtml } from "@/lib/wordpress"

export default async function StudentLifePage() {
  // Fetch student life related content from WordPress
  const [campuses, studentLifePosts] = await Promise.all([
    getCampuses(),
    getPosts("student-life", 6), // Assuming 'student-life' category for student activities
  ])

  // Calculate total students across all campuses
  const totalStudents = campuses.reduce((total, campus) => {
    const count = Number.parseInt(campus.acf?.student_count?.replace(/[^\d]/g, "") || "0")
    return total + count
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Life</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience a vibrant campus community with opportunities to learn, grow, and connect with fellow students.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-center">
              <div className="text-blue-600 mb-2 flex justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{totalStudents.toLocaleString()}+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 mb-2 flex justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-gray-600">Student Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 mb-2 flex justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">200+</div>
              <div className="text-gray-600">Annual Events</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 mb-2 flex justify-center">
                <Home className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{campuses.length}</div>
              <div className="text-gray-600">Campus Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Activities from WordPress */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Campus Life & Activities</h2>
            <p className="text-xl text-gray-600">
              Discover the many ways to get involved and make the most of your college experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentLifePosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Image
                  src={getFeaturedImageUrl(post) || "/placeholder.svg"}
                  alt={post.title.rendered}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{post.title.rendered}</h3>
                  <p className="text-gray-600 mb-4">{stripHtml(post.excerpt.rendered)}</p>
                  <Link href={`/student-life/${post.slug}`} className="btn-secondary w-full text-center">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Activities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Campus Activities</h2>
            <p className="text-xl text-gray-600">Engage in activities that enhance your college experience</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Students participating in campus activities"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              {[
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "Annual Events",
                  description: "Homecoming, career fairs, graduation ceremonies, and seasonal celebrations.",
                },
                {
                  icon: <Trophy className="w-6 h-6" />,
                  title: "Competitions",
                  description: "Skills competitions, academic contests, and inter-campus tournaments.",
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Community Service",
                  description: "Volunteer opportunities to give back to the local community.",
                },
                {
                  icon: <BookOpen className="w-6 h-6" />,
                  title: "Workshops & Seminars",
                  description: "Professional development sessions and guest speaker events.",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg flex-shrink-0">{activity.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{activity.title}</h3>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Support Services</h2>
            <p className="text-xl text-gray-600">We're committed to your success both in and out of the classroom</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Academic Advising",
                description: "Get guidance on course selection, degree planning, and academic goals.",
                icon: <BookOpen className="w-8 h-8" />,
              },
              {
                title: "Career Services",
                description: "Job placement assistance, resume building, and interview preparation.",
                icon: <Users className="w-8 h-8" />,
              },
              {
                title: "Counseling Services",
                description: "Mental health support and personal counseling for student wellbeing.",
                icon: <Heart className="w-8 h-8" />,
              },
              {
                title: "Financial Aid",
                description: "Assistance with scholarships, grants, loans, and payment plans.",
                icon: <Home className="w-8 h-8" />,
              },
            ].map((service, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-blue-600 mb-4 flex justify-center">{service.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Campus Community</h2>
          <p className="text-xl mb-8 text-blue-100">
            Discover all the opportunities waiting for you at Texas Technical College.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admissions/visit" className="btn-primary bg-red-600 hover:bg-red-700">
              Schedule a Campus Visit
            </Link>
            <Link
              href="/contact"
              className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-700"
            >
              Contact Student Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
