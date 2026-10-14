import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information We Collect', body: 'CodeRant collects information that you provide directly through our membership interest form and contact form, including your name, email address, location, professional details, and any message content you submit.' },
      { heading: 'How We Use Your Information', body: 'We use the information collected to review membership applications, respond to inquiries, and communicate with approved community members. Membership application data is reviewed by authorized administrators only.' },
      { heading: 'Data Storage & Security', body: 'Your information is stored securely and accessible only to authorized administrators. We do not sell or share your personal data with third parties.' },
      { heading: 'Your Rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting the CodeRant administrative team.' },
      { heading: 'Cookies', body: 'Our website uses essential cookies to remember your theme preference (dark or light mode) and to provide core functionality. We do not use tracking cookies.' },
    ],
  },
  terms: {
    title: 'Terms of Use',
    sections: [
      { heading: 'Acceptance of Terms', body: 'By accessing and using the CodeRant website, you agree to be bound by these terms of use and all applicable laws and regulations.' },
      { heading: 'Community Membership', body: 'CodeRant is an invite-only community. Submitting a membership interest form does not guarantee admission. All applications are reviewed by authorized administrators before membership decisions are made.' },
      { heading: 'User Content', body: 'Administrators are responsible for the accuracy of published content including job listings, articles, and committee profiles. CodeRant is not responsible for the content of external application links provided in job listings.' },
      { heading: 'Intellectual Property', body: 'The CodeRant name, logo, and website content are the property of the CodeRant community. Unauthorized use is prohibited.' },
      { heading: 'Limitation of Liability', body: 'CodeRant provides this website on an "as is" basis. We are not liable for any damages arising from the use of this website or participation in the community.' },
    ],
  },
  guidelines: {
    title: 'Community Guidelines',
    sections: [
      { heading: 'Respect & Professionalism', body: 'All members are expected to treat each other with respect. CodeRant is a professional community - personal attacks, harassment, or discriminatory behavior will not be tolerated.' },
      { heading: 'Knowledge Sharing', body: 'Members are encouraged to share knowledge, experiences, and resources that benefit the community. Constructive discussions and mentorship are at the heart of CodeRant.' },
      { heading: 'Confidentiality', body: 'What is shared within the community stays within the community. Members must not share private community discussions or member information externally.' },
      { heading: 'No Spam or Self-Promotion', body: 'Unsolicited promotions, spam, or excessive self-promotion are not permitted. Job postings and professional opportunities should be shared through the proper channels.' },
      { heading: 'Compliance with Laws', body: 'All members must comply with Malaysian laws and regulations, as well as the laws of their home country. Illegal activities or discussions of illegal activities are prohibited.' },
      { heading: 'Reporting Violations', body: 'If you witness a violation of these guidelines, please report it to the administrative team. All reports are treated confidentially.' },
    ],
  },
};

export default function Legal({ type }) {
  const content = CONTENT[type];
  if (!content) return null;

  return (
    <div className="flex flex-col">
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="mt-6 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {content.title}
          </h1>
        </div>
      </section>

      <section className="bg-card/30 border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="space-y-8">
            {content.sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-heading text-lg font-bold text-foreground flex items-start gap-3">
                  <span className="text-xs font-mono text-primary/60 mt-1.5">{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground pl-8">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}