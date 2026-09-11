import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  track?: 'neet' | 'jee';
}

export default function SEOHead({ track = 'neet' }: SEOHeadProps) {
  const isNeet = track === 'neet';
  const pageTitle = isNeet
    ? "NEET & JEE Mentorship & Study Help | Result-Oriented Prep — RestartClub"
    : "JEE & NEET Mentorship & Study Help | Result-Oriented Prep — RestartClub";
  const pageDescription = "Struggling with backlogs, low mock scores, or NCERT revision? Get 1-on-1 AIR topper mentorship, 24/7 AI WhatsApp doubt clearing, and guaranteed rank improvement.";
  const siteUrl = "https://restart-club-joam.vercel.app/";

  // Structured Data (JSON-LD) for FAQPage Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where can I get personal 1-on-1 help if my coaching isn't clearing my doubts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At RestartClub, you get paired directly with an AIR Topper from AIIMS or IIT who conducts weekly 1-on-1 video mentorship sessions, reviews your test mistakes, and provides an actionable daily timetable. Combined with our 24/7 Hinglish AI WhatsApp doubt assistant, you never stay stuck on any physics numerical, chemistry mechanism, or biology concept."
        }
      },
      {
        "@type": "Question",
        "name": "What is a result-oriented study plan for a NEET or JEE dropper?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A result-oriented dropper plan starts with a diagnostic test to identify high-yield backlogs and concept gaps. We allocate 70% study time to syllabus completion and 30% to structured revision. It includes weekly full-syllabus mock tests with 3-category error analysis (conceptual, calculation, panic-guessing) and daily mentor accountability check-ins."
        }
      },
      {
        "@type": "Question",
        "name": "How does the 24/7 WhatsApp AI doubt solver help with late-night study?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Whenever you encounter a tough question during self-study or late-night revision (11 PM - 4 AM), snap a picture or type the problem into WhatsApp. The AI engine instantly replies with step-by-step logic, formula derivations, and common trap warnings in easy Hinglish. If you need further clarity, you can trigger a 1-tap Priority Human Mentor SOS."
        }
      },
      {
        "@type": "Question",
        "name": "Can Class 10/11 foundation students get mentorship for early JEE/NEET prep?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Early start batches for Class 10 and 11 focus on building rock-solid fundamentals, managing school-coaching balance, mastering NCERT line-by-line, and preventing common backlogs in mechanics, physical chemistry, and cell biology."
        }
      },
      {
        "@type": "Question",
        "name": "How are mentors selected, and what results have past students achieved?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our mentors are verified top rankers from prestigious institutions including AIIMS New Delhi, IIT Bombay, IIT Delhi, and MAMC. In the past academic cycle, 87% of our enrolled droppers achieved score jumps of 150+ marks in NEET and 15+ percentile in JEE Main."
        }
      }
    ]
  };

  // Structured Data for EducationalOrganization & Course
  const courseOrgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}#organization`,
        "name": "RestartClub",
        "url": siteUrl,
        "logo": `${siteUrl}logo.png`,
        "description": "Premier 1-on-1 AIR Topper Mentorship & 24/7 AI WhatsApp Doubt Clearance for JEE & NEET aspirants.",
        "sameAs": [
          "https://t.me/+qUnxBGBGFHFiNjdl",
          "https://chat.whatsapp.com/Ex2TyD2lP5aJGPvwUVT4tS"
        ]
      },
      {
        "@type": "Course",
        "name": "NEET UG 1-on-1 AIR Topper Mentorship & Dropper Rank Booster",
        "description": "Comprehensive personalized mentorship program featuring daily backlog tracking, NCERT line-by-line notes, AI doubt solving, and mock post-mortems.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "RestartClub",
          "url": siteUrl
        }
      },
      {
        "@type": "Course",
        "name": "JEE Main & Advanced 1-on-1 IITian Mentorship Program",
        "description": "Targeted problem-solving roadmaps, speed-accuracy calibration, and 24/7 AI WhatsApp doubt resolution led by IIT Bombay and IIT Delhi rankers.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "RestartClub",
          "url": siteUrl
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* HTML Title & Description */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={siteUrl} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Primary Keywords for EdTech Intent */}
      <meta 
        name="keywords" 
        content="help in jee neet, result oriented neet mentorship, dropper study plan for jee, how to cover backlog in class 11 neet, how to clear backlogs in JEE NEET, how to increase marks in NEET mock tests, avoid negative marking, NCERT biology short notes for NEET, organic chemistry mechanism maps, best mentorship for NEET droppers, JEE dropper strategy 2027, 1 on 1 iit mentorship, whatsapp ai doubt solver, AIIMS topper mentor" 
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`${siteUrl}logo.png`} />
      <meta property="og:site_name" content="RestartClub" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${siteUrl}logo.png`} />

      {/* JSON-LD Rich Snippet Schemas */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(courseOrgSchema)}
      </script>
    </Helmet>
  );
}
