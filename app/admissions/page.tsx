"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Clock, FileText, Users, ChevronDown, ChevronUp } from "lucide-react"
import { getPage } from "@/lib/wordpress"

export default function AdmissionsPage() {
  const [pageContent, setPageContent] = useState<any>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Default FAQs if not available from WordPress
  const defaultFaqs = [
    {
      question: "What are the admission requirements?",
      answer:
        "Basic requirements include a high school diploma or GED, completed application, and program-specific prerequisites. Some programs may require additional testing or interviews.",
    },
    {
      question: "When can I start classes?",
      answer:
        "We offer multiple start dates throughout the year, typically at the beginning of each semester (Fall, Spring, Summer). Check with your program advisor for specific dates.",
    },
    {
      question: "How do I apply for financial aid?",
      answer:
        "Complete the FAFSA (Free Application for Federal Student Aid) online. Our financial aid office can help you explore grants, loans, scholarships, and work-study opportunities.",
    },
    {
      question: "Can I transfer credits from another school?",
      answer:
        "Yes, we accept transfer credits from accredited institutions. Our admissions team will evaluate your transcripts and determine which credits can be applied to your program.",
    },
    {
      question: "Do you offer online programs?",
      answer:
        "We offer hybrid programs that combine online coursework with hands-on lab experiences. Some theoretical courses are available fully online, but practical training requires on-campus attendance.",
    },
  ]

  useEffect(() => {
    async function fetchPageContent() {
      try {
        const page = await getPage("admissions")
        setPageContent(page)
      } catch (error) {
        console.error("Error fetching admissions page:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPageContent()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Use WordPress FAQs if available, otherwise use defaults
  const faqs = pageContent?.acf?.faqs || defaultFaqs

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admissions information...</p>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {pageContent?.acf?.hero_description ||
                "Start your journey to a rewarding career. We're here to guide you through every step of the admission process."}
            </p>
          </div>
        </div>
      </section>

      {/* Admission Process Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Admission Process</h2>
            <p className="text-xl text-gray-600">Follow these simple steps to begin your education journey</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200 hidden md:block"></div>

            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: "Submit Application",
                  description: "Complete our online application form with your personal and educational information.",
                  timeframe: "15 minutes",
                  icon: <FileText className="w-6 h-6" />,
                },
                {
                  step: 2,
                  title: "Document Submission",
                  description: "Provide required documents including transcripts, ID, and program-specific materials.",
                  timeframe: "1-2 weeks",
                  icon: <CheckCircle className="w-6 h-6" />,
                },
                {
                  step: 3,
                  title: "Application Review",
                  description: "Our admissions team reviews your application and documents for completeness.",
                  timeframe: "3-5 business days",
                  icon: <Users className="w-6 h-6" />,
                },
                {
                  step: 4,
                  title: "Acceptance & Enrollment",
                  description: "Receive your acceptance letter and complete enrollment for your chosen program.",
                  timeframe: "1-2 weeks",
                  icon: <Clock className="w-6 h-6" />,
                },
              ].map((item, index) => (
                <div key={index} className="relative flex items-center">
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10 hidden md:flex">
                    {item.step}
                  </div>

                  {/* Content */}
                  <div
                    className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"}`}
                  >
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className={`flex items-center mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <div className="bg-blue-600 text-white p-2 rounded-lg mr-3 md:hidden">{item.icon}</div>
                        <div className={`hidden md:block ${index % 2 === 0 ? "order-2 ml-3" : "mr-3"}`}>
                          <div className="bg-blue-600 text-white p-2 rounded-lg">{item.icon}</div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <span className="text-sm text-blue-600 font-medium">{item.timeframe}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Checklist */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Requirements</h2>
            <p className="text-xl text-gray-600">Make sure you have all required documents before applying</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Required Documents</h3>
                <ul className="space-y-3">
                  {[
                    "Completed application form",
                    "High school diploma or GED certificate",
                    "Official transcripts from all schools attended",
                    "Government-issued photo ID",
                    "Immunization records (health programs)",
                    "Background check (certain programs)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Additional Requirements</h3>
                <ul className="space-y-3">
                  {[
                    "TEAS test scores (nursing programs)",
                    "Drug screening (healthcare programs)",
                    "Physical examination (hands-on programs)",
                    "Letters of recommendation (select programs)",
                    "Portfolio or work samples (design programs)",
                    "Interview (competitive programs)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/admissions/apply" className="btn-primary">
                Start Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common admission questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Take the first step toward your new career. Our admissions team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admissions/apply" className="btn-primary bg-red-600 hover:bg-red-700">
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-700"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
