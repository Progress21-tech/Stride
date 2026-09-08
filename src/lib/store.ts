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
  },
  {
    id: 'res-6',
    title: 'Frontend Development Roadmap for Beginners',
    url: 'https://www.youtube.com/results?search_query=frontend+development+roadmap+2026',
    provider: 'YouTube',
    category: 'Frontend Development',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'A practical route through HTML, CSS, JavaScript, React, accessibility, and portfolio projects.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-7',
    title: 'Backend Development Roadmap',
    url: 'https://www.youtube.com/results?search_query=backend+development+roadmap+Node.js+Python',
    provider: 'YouTube',
    category: 'Backend Development',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Introduces servers, APIs, authentication, databases, testing, and production deployment.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-8',
    title: 'Full-Stack Development Roadmap',
    url: 'https://www.youtube.com/results?search_query=full+stack+development+roadmap+2026',
    provider: 'YouTube',
    category: 'Full-Stack Development',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Connects frontend, backend, databases, Git, deployment, and product-focused project work.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-9',
    title: 'Mobile App Development Roadmap',
    url: 'https://www.youtube.com/results?search_query=mobile+app+development+roadmap+React+Native+Flutter',
    provider: 'YouTube',
    category: 'Mobile App Development',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Covers mobile interfaces, state, APIs, testing, release workflows, and app-store fundamentals.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-10',
    title: 'Data Analysis Career Roadmap',
    url: 'https://www.youtube.com/results?search_query=data+analysis+roadmap+SQL+Excel+Python+Power+BI',
    provider: 'YouTube',
    category: 'Data Analysis',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Builds the core analysis workflow from spreadsheets and SQL to Python and decision-ready dashboards.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-11',
    title: 'Data Science Roadmap',
    url: 'https://www.youtube.com/results?search_query=data+science+roadmap+Python+statistics+machine+learning',
    provider: 'YouTube',
    category: 'Data Science',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Pairs statistics and Python with experimentation, communication, and reproducible analysis.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-12',
    title: 'Machine Learning Fundamentals',
    url: 'https://www.youtube.com/results?search_query=machine+learning+roadmap+beginner+scikit+learn',
    provider: 'YouTube',
    category: 'Machine Learning',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Explains the model-building loop: data preparation, training, evaluation, iteration, and responsible use.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-13',
    title: 'AI Engineering and LLM Applications',
    url: 'https://www.youtube.com/results?search_query=AI+engineering+LLM+applications+RAG+agents',
    provider: 'YouTube',
    category: 'AI Engineering',
    level: 'Intermediate',
    duration: 'Search playlist',
    whyRecommended: 'Focuses on shipping reliable AI products with retrieval, tools, evaluation, observability, and APIs.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-14',
    title: 'AI Automation Workflows',
    url: 'https://www.youtube.com/results?search_query=AI+automation+workflows+agents+API+integrations',
    provider: 'YouTube',
    category: 'AI Automation',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Shows how to combine AI tools, APIs, triggers, and human review into useful repeatable workflows.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-15',
    title: 'Generative AI and LLM Foundations',
    url: 'https://www.youtube.com/results?search_query=generative+AI+LLM+fundamentals+embeddings+prompting',
    provider: 'YouTube',
    category: 'Generative AI & LLMs',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Builds a grounded understanding of prompting, embeddings, context windows, multimodal models, and evaluation.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-16',
    title: 'Cloud Engineering Roadmap',
    url: 'https://www.youtube.com/results?search_query=cloud+engineering+roadmap+AWS+Azure+beginner',
    provider: 'YouTube',
    category: 'Cloud Engineering',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Introduces cloud infrastructure, networking, identity, cost awareness, and scalable architecture.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-17',
    title: 'DevOps and Platform Engineering',
    url: 'https://www.youtube.com/results?search_query=DevOps+platform+engineering+roadmap+Docker+Kubernetes+CI+CD',
    provider: 'YouTube',
    category: 'DevOps & Platform Engineering',
    level: 'Intermediate',
    duration: 'Search playlist',
    whyRecommended: 'Connects delivery pipelines, containers, infrastructure, observability, and dependable developer platforms.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-18',
    title: 'Cybersecurity Fundamentals',
    url: 'https://www.youtube.com/results?search_query=cybersecurity+fundamentals+networking+ethical+hacking+beginner',
    provider: 'YouTube',
    category: 'Cybersecurity',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Builds a practical foundation in networks, threats, identity, secure habits, and security labs.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-19',
    title: 'Data Engineering Roadmap',
    url: 'https://www.youtube.com/results?search_query=data+engineering+roadmap+pipelines+Spark+Airflow',
    provider: 'YouTube',
    category: 'Data Engineering',
    level: 'Intermediate',
    duration: 'Search playlist',
    whyRecommended: 'Explains how reliable data moves through pipelines, warehouses, orchestration, and quality checks.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-20',
    title: 'Database Engineering Essentials',
    url: 'https://www.youtube.com/results?search_query=database+engineering+SQL+data+modeling+performance',
    provider: 'YouTube',
    category: 'Database Engineering',
    level: 'Intermediate',
    duration: 'Search playlist',
    whyRecommended: 'Covers relational design, SQL depth, indexing, transactions, performance, and distributed data concepts.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-21',
    title: 'Product Design and UX/UI Foundations',
    url: 'https://www.youtube.com/results?search_query=product+design+UX+UI+Figma+user+research+roadmap',
    provider: 'YouTube',
    category: 'Product Design',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Covers user research, information architecture, wireframes, prototyping, critique, and design systems.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-22',
    title: 'Product Management Fundamentals',
    url: 'https://www.youtube.com/results?search_query=product+management+fundamentals+roadmap+discovery+roadmaps',
    provider: 'YouTube',
    category: 'Product Management',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Introduces customer discovery, product strategy, prioritization, roadmaps, metrics, and team alignment.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-23',
    title: 'QA and Test Automation Roadmap',
    url: 'https://www.youtube.com/results?search_query=QA+test+automation+roadmap+Playwright+Cypress+API+testing',
    provider: 'YouTube',
    category: 'QA & Test Automation',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Builds quality thinking from test strategy and bug reports to browser, API, and continuous testing.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-24',
    title: 'Blockchain Development Foundations',
    url: 'https://www.youtube.com/results?search_query=blockchain+development+Solidity+smart+contracts+Web3+beginner',
    provider: 'YouTube',
    category: 'Blockchain Development',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Explains wallets, transactions, smart contracts, security, and the architecture behind Web3 applications.',
    cost: 'Free',
    active: true,
    isIntroVideo: true
  },
  {
    id: 'res-25',
    title: 'Game Development Roadmap',
    url: 'https://www.youtube.com/results?search_query=game+development+roadmap+Unity+Unreal+beginner',
    provider: 'YouTube',
    category: 'Game Development',
    level: 'Beginner',
    duration: 'Search playlist',
    whyRecommended: 'Introduces game loops, design, engines, scripting, level building, polish, and publishing a playable project.',
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
