import type { Metadata } from 'next';
import { LegalPageLayout, type LegalSectionData } from '../../components/legal/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sylpace',
  description: 'Learn how Sylpace collects, uses and protects information when you use our learning platform.',
};

const sections: LegalSectionData[] = [
  {
    id: 'introduction', title: 'Introduction', content: <>
      <p>This draft explains how Sylpace handles personal information when you visit the public website, join the waitlist, or use account-based services as they become available. Sylpace is being built as a learning platform for university students: Learn, Practise, Progress, Stay on track.</p>
      <p>The legal person responsible for the service has not yet been confirmed. <strong>[LEGAL ENTITY / DATA CONTROLLER NAME TO BE CONFIRMED]</strong>. This draft is intended to describe current code and planned launch features separately; only features enabled in the service you use apply to you.</p>
      <p>We aim to collect only information needed to provide the relevant service, explain our practices clearly, and protect information responsibly. This draft is not legal advice and must be reviewed by qualified counsel before launch.</p>
    </>,
  },
  {
    id: 'information-collected', title: 'Information we collect', content: <>
      <h3>Information you provide</h3>
      <p><strong>Current waitlist:</strong> The public waitlist form asks for your email address and requires you to tick a box agreeing to receive Sylpace launch updates. The waitlist service records the consent text version and the time the entry was created. The current form does not ask for your name, university, faculty, department or level. Joining does not create an account or give you access to Sylpace.</p>
      <p>The form sends a hidden anti-spam field to the API; a non-empty value is rejected and is not saved as a waitlist entry. The API normalizes the email address to lowercase before storage.</p>
      <h3>Account and learning information</h3>
      <p>When account services are enabled, the account system is designed to process your name, email address, password hash (not your readable password), account status, roles, time zone, authentication tokens and session information. Depending on which learning features are enabled, you may also provide university, faculty, department and level details, course activity, lesson completion, quiz attempts, goals, tasks, weekly objectives, check-ins, reflections and community posts.</p>
      <p>Some earlier platform features and data structures remain in the repository during migration. <strong>[CONFIRM WHICH ACCOUNT SERVICES AND LEGACY DATA STORES WILL BE ACTIVE AT PUBLIC LAUNCH]</strong>. Information is processed only when the corresponding service is enabled and you use it.</p>
      <h3>Information generated through use</h3>
      <p>Enabled platform features may generate records such as lessons viewed, course progress, quiz and practice results, task completion, learning activity, check-in status, streaks, weekly summaries, notification settings and community activity. Features that have not launched do not yet generate these records through the public waitlist.</p>
      <h3>Technical information</h3>
      <p>For requests to the API, service logs may contain request details such as network address, request method and path, response status, timing and a request identifier. Account sessions are designed to store a user-agent string and a hashed network address for session security. Exact hosting logs, retention and deployed configuration depend on the hosting provider and need confirmation: <strong>[HOSTING PROVIDER AND LOGGING DETAILS TO BE CONFIRMED]</strong>.</p>
      <p>The current waitlist form does not ask for precise location, contacts, camera, microphone, device files or advertising identifiers.</p>
    </>,
  },
  {
    id: 'waitlist', title: 'Waitlist privacy', content: <>
      <p>The waitlist is separate from the Sylpace account system. It currently collects your email address, your affirmative consent to launch updates, a consent-text version and a timestamp. The consent version currently recorded by the API is <code>launch-updates-2026-10</code>.</p>
      <p>We use this information to maintain the launch list and, once an email process is configured, send the updates you agreed to receive. The current waitlist API stores entries; it does not itself send waitlist emails. Email delivery arrangements and any unsubscribe method must be confirmed before messages are sent.</p>
      <p>You can decline by not submitting the form. You may withdraw consent at any time by contacting <strong>[PRIVACY CONTACT TO BE CONFIRMED]</strong>. Joining does not automatically create an account, enroll you in a course or grant platform access.</p>
      <p>The waitlist currently uses a Supabase project configured by Sylpace to store submissions. The production project, hosting location and any additional processors must be confirmed before launch. Waitlist data is not sold.</p>
    </>,
  },
  {
    id: 'uses', title: 'How we use information', content: <>
      <p>Depending on the service and feature involved, Sylpace may use information to:</p>
      <ul>
        <li>record and manage a waitlist entry and the consent associated with it;</li>
        <li>create and secure an account, authenticate you and provide account support;</li>
        <li>organize courses around a selected university and academic level when that feature is available;</li>
        <li>provide lessons, learning materials, practice and progress tracking;</li>
        <li>support study goals, tasks, check-ins, reviews and other accountability features;</li>
        <li>operate course communities and moderate content when those features are available;</li>
        <li>send essential account or service notices and, separately, optional communications you have agreed to receive;</li>
        <li>maintain service reliability, investigate errors, rate-limit abuse, protect accounts and keep audit records; and</li>
        <li>respond to valid legal obligations or protect people, rights and the service where the law permits.</li>
      </ul>
      <p>The lawful basis for each activity, including processing required to provide future account services, is <strong>[LAWFUL BASIS AND PURPOSE MAPPING TO BE CONFIRMED BY COUNSEL]</strong>. Waitlist launch communications are currently gated by an explicit consent checkbox.</p>
    </>,
  },
  {
    id: 'learning-progress', title: 'Learning and progress data', content: <>
      <p>Learning information exists to provide the learning experience, show your progress and help you understand and manage your study. If enabled, it may include your courses, lessons completed, practice and quiz attempts, course progress, tasks, goals, check-ins, learning time or activity, and weekly progress.</p>
      <p>These records can reveal how you study and what you are working on. We do not sell personal information or educational performance data. Any future use beyond providing, securing or improving the learning service must be explained before it begins and reviewed for an appropriate legal basis.</p>
      <p>Accountability partners, group reviews and community features are planned or may vary by release. Sharing with another learner should occur only through an enabled feature and in accordance with the choices and visibility controls presented to you. Final sharing controls and defaults remain to be confirmed.</p>
    </>,
  },
  {
    id: 'community-content', title: 'Community and user-generated content', content: <>
      <p>If community features are enabled, students may post course-related messages, replies, reflections or other learning content. Content may be visible to people in the relevant course, group or community. Content intentionally shared with a group should not be treated as private or confidential.</p>
      <p>We may review, moderate, restrict or remove content under the final community rules and applicable law. Do not post passwords, financial details, sensitive personal information or private information about someone else unless it is necessary and you have a lawful reason to share it.</p>
      <p>Community access, live study games, competitions and seasonal mock exams are planned features and may not be available at launch.</p>
    </>,
  },
  {
    id: 'tutor-content', title: 'Tutor content', content: <>
      <p>Tutors may be able to submit videos, notes, slides, captions, links and other course materials for review and use in lessons. Tutor uploads and review workflows are not necessarily available in the current service.</p>
      <p>Tutors will be required to confirm that they have the rights or permissions needed for submitted material. Ownership, licence scope, student access, reuse, removal and takedown procedures will be set out in tutor terms and content policies that are still being prepared. <strong>[TUTOR CONTENT LICENCE AND TAKEDOWN TERMS TO BE CONFIRMED]</strong>.</p>
    </>,
  },
  {
    id: 'sharing', title: 'Sharing and disclosure', content: <>
      <h3>Service providers</h3>
      <p>The current waitlist route sends entries to a Supabase project configured by Sylpace. Other service providers, including production hosting, email delivery, media storage and the processors used for account services, must be confirmed and listed before launch: <strong>[PRODUCTION PROCESSOR LIST TO BE CONFIRMED]</strong>.</p>
      <h3>With your direction</h3>
      <p>Information may be shared with a partner, group or community when you choose to use a sharing feature and the feature explains who can see it. Sylpace does not currently state that it shares student information with universities, employers or advertisers.</p>
      <h3>Legal and safety reasons</h3>
      <p>Information may be disclosed when required by applicable law or a valid legal process, or where permitted and necessary to protect a person’s safety, rights, property or the security of Sylpace.</p>
    </>,
  },
  {
    id: 'security', title: 'Data security', content: <>
      <p>Sylpace uses or is designed to use reasonable technical and organizational measures intended to protect information. Current code includes password hashing, access checks, secure session-cookie settings, CSRF checks, request rate limits and audit records for account actions. The legacy Supabase schema also defines row-level access policies.</p>
      <p>Connections to configured services use HTTPS where supported by the deployed environment. Controls may change as infrastructure is finalized. No method of transmission or storage can be described as completely secure; the final deployed controls and incident process require review before launch.</p>
    </>,
  },
  {
    id: 'retention', title: 'Data retention', content: <>
      <p>We intend to keep personal information only for as long as reasonably needed for the purpose it was collected, legitimate operational needs, legal obligations, dispute resolution or enforcement. Information may be deleted, anonymized or retained where a legal or operational reason applies.</p>
      <p>Specific schedules for waitlist entries, account records, sessions, audit logs, course activity, backups and tutor materials have not been finalized: <strong>[RETENTION PERIODS AND DELETION SCHEDULE TO BE CONFIRMED]</strong>.</p>
    </>,
  },
  {
    id: 'rights', title: 'Your privacy rights', content: <>
      <p>Depending on the circumstances and applicable law, you may be able to request access to personal information, ask for correction or deletion, withdraw consent where consent is the basis, object to or request restriction of certain processing, and request a copy or portability where applicable. The exact process, exceptions and response times require legal confirmation.</p>
      <p>This draft is prepared with the Nigeria Data Protection Act 2023 in view. For the Act and current guidance, see the <a href="https://ndpc.gov.ng/download/nigeria-data-protection-act-2023" target="_blank" rel="noreferrer">Nigeria Data Protection Commission’s Act page</a>. You may also have the right to complain to the Nigeria Data Protection Commission. This summary is not a definitive statement of your legal rights; <strong>[RIGHTS PROCESS AND LEGAL REVIEW TO BE CONFIRMED]</strong>.</p>
      <p>To make a request, contact <strong>[PRIVACY CONTACT TO BE CONFIRMED]</strong>. We may need to verify your identity before responding.</p>
    </>,
  },
  {
    id: 'age', title: 'Children and age policy', content: <>
      <p>The minimum age for account creation and use has not been finalized. <strong>[MINIMUM AGE / AGE POLICY TO BE CONFIRMED]</strong>. Until that decision is made, this draft does not state that Sylpace is exclusively for adults or available to every age group.</p>
      <p>If you believe a child has provided personal information in a way that is not permitted by the final age policy, contact <strong>[PRIVACY CONTACT TO BE CONFIRMED]</strong>.</p>
    </>,
  },
  {
    id: 'cookies-analytics', title: 'Cookies and analytics', content: <>
      <p>The current public marketing pages do not include an analytics provider or advertising tracker in their application code. The waitlist form does not set a marketing or analytics cookie.</p>
      <p>When account authentication is enabled, the API uses a short-lived anti-CSRF cookie and a secure session cookie to protect sign-in and account requests. Account preferences may also be stored locally in the browser. Exact production cookie settings and any future analytics tools must be disclosed before they are activated. <strong>[ANALYTICS PROVIDER AND COOKIE DETAILS TO BE CONFIRMED IF INTRODUCED]</strong>.</p>
    </>,
  },
  {
    id: 'notifications', title: 'Notifications and communications', content: <>
      <p>If account features are enabled, you may receive necessary account or security messages and service notices. Learning reminders, progress summaries, weekly reports and notification preferences or quiet hours depend on which features are released.</p>
      <p>Optional launch or product updates are separate from essential service messages. The waitlist requires consent for launch updates; you may withdraw that consent using <strong>[PRIVACY CONTACT TO BE CONFIRMED]</strong>. The system that sends waitlist updates has not yet been confirmed.</p>
    </>,
  },
  {
    id: 'international-transfers', title: 'International data transfers', content: <>
      <p>Hosting locations, service regions, subprocessors and any international transfer mechanisms have not been confirmed for production. <strong>[DATA HOSTING AND INTERNATIONAL TRANSFER DETAILS TO BE CONFIRMED]</strong>. Sylpace will update this section after the production infrastructure and applicable safeguards have been reviewed.</p>
    </>,
  },
  {
    id: 'updates-contact', title: 'Policy updates and contact', content: <>
      <p>We may update this policy as Sylpace and its data practices change. The “Last updated” date above identifies the current draft revision. Where appropriate, material changes will be communicated through the website or the relevant service. The effective date will be set when the final policy is approved.</p>
      <p><strong>Privacy questions or requests?</strong><br />Contact: <strong>[PRIVACY CONTACT TO BE CONFIRMED]</strong></p>
      <p>This draft notice is separate from the final policy and should be revised or removed only after the owner and qualified legal counsel approve the final text.</p>
      <p>See also the <a href="/terms">Terms of Service</a>.</p>
    </>,
  },
];

export default function PrivacyPage() {
  return <LegalPageLayout title="Privacy Policy" description="A clear account of how Sylpace handles information across the waitlist and learning platform." sections={sections} />;
}
