# TSTC-Inspired Website with WordPress Backend

A modern, responsive Next.js website that fetches all content from a WordPress backend via REST API.

## Features

- **Headless WordPress Integration**: All content managed through WordPress CMS
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Dynamic meta tags and semantic HTML
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized images and lazy loading

## WordPress Setup Requirements

### Custom Post Types Required

1. **Programs** (`programs`)
   - Title, Content, Featured Image
   - ACF Fields:
     - `duration` (text)
     - `credential` (text) 
     - `category` (text)
     - `campus` (repeater/array)
     - `featured` (true/false)
     - `program_image` (image)
     - `description` (textarea)
     - `requirements` (repeater)
     - `career_outcomes` (repeater)

2. **Testimonials** (`testimonials`)
   - ACF Fields:
     - `student_name` (text)
     - `program` (text)
     - `quote` (textarea)
     - `rating` (number)
     - `student_photo` (image)

3. **Campuses** (`campuses`)
   - Title
   - ACF Fields:
     - `address` (text)
     - `phone` (text)
     - `email` (email)
     - `city` (text)
     - `student_count` (text)
     - `program_count` (text)

### WordPress Plugins Required

- Advanced Custom Fields (ACF) Pro
- Custom Post Type UI
- WP REST API extensions

### API Endpoints Expected

- `/wp-json/wp/v2/programs`
- `/wp-json/wp/v2/testimonials`
- `/wp-json/wp/v2/campuses`
- `/wp-json/wp/v2/posts`
- `/wp-json/wp/v2/pages`
- `/wp-json/wp/v2/contact-form` (custom endpoint for form submissions)

## Environment Variables

Copy `.env.example` to `.env.local` and update:

\`\`\`bash
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
\`\`\`

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up your WordPress site with the required custom post types and fields

3. Configure your environment variables

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## WordPress Content Structure

### Programs
- Create programs with all required ACF fields
- Set featured programs using the `featured` field
- Organize by categories (automotive, healthcare, technology, trades)

### Testimonials
- Add student testimonials with photos and ratings
- Include program information for each testimonial

### Campuses
- Set up campus locations with contact information
- Include student and program counts for statistics

### Posts
- Use categories to organize content (news, student-life, etc.)
- Featured images will be used in card layouts

## Deployment

The site can be deployed to Vercel, Netlify, or any platform supporting Next.js.

Make sure your WordPress site is accessible and CORS is properly configured for your domain.
