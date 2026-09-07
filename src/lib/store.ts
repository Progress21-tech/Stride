import { User, Application, Goal, Task, CheckIn, EmergencyPass, Resource, AuditEvent, WeeklyReport } from './types';

// Seed Resources
export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Web Development in 2026 — Beginner Starter Guide',
    url: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
    youtubeId: 'zJSY8tbf_ys',
    provider: 'YouTube (Traversy Media)',
    category: 'Web Development',
    level: 'Beginner',
    duration: '45 mins',
    whyRecommended: 'Clear explanation of frontend vs backend, toolchains, and modern execution roadmap.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-2',
    title: 'Data Analytics Complete Roadmap & Foundations',
    url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
    youtubeId: 'r-uOLxNrNk8',
    provider: 'YouTube (Alex The Analyst)',
    category: 'Data',
    level: 'Beginner',
    duration: '35 mins',
    whyRecommended: 'Structured overview of SQL, Excel, Tableau, and Python for career switchers.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-3',
    title: 'Cybersecurity Fundamentals for Beginners',
    url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
    youtubeId: 'inWWhr5tnEA',
    provider: 'YouTube (NetworkChuck)',
    category: 'Cybersecurity',
    level: 'Beginner',
    duration: '40 mins',
    whyRecommended: 'Engaging, hands-on breakdown of networking, threat models, and security principles.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-4',
    title: 'Product Design & UX/UI Masterclass Primer',
    url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    youtubeId: 'c9Wg6Cb_YlU',
    provider: 'YouTube (Figma Academy)',
    category: 'Product Design',
    level: 'Beginner',
    duration: '50 mins',
    whyRecommended: 'Covers user research, wireframing, component design systems, and Figma basics.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-5',
    title: 'The Stride Learning Philosophy & Accountability Operating System',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    provider: 'Stride Internal',
    category: 'General Intro',
    level: 'Beginner',
    duration: '15 mins',
    whyRecommended: 'Essential orientation video explaining Stride daily check-in habits and Saturday review expectation.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  }
];

// Seed Applications
export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-101',
    userId: 'user-app-1',
    userName: 'David Okonjo',
    userEmail: 'david.o@example.com',
    whatsappNumber: '+234 803 123 4567',
    timezone: 'Africa/Lagos (UTC+1)',
    currentTechStatus: 'Complete Beginner',
    primaryAreaOfInterest: 'Web Development',
    dailyLearningCapacity: '2 hours/day',
    whyAccountabilityNow: 'I have started 3 different Udemy courses in the last 6 months but dropped out after week 2 every single time due to lack of structure and isolation. I need daily check-ins and peer accountability to keep moving forward.',
    dailyReportsCommitment: true,
    saturdayCallCommitment: true,
    emergencyPassAcceptance: true,
    disciplinePlan: 'I will block 7-9 PM daily after work, silence phone notifications, and log my check-in right after studying.',
    reflectionAnswer: 'I love how web dev lets you transform ideas into tangible tools that people can interact with.',
    score: 92,
    status: 'SUBMITTED',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'app-102',
    userId: 'user-app-2',
    userName: 'Amina Yusuf',
    userEmail: 'amina.yusuf@example.com',
    whatsappNumber: '+234 812 987 6543',
    timezone: 'Africa/Lagos (UTC+1)',
    currentTechStatus: 'Self-Taught',
    primaryAreaOfInterest: 'Data',
    dailyLearningCapacity: '1.5 hours/day',
    whyAccountabilityNow: 'I am transitioning from accounting into Data Analytics. I need a clear goal hierarchy and weekly review feedback so I do not waste time jumping between random tutorials.',
    dailyReportsCommitment: true,
    saturdayCallCommitment: true,
    emergencyPassAcceptance: true,
    disciplinePlan: 'When motivation drops, I will focus on completing just 30 minutes of study instead of skipping the entire day.',
    reflectionAnswer: 'Data visualization and finding hidden operational trends.',
    score: 88,
    status: 'UNDER_REVIEW',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Seed Approved Members
export const INITIAL_MEMBERS: User[] = [
  {
    id: 'user-mem-1',
    email: 'alex.chen@example.com',
    name: 'Alex Chen',
    whatsappNumber: '+1 415 555 0192',
    timezone: 'America/New_York (UTC-5)',
    role: 'MEMBER',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 21).toISOString()
  },
  {
    id: 'user-mem-2',
    email: 'sarah.k@example.com',
    name: 'Sarah Kante',
    whatsappNumber: '+44 7700 900077',
    timezone: 'Europe/London (UTC+0)',
    role: 'MEMBER',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: 'user-admin-1',
    email: 'admin@stride.tech',
    name: 'Marcus Vance (Group Leader)',
    whatsappNumber: '+1 212 555 0100',
    timezone: 'UTC',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
  }
];

// Seed Goal & Tasks for Active Member (Alex Chen)
export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    userId: 'user-mem-1',
    title: 'Become a Frontend Developer',
    description: 'Master HTML/CSS, Modern JavaScript, React core patterns, and responsive UI building.',
    startDate: new Date(Date.now() - 86400000 * 21).toISOString(),
    targetDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    status: 'ACTIVE',
    milestones: [
      {
        id: 'ms-1',
        goalId: 'goal-1',
        title: 'HTML5 & CSS Grid/Flexbox Fundamentals',
        targetDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        status: 'COMPLETED',
        order: 1,
        weeklyObjectives: [
          {
            id: 'wo-1',
            milestoneId: 'ms-1',
            title: 'Build two fully responsive landing pages',
            status: 'COMPLETED',
            tasks: []
          }
        ]
      },
      {
        id: 'ms-2',
        goalId: 'goal-1',
        title: 'JavaScript DOM & Event Loop Mastery',
        targetDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'IN_PROGRESS',
        order: 2,
        weeklyObjectives: [
          {
            id: 'wo-2',
            milestoneId: 'ms-2',
            title: 'Finish JavaScript async/await & DOM manipulation project',
            status: 'PLANNED',
            tasks: []
          }
        ]
      }
    ]
  }
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgoStr = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    userId: 'user-mem-1',
    weeklyObjectiveId: 'wo-2',
    title: 'Implement mobile navigation drawer with accessible ARIA attributes',
    dueDate: todayStr,
    status: 'COMPLETED',
    completedAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    userId: 'user-mem-1',
    weeklyObjectiveId: 'wo-2',
    title: 'Refactor fetch API handling to include error try/catch boundaries',
    dueDate: todayStr,
    status: 'COMPLETED',
    completedAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    userId: 'user-mem-1',
    weeklyObjectiveId: 'wo-2',
    title: 'Write custom hook for window resize breakpoint detection',
    dueDate: todayStr,
    status: 'PLANNED'
  },
  {
    id: 'task-4',
    userId: 'user-mem-1',
    weeklyObjectiveId: 'wo-2',
    title: 'Review JS Event Bubbling vs Capturing documentation',
    dueDate: todayStr,
    status: 'PLANNED'
  },
  {
    id: 'task-5',
    userId: 'user-mem-1',
    weeklyObjectiveId: 'wo-1',
    title: 'Style pricing card component with glassmorphism CSS',
    dueDate: yesterdayStr,
    status: 'COMPLETED',
    completedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const INITIAL_CHECKINS: CheckIn[] = [
  {
    id: 'chk-1',
    userId: 'user-mem-1',
    date: yesterdayStr,
    completionStatus: 'YES',
    learnings: 'Understood Event Delegation and how bubbling allows one parent listener to manage multiple child button clicks efficiently.',
    completedWork: 'Built responsive glassmorphism pricing card component and tested on mobile screens.',
    learningTimeMinutes: 120,
    blockers: 'Slight confusion around event.stopPropagation() vs event.preventDefault(). Resolved by reading MDN docs.',
    nextPriority: 'Build mobile navigation drawer with accessible ARIA attributes.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'chk-2',
    userId: 'user-mem-1',
    date: twoDaysAgoStr,
    completionStatus: 'YES',
    learnings: 'Mastered CSS Grid auto-fit vs auto-fill with minmax() function.',
    completedWork: 'Completed 4 lessons on CSS layout architectures.',
    learningTimeMinutes: 90,
    blockers: 'None',
    nextPriority: 'Style pricing card component.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_PASSES: EmergencyPass[] = [];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'audit-1',
    actorId: 'user-admin-1',
    actorName: 'Marcus Vance',
    action: 'APPLICATION_APPROVED',
    objectType: 'APPLICATION',
    objectId: 'app-100',
    timestamp: new Date(Date.now() - 86400000 * 21).toISOString(),
    metadata: 'Provisioned workspace for Alex Chen'
  }
];

// Calculation Functions
export function calculateStreak(checkIns: CheckIn[], userId: string): number {
  const userCheckIns = checkIns
    .filter(c => c.userId === userId && (c.completionStatus === 'YES' || c.completionStatus === 'PARTIAL' || c.completionStatus === 'EMERGENCY_PASS'))
    .map(c => c.date)
    .sort((a, b) => b.localeCompare(a)); // Descending dates

  if (userCheckIns.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Start counting from today or yesterday
  let checkDate = userCheckIns.includes(today) ? today : (userCheckIns.includes(yesterday) ? yesterday : null);
  if (!checkDate) return 0;

  let currentTs = new Date(checkDate).getTime();
  while (true) {
    const formatted = new Date(currentTs).toISOString().split('T')[0];
    if (userCheckIns.includes(formatted)) {
      streak++;
      currentTs -= 86400000;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateTaskCompletionRate(tasks: Task[], userId: string): number {
  const userTasks = tasks.filter(t => t.userId === userId);
  if (userTasks.length === 0) return 0;
  const completed = userTasks.filter(t => t.status === 'COMPLETED').length;
  return Math.round((completed / userTasks.length) * 100);
}

export function calculateRiskLevel(user: User, checkIns: CheckIn[], tasks: Task[]): 'Normal' | 'Watch' | 'Intervention' {
  const userCheckIns = checkIns.filter(c => c.userId === user.id);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const checkedInRecently = userCheckIns.some(c => c.date === today || c.date === yesterday);
  const completionRate = calculateTaskCompletionRate(tasks, user.id);

  if (!checkedInRecently && userCheckIns.length < 2) {
    return 'Watch';
  }
  if (!checkedInRecently || completionRate < 50) {
    return 'Watch';
  }
  return 'Normal';
}
