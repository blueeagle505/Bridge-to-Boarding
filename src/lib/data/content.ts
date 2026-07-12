export const helpTopics = [
  { title: "SSAT Prep", desc: "Structured study plans and practice strategy." },
  { title: "ISEE Prep", desc: "Section-by-section guidance from recent test-takers." },
  { title: "Essays", desc: "Brainstorming and line-by-line editing." },
  { title: "Interviews", desc: "Mock interviews and real feedback." },
  { title: "School Selection", desc: "Building a balanced, well-fit school list." },
  { title: "Application Planning", desc: "Deadlines, forms, and requirements, organized." },
  { title: "Financial Aid", desc: "Understanding forms and what aid can look like." },
  { title: "Campus Life", desc: "What day-to-day life is actually like." },
  { title: "Dorm Questions", desc: "Roommates, routines, and homesickness." },
  { title: "Extracurricular Strategy", desc: "Building a compelling, authentic profile." },
  { title: "Parent Questions", desc: "Guidance for families navigating the process." },
  { title: "Timeline Planning", desc: "A month-by-month roadmap to submission." },
] as const;

export const featuredSchools = [
  { name: "Phillips Academy Andover", location: "Andover, MA", enrollment: "~1,150 students", desc: "A rigorous, historic New England boarding school known for its Harkness-table teaching method." },
  { name: "Phillips Exeter Academy", location: "Exeter, NH", enrollment: "~1,050 students", desc: "Renowned for its Harkness discussion-based classrooms and deep academic breadth." },
  { name: "Choate Rosemary Hall", location: "Wallingford, CT", enrollment: "~850 students", desc: "A comprehensive boarding school with strong arts, sciences, and athletics programs." },
  { name: "The Lawrenceville School", location: "Lawrenceville, NJ", enrollment: "~850 students", desc: "Known for its distinctive House system and close student-faculty relationships." },
  { name: "Deerfield Academy", location: "Deerfield, MA", enrollment: "~650 students", desc: "A close-knit residential community with a strong tradition of academics and athletics." },
  { name: "The Loomis Chaffee School", location: "Windsor, CT", enrollment: "~750 students", desc: "Known for its Norris Ely Orchard Theater and emphasis on community citizenship." },
  { name: "Milton Academy", location: "Milton, MA", enrollment: "~700 students (boarding & day)", desc: "A day-and-boarding school just outside Boston with a strong college placement record." },
  { name: "The Hotchkiss School", location: "Lakeville, CT", enrollment: "~600 students", desc: "Set on a scenic Connecticut lake campus with strengths in the arts and outdoor programs." },
  { name: "St. Paul's School", location: "Concord, NH", enrollment: "~535 students", desc: "A historic Episcopal boarding school known for its rowing program and chapel community." },
] as const;

export const faqItems = [
  {
    q: "Is Bridge to Boarding really free?",
    a: "Yes — completely free, for every student, always. We're run entirely by current boarding school student volunteers, so there are no consulting fees of any kind.",
  },
  {
    q: "Who are the mentors?",
    a: "Every mentor is a current boarding school student who applied to be a mentor and was approved by our admin team based on their experience, references, and areas of expertise.",
  },
  {
    q: "Is Bridge to Boarding affiliated with any boarding school?",
    a: "No. Bridge to Boarding is an independent, student-led initiative. We are not affiliated with, endorsed by, or sponsored by any boarding school featured on our site.",
  },
  {
    q: "How long does it take to get matched with a mentor?",
    a: "After your application is reviewed and accepted, you should expect to be matched with a mentor within approximately 3–5 business days.",
  },
  {
    q: "What grades can apply?",
    a: "Bridge to Boarding currently supports students applying to boarding school as rising 8th or 9th graders (i.e., current 7th or 8th graders).",
  },
  {
    q: "Can parents reach out with questions?",
    a: "Absolutely. Parents are welcome to use our contact form, and mentors are glad to answer parent questions throughout the process.",
  },
  {
    q: "What if I'm waitlisted for a mentor?",
    a: "Being waitlisted isn't a rejection — it means we currently have more applicants than available mentors. We'll reach out the moment a mentor becomes available.",
  },
] as const;

export const resources = [
  { title: "Interview Guide", category: "Interviews", description: "How to prepare for and ace your boarding school interview." },
  { title: "Essay Guide", category: "Essays", description: "A step-by-step framework for writing a standout admissions essay." },
  { title: "SSAT Study Plan", category: "Testing", description: "An 8-week study plan for the SSAT." },
  { title: "ISEE Study Plan", category: "Testing", description: "An 8-week study plan for the ISEE." },
  { title: "Packing Guide", category: "Campus Life", description: "What to bring (and not bring) to your first year." },
  { title: "Financial Aid Guide", category: "Financial Aid", description: "Understanding the SSS form and what to expect." },
  { title: "Admissions Timeline", category: "Planning", description: "A month-by-month timeline from research to enrollment." },
  { title: "Application Checklist", category: "Planning", description: "Every document and form you'll need, in one place." },
] as const;

export const trustPoints = [
  { title: "100% Free", desc: "No consulting fees, ever — for any student, at any stage." },
  { title: "Run by Boarding School Students", desc: "Every mentor has firsthand experience with the exact process you're navigating." },
  { title: "Personalized Mentorship", desc: "Students are matched based on their needs and a mentor's availability and expertise." },
  { title: "Independent", desc: "Bridge to Boarding is not affiliated with any boarding school." },
] as const;
