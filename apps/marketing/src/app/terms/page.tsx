import type { Metadata } from 'next';
import { LegalPageLayout, type LegalSectionData } from '../../components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | Sylpace',
  description: 'Read the terms that govern your use of the Sylpace learning platform.',
};

const sections: LegalSectionData[] = [
  {
    id: 'acceptance', title: 'Acceptance of these terms', content: <>
      <p>These draft Terms of Service describe proposed rules for using the Sylpace website and, when made available, its learning services. By using a service after final terms are published, you will be asked to agree to the applicable terms.</p>
      <p>The public Sylpace landing page currently offers product information and a waitlist. Joining the waitlist does not create an account or grant platform access. These terms are a draft and are not approved as final legal terms.</p>
    </>,
  },
  {
    id: 'eligibility', title: 'Eligibility', content: <>
      <p>Sylpace is being developed for university students, tutors and authorized platform administrators. The minimum age and any additional eligibility requirements have not been finalized: <strong>[MINIMUM AGE / ELIGIBILITY POLICY TO BE CONFIRMED]</strong>.</p>
      <p>Until those requirements are published, this draft does not state that Sylpace is for adults only or available to every age group. Any account access may be limited to invited or approved users, depending on the launch plan.</p>
    </>,
  },
  {
    id: 'accounts', title: 'Accounts', content: <>
      <p>The public marketing website offers only the waitlist; joining it does not create an account. Account-creation and sign-in endpoints exist in the codebase, but the audience and routes that will be enabled at launch have not been confirmed. <strong>[PUBLIC SIGN-UP, INVITATION AND ADMIN ACCESS RULES TO BE CONFIRMED]</strong>.</p>
      <p>If an account is made available to you, provide accurate information and keep your credentials confidential. You are responsible for activity under your account, subject to applicable law. Do not share an account where the final account rules prohibit sharing. Contact Sylpace if you believe your account has been accessed without permission.</p>
    </>,
  },
  {
    id: 'service', title: 'The Sylpace service', content: <>
      <p>Sylpace is being developed as a learning platform organized around university courses. Depending on release and access, the service is intended to include courses, tutor-created lessons and learning materials, practice and quizzes, course progress, study goals, tasks, check-ins, weekly reviews, notifications and learning communities.</p>
      <p>Features are introduced in stages and may not all be available at the same time. Accountability partners, live learning games, community competitions and seasonal mock exams are planned features, not promises that those features are currently live. Courses and institutions shown in product previews may be illustrative and do not establish a partnership or guarantee availability.</p>
    </>,
  },
  {
    id: 'education', title: 'Educational content', content: <>
      <p>Sylpace and its tutors provide learning materials to support study. They are not a guarantee of exam results, grades, admission, employment or any particular academic outcome. Your results depend on many factors, including your own work and the requirements of your institution.</p>
      <p>Check important academic requirements with your university or course instructor. Sylpace does not replace official course guidance, assessment rules or advice from your institution.</p>
    </>,
  },
  {
    id: 'tutors', title: 'Tutor content', content: <>
      <p>Tutors may be able to submit videos, notes, slides, captions, links and other course materials for review. Tutor content tools and upload workflows may not yet be available.</p>
      <p>Tutors must have the rights or permissions needed to submit materials. The final tutor agreement will set out ownership, licences, permitted use, review, feedback, removal and takedown processes. Those details have not been finalized: <strong>[TUTOR CONTENT TERMS TO BE CONFIRMED]</strong>.</p>
    </>,
  },
  {
    id: 'acceptable-use', title: 'Acceptable use', content: <>
      <p>You must use Sylpace lawfully and respectfully. You must not:</p>
      <ul>
        <li>harass, threaten, impersonate or intentionally harm another person;</li>
        <li>access an account, course, system or data without authorization;</li>
        <li>disrupt, overload, probe or interfere with the service or its security;</li>
        <li>upload material you do not have the right to use or share;</li>
        <li>post unlawful, abusive, misleading or privacy-invasive content;</li>
        <li>use the service to distribute malware, spam or harmful code; or</li>
        <li>misuse community, partner, competition or assessment features.</li>
      </ul>
      <p>Additional course, tutor and community rules may apply when those features are released.</p>
    </>,
  },
  {
    id: 'user-content', title: 'User content', content: <>
      <p>You may be able to submit profile details, goals, tasks, check-ins, reflections, posts, replies or other content. You are responsible for ensuring you have the right to submit it and that it does not unlawfully infringe another person’s rights.</p>
      <p>This draft does not establish a final ownership or licensing arrangement. <strong>[USER CONTENT LICENCE, PLATFORM PERMISSIONS AND REMOVAL TERMS TO BE CONFIRMED BY COUNSEL]</strong>. The final terms will explain any permissions needed to host, display and operate the features you choose to use.</p>
    </>,
  },
  {
    id: 'community', title: 'Community and sharing rules', content: <>
      <p>Community participation, accountability partners, live study games and seasonal mock exams are planned or may be released in stages. When available, participate respectfully, keep discussion relevant to learning, and do not share private information about yourself or someone else unnecessarily.</p>
      <p>Information you intentionally share with a partner or group may be visible to that audience and should not be treated as confidential. Sylpace may review reports, moderate content or restrict access under the final community rules. The sharing controls, moderation process and appeal route remain to be finalized.</p>
    </>,
  },
  {
    id: 'intellectual-property', title: 'Intellectual property', content: <>
      <p>The ownership and licensing terms for the Sylpace name, software, course materials, tutor submissions and user content are being finalized. <strong>[SYLPACE ENTITY, OWNERSHIP AND LICENCE TERMS TO BE CONFIRMED]</strong>. This draft does not settle ownership of a user’s or tutor’s content.</p>
      <p>Do not copy or redistribute content from Sylpace or another user unless you have permission or another legal right to do so.</p>
    </>,
  },
  {
    id: 'third-party', title: 'Third-party services and links', content: <>
      <p>Sylpace may link to or depend on third-party services, such as hosting, email delivery or media services. Those services may have separate terms and privacy practices. Their identities and roles must be confirmed for production: <strong>[THIRD-PARTY PROVIDERS AND INTEGRATIONS TO BE CONFIRMED]</strong>.</p>
      <p>Sylpace is not responsible for third-party services except as required by applicable law. A link does not mean Sylpace endorses or controls the linked service.</p>
    </>,
  },
  {
    id: 'availability', title: 'Availability and changes', content: <>
      <p>Sylpace is being built and its features may change. We may add, change, suspend or discontinue a feature, course or part of the service as development and operational needs evolve, subject to applicable law and any final commitments made to users.</p>
      <p>We aim to operate the service responsibly but do not promise uninterrupted or error-free availability. We will communicate material changes where appropriate.</p>
    </>,
  },
  {
    id: 'suspension', title: 'Suspension and termination', content: <>
      <p>Sylpace may restrict or suspend access where reasonably necessary to address a security risk, suspected unlawful activity, serious violation of final rules, harm to another person or disruption to the service. Where appropriate and permitted by law, Sylpace will provide notice and an opportunity to resolve or appeal the issue.</p>
      <p>Account closure, data deletion, appeals and the effect of termination are subject to the final account and privacy policies. <strong>[SUSPENSION, TERMINATION AND APPEAL PROCESS TO BE CONFIRMED]</strong>.</p>
    </>,
  },
  {
    id: 'disclaimers', title: 'Disclaimers', content: <>
      <p>To the extent permitted by applicable law, the service and educational materials are provided as they are available. Sylpace does not guarantee that a particular course, tutor, feature or learning outcome will be available or suitable for every student.</p>
      <p>Nothing in these draft terms limits rights or responsibilities that cannot lawfully be excluded. Final disclaimer language requires review by qualified counsel.</p>
    </>,
  },
  {
    id: 'liability', title: 'Limitation of liability', content: <>
      <p>A limitation of liability has not been drafted or approved. <strong>[LIABILITY TERMS TO BE DRAFTED AND CONFIRMED BY QUALIFIED COUNSEL]</strong>. Any final provision must comply with applicable law and preserve rights that cannot legally be limited.</p>
    </>,
  },
  {
    id: 'governing-law', title: 'Governing law and jurisdiction', content: <>
      <p><strong>[GOVERNING LAW AND JURISDICTION TO BE CONFIRMED BY COUNSEL]</strong>. This draft does not select a governing law, court or dispute-resolution process.</p>
    </>,
  },
  {
    id: 'changes', title: 'Changes to these terms', content: <>
      <p>As Sylpace develops, these terms may need to change. The “Last updated” date above identifies the current draft revision. Material changes will be communicated through the relevant service or another appropriate method where required. The final effective date will be set when the terms are approved.</p>
    </>,
  },
  {
    id: 'contact', title: 'Contact', content: <>
      <p>Questions about these terms? Contact: <strong>[SYLPACE CONTACT TO BE CONFIRMED]</strong>.</p>
      <p>This document is a draft and has not been reviewed and approved as final legal advice. It should be reviewed by Sylpace’s owner and qualified legal counsel before public launch. See the <a href="/privacy">Privacy Policy</a>.</p>
    </>,
  },
];

export default function TermsPage() {
  return <LegalPageLayout title="Terms of Service" description="The proposed terms for using the Sylpace website and learning platform." sections={sections} />;
}
