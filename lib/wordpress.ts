// WordPress API configuration and helper functions
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "https://your-wordpress-site.com/wp-json/wp/v2"

export interface WordPressPost {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  slug: string
  date: string
  featured_media: number
  categories: number[]
  tags: number[]
  acf?: any // Advanced Custom Fields
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
      }>
    >
  }
}

export interface WordPressPage {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  slug: string
  acf?: any
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

export interface Program {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  slug: string
  acf: {
    duration: string
    credential: string
    category: string
    campus: string[]
    featured: boolean
    program_image: {
      url: string
      alt: string
    }
    description: string
    requirements: string[]
    career_outcomes: string[]
  }
}

export interface Testimonial {
  id: number
  title: { rendered: string }
  acf: {
    student_name: string
    program: string
    quote: string
    rating: number
    student_photo: {
      url: string
      alt: string
    }
  }
}

export interface Campus {
  id: number
  title: { rendered: string }
  acf: {
    address: string
    phone: string
    email: string
    city: string
    student_count: string
    program_count: string
  }
}

// Generic fetch function with error handling
async function fetchFromWP(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${WP_API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      console.warn(`WordPress API error: ${response.status} for ${endpoint}`)
      return null
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`WordPress API returned non-JSON response for ${endpoint}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.warn("WordPress API fetch error:", error)
    return null
  }
}

// Fetch all programs
export async function getPrograms(): Promise<Program[]> {
  try {
    const data = await fetchFromWP("/programs?_embed&per_page=100")
    return data || []
  } catch (error) {
    console.warn("Error fetching programs:", error)
    return []
  }
}

// Fetch single program by slug
export async function getProgram(slug: string): Promise<Program | null> {
  try {
    const programs = await fetchFromWP(`/programs?slug=${slug}&_embed`)
    return programs[0] || null
  } catch (error) {
    console.error("Error fetching program:", error)
    return null
  }
}

// Fetch featured programs
export async function getFeaturedPrograms(): Promise<Program[]> {
  try {
    const programs = await getPrograms()
    const featured = programs.filter((program) => program.acf?.featured === true)

    // If no featured programs from WordPress, return mock data
    if (featured.length === 0) {
      return getMockFeaturedPrograms()
    }

    return featured.slice(0, 3)
  } catch (error) {
    console.warn("Error fetching featured programs:", error)
    return getMockFeaturedPrograms()
  }
}

// Fetch testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await fetchFromWP("/testimonials?_embed&per_page=10")
    return data || getMockTestimonials()
  } catch (error) {
    console.warn("Error fetching testimonials:", error)
    return getMockTestimonials()
  }
}

// Fetch news/events posts
export async function getPosts(category?: string, limit = 10): Promise<WordPressPost[]> {
  try {
    let endpoint = `/posts?_embed&per_page=${limit}`
    if (category) {
      endpoint += `&categories=${category}`
    }
    const data = await fetchFromWP(endpoint)
    return data || getMockPosts()
  } catch (error) {
    console.warn("Error fetching posts:", error)
    return getMockPosts()
  }
}

// Fetch campus locations
export async function getCampuses(): Promise<Campus[]> {
  try {
    const data = await fetchFromWP("/campuses?_embed&per_page=100")
    return data || getMockCampuses()
  } catch (error) {
    console.warn("Error fetching campuses:", error)
    return getMockCampuses()
  }
}

// Fetch page content by slug
export async function getPage(slug: string): Promise<WordPressPage | null> {
  try {
    const pages = await fetchFromWP(`/pages?slug=${slug}&_embed`)
    return pages[0] || null
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

// Fetch site options/settings
export async function getSiteOptions() {
  try {
    return await fetchFromWP("/site-options")
  } catch (error) {
    console.error("Error fetching site options:", error)
    return {}
  }
}

// Submit contact form to WordPress
export async function submitContactForm(formData: {
  name: string
  email: string
  phone: string
  campus: string
  program?: string
  message: string
}) {
  try {
    return await fetchFromWP("/contact-form", {
      method: "POST",
      body: JSON.stringify(formData),
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    throw error
  }
}

// Search functionality
export async function searchContent(query: string, type: "programs" | "posts" | "all" = "all") {
  try {
    let endpoint = `/search?search=${encodeURIComponent(query)}`
    if (type !== "all") {
      endpoint += `&type=${type}`
    }
    return await fetchFromWP(endpoint)
  } catch (error) {
    console.error("Error searching content:", error)
    return []
  }
}

// Helper function to extract featured image URL
export function getFeaturedImageUrl(
  item: WordPressPost | WordPressPage | Program,
  fallback = "/placeholder.svg?height=300&width=400",
): string {
  if (item._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    return item._embedded["wp:featuredmedia"][0].source_url
  }
  if ("acf" in item && item.acf?.program_image?.url) {
    return item.acf.program_image.url
  }
  return fallback
}

// Helper function to strip HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Add mock data functions for fallbacks
function getMockFeaturedPrograms(): Program[] {
  return [
    {
      id: 1,
      title: { rendered: "Automotive Technology" },
      content: { rendered: "Comprehensive training in automotive repair, diagnostics, and maintenance." },
      slug: "automotive-technology",
      acf: {
        duration: "18 months",
        credential: "Associate Degree",
        category: "automotive",
        campus: ["waco", "austin"],
        featured: true,
        program_image: {
          url: "/placeholder.svg?height=300&width=400",
          alt: "Automotive Technology Program",
        },
        description: "Master the latest automotive repair and diagnostic techniques.",
        requirements: [],
        career_outcomes: [],
      },
    },
    {
      id: 2,
      title: { rendered: "Healthcare Technology" },
      content: { rendered: "Train for essential roles in the growing healthcare industry." },
      slug: "healthcare-technology",
      acf: {
        duration: "12 months",
        credential: "Certificate",
        category: "healthcare",
        campus: ["houston", "dallas"],
        featured: true,
        program_image: {
          url: "/placeholder.svg?height=300&width=400",
          alt: "Healthcare Technology Program",
        },
        description: "Train for essential roles in the growing healthcare industry.",
        requirements: [],
        career_outcomes: [],
      },
    },
    {
      id: 3,
      title: { rendered: "Information Technology" },
      content: { rendered: "Build skills in cybersecurity, networking, and system administration." },
      slug: "information-technology",
      acf: {
        duration: "24 months",
        credential: "Associate Degree",
        category: "technology",
        campus: ["waco", "houston"],
        featured: true,
        program_image: {
          url: "/placeholder.svg?height=300&width=400",
          alt: "Information Technology Program",
        },
        description: "Build skills in cybersecurity, networking, and system administration.",
        requirements: [],
        career_outcomes: [],
      },
    },
  ]
}

function getMockTestimonials(): Testimonial[] {
  return [
    {
      id: 1,
      title: { rendered: "Sarah Johnson Testimonial" },
      acf: {
        student_name: "Sarah Johnson",
        program: "Healthcare Technology",
        quote: "The hands-on training prepared me perfectly for my role as a medical technician.",
        rating: 5,
        student_photo: {
          url: "/placeholder.svg?height=100&width=100",
          alt: "Sarah Johnson",
        },
      },
    },
    {
      id: 2,
      title: { rendered: "Mike Rodriguez Testimonial" },
      acf: {
        student_name: "Mike Rodriguez",
        program: "Automotive Technology",
        quote: "I landed my dream job at a top automotive shop right after graduation.",
        rating: 5,
        student_photo: {
          url: "/placeholder.svg?height=100&width=100",
          alt: "Mike Rodriguez",
        },
      },
    },
    {
      id: 3,
      title: { rendered: "Emily Chen Testimonial" },
      acf: {
        student_name: "Emily Chen",
        program: "Information Technology",
        quote: "The cybersecurity program gave me the skills to start my own consulting business.",
        rating: 5,
        student_photo: {
          url: "/placeholder.svg?height=100&width=100",
          alt: "Emily Chen",
        },
      },
    },
  ]
}

function getMockPosts(): WordPressPost[] {
  return [
    {
      id: 1,
      title: { rendered: "Fall Semester Registration Open" },
      content: { rendered: "Register now for fall semester classes. Early registration ends April 30th." },
      excerpt: { rendered: "Register now for fall semester classes. Early registration ends April 30th." },
      slug: "fall-registration-open",
      date: "2024-03-15T00:00:00",
      featured_media: 0,
      categories: [],
      tags: [],
    },
    {
      id: 2,
      title: { rendered: "Career Fair 2024" },
      content: { rendered: "Meet with top employers looking to hire our graduates. All students welcome." },
      excerpt: { rendered: "Meet with top employers looking to hire our graduates. All students welcome." },
      slug: "career-fair-2024",
      date: "2024-04-20T00:00:00",
      featured_media: 0,
      categories: [],
      tags: [],
    },
    {
      id: 3,
      title: { rendered: "New Cybersecurity Lab Opens" },
      content: { rendered: "State-of-the-art cybersecurity lab now available for IT students." },
      excerpt: { rendered: "State-of-the-art cybersecurity lab now available for IT students." },
      slug: "new-cybersecurity-lab",
      date: "2024-03-10T00:00:00",
      featured_media: 0,
      categories: [],
      tags: [],
    },
  ]
}

function getMockCampuses(): Campus[] {
  return [
    {
      id: 1,
      title: { rendered: "Waco Campus" },
      acf: {
        address: "3801 Campus Dr, Waco, TX 76705",
        phone: "(254) 867-4890",
        email: "waco@texastech.edu",
        city: "Waco",
        student_count: "2,500+",
        program_count: "15+",
      },
    },
    {
      id: 2,
      title: { rendered: "Austin Campus" },
      acf: {
        address: "1555 E Parmer Ln, Austin, TX 78754",
        phone: "(512) 223-4000",
        email: "austin@texastech.edu",
        city: "Austin",
        student_count: "1,800+",
        program_count: "12+",
      },
    },
    {
      id: 3,
      title: { rendered: "Houston Campus" },
      acf: {
        address: "2222 Bay Area Blvd, Houston, TX 77058",
        phone: "(281) 998-6150",
        email: "houston@texastech.edu",
        city: "Houston",
        student_count: "3,200+",
        program_count: "18+",
      },
    },
    {
      id: 4,
      title: { rendered: "Dallas Campus" },
      acf: {
        address: "9700 Wade Blvd, Frisco, TX 75035",
        phone: "(469) 201-8400",
        email: "dallas@texastech.edu",
        city: "Dallas",
        student_count: "2,100+",
        program_count: "14+",
      },
    },
  ]
}
