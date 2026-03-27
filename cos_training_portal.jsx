import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, LayoutDashboard, ClipboardCheck, BarChart3, Users, ShieldCheck, Search, ArrowRight, CheckCircle2, Circle, Building2, BrainCircuit, PhoneCall, Printer, Target } from 'lucide-react';

const modules = [
  {
    id: 'foundation',
    title: 'COS Foundation',
    icon: Building2,
    progress: 100,
    duration: '18 min',
    lesson: 'Learn the COS story, what problems we solve, and how to position our value in the market.',
    bullets: [
      'Company story and market reputation',
      'Problems we solve: erratic billing, outdated equipment, poor service',
      'Why clients switch to COS',
    ],
    quiz: [
      {
        question: 'What are the top three problems COS solves?',
        options: ['Marketing gaps, branding, software bugs', 'Erratic billing, outdated equipment, poor service', 'Hiring issues, payroll, taxes'],
        answer: 1,
      },
      {
        question: 'What best describes the COS position in the market?',
        options: ['Lowest-price national call center', 'Local, responsive, relationship-driven office technology partner', 'Retail office furniture provider'],
        answer: 1,
      },
    ],
  },
  {
    id: 'sales-flow',
    title: 'The Sales Flow',
    icon: Target,
    progress: 84,
    duration: '22 min',
    lesson: 'Prospect, connect, discover, present, close, and follow up with the right cadence.',
    bullets: [
      'Cold outreach and warm follow-up',
      'Discovery before presenting',
      'Moving naturally toward the close',
    ],
    quiz: [
      {
        question: 'What comes after discovery?',
        options: ['Prospect', 'Present', 'Abandon the lead'],
        answer: 1,
      },
      {
        question: 'What happens if a rep skips discovery?',
        options: ['The close usually gets weaker', 'The deal gets easier', 'Pricing improves'],
        answer: 0,
      },
    ],
  },
  {
    id: 'discovery',
    title: 'Discovery Questions',
    icon: PhoneCall,
    progress: 42,
    duration: '16 min',
    lesson: 'Uncover pain, ask better follow-up questions, and lead consultative conversations.',
    bullets: [
      'Ask what is frustrating the client',
      'Understand downtime and hidden cost',
      'Expand short answers with killer follow-ups',
    ],
    quiz: [
      {
        question: 'What is the goal of discovery?',
        options: ['Pitch product features quickly', 'Find real pain points and buying reasons', 'Rush to price'],
        answer: 1,
      },
      {
        question: 'Which question uncovers pain best?',
        options: ['Do you need a copier?', 'What is frustrating you about your current setup?', 'What color machine do you prefer?'],
        answer: 1,
      },
    ],
  },
  {
    id: 'objections',
    title: 'Handling Objections',
    icon: ShieldCheck,
    progress: 15,
    duration: '19 min',
    lesson: 'Respond to “we’re all set,” “send me info,” and budget hesitation with confidence.',
    bullets: [
      'Reframe instead of retreating',
      'Keep the conversation alive',
      'Anchor value before price',
    ],
    quiz: [
      {
        question: 'A client says “we’re all set.” What is the best next move?',
        options: ['End the conversation', 'Ask what they like most about their current setup', 'Discount immediately'],
        answer: 1,
      },
      {
        question: '“Send me info” most often means:',
        options: ['They are brushing you off and need re-engagement', 'They are ready to buy today', 'They want service scheduled'],
        answer: 0,
      },
    ],
  },
  {
    id: 'products',
    title: 'Product Knowledge',
    icon: Printer,
    progress: 0,
    duration: '25 min',
    lesson: 'Learn the difference between printers, MFPs, and copiers, plus the Sharp lineup overview.',
    bullets: [
      'Printer vs MFP vs copier',
      'How to identify a machine quickly',
      'What goes into every copier proposal',
    ],
    quiz: [
      {
        question: 'What best defines an MFP?',
        options: ['Print only', 'Multi-function with print, scan, copy, and sometimes fax', 'A toner cartridge'],
        answer: 1,
      },
      {
        question: 'A higher-volume client usually needs:',
        options: ['A desktop-only device', 'A better-fit mid or higher-volume copier/MFP', 'No equipment'],
        answer: 1,
      },
    ],
  },
  {
    id: 'cadence',
    title: 'Daily Cadence + KPIs',
    icon: BarChart3,
    progress: 0,
    duration: '14 min',
    lesson: 'Set daily expectations around calls, activities, opportunities, and follow-up discipline.',
    bullets: [
      '50+ calls per day target',
      'How to log meaningful activity',
      'Metrics that move deals',
    ],
    quiz: [
      {
        question: 'What counts as an activity?',
        options: ['A real client touchpoint logged correctly', 'Thinking about a prospect', 'An unlogged voicemail'],
        answer: 0,
      },
      {
        question: 'What daily call count is the standard here?',
        options: ['10', '25', '50+'],
        answer: 2,
      },
    ],
  },
];

const reps = [
  { name: 'Shyanne', role: 'Sales Rep', progress: 88, score: 92, status: 'Strong' },
  { name: 'Alex', role: 'Sales Rep', progress: 54, score: 79, status: 'In Progress' },
  { name: 'Jordan', role: 'Sales Rep', progress: 21, score: 64, status: 'Needs Coaching' },
  { name: 'Taylor', role: 'CSR', progress: 73, score: 85, status: 'Strong' },
];

function Sidebar({ current, setCurrent }) {
  const items = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['training', 'Training', BookOpen],
    ['quizzes', 'Quizzes', ClipboardCheck],
    ['analytics', 'Analytics', BarChart3],
    ['team', 'Team', Users],
  ];

  return (
    <div className="w-full lg:w-72 bg-slate-950 text-white rounded-3xl p-5 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Creative Office Solutions</div>
          <div className="text-lg font-semibold">Training Portal</div>
        </div>
      </div>
      <div className="space-y-2">
        {items.map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setCurrent(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${current === key ? 'bg-white text-slate-950' : 'bg-white/5 hover:bg-white/10'}`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="h-4 w-4" />
          <span className="font-medium text-sm">COS AI Console</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Future feature for sales coaching, objection help, and instant answers in your tone.
        </p>
      </div>
    </div>
  );
}

function LoginView({ onEnter }) {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center min-h-[85vh]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-4 rounded-full px-4 py-1 bg-white/10 text-white hover:bg-white/10">Internal Onboarding + Training</Badge>
          <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
            The COS platform that turns new hires into producers.
          </h1>
          <p className="text-slate-300 mt-5 text-lg leading-relaxed max-w-xl">
            Login-based training by department, quizzes that lock in retention, manager visibility, and a clean path from onboarding to performance.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-xl">
            {[
              'Sales modules + quizzes',
              'Admin dashboards',
              'Department consoles',
              'Future AI coaching layer',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-100 text-sm">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="rounded-[28px] border-0 shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Employee Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Work email" className="h-12 rounded-2xl" />
              <Input placeholder="Password" type="password" className="h-12 rounded-2xl" />
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-2xl justify-start">Sales</Button>
                <Button variant="outline" className="h-12 rounded-2xl justify-start">Service</Button>
                <Button variant="outline" className="h-12 rounded-2xl justify-start">CSR</Button>
                <Button variant="outline" className="h-12 rounded-2xl justify-start">Accounting</Button>
              </div>
              <Button onClick={onEnter} className="h-12 rounded-2xl w-full text-base">
                Enter Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-slate-500">Vision demo: this shows the user experience, module flow, and console layout for your live site.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardHome({ setCurrent, setSelectedModule }) {
  const overall = Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length);
  const nextModule = modules.find((m) => m.progress < 100) || modules[0];

  return (
    <div className="space-y-6">
      <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6">
        <Card className="rounded-[28px] border-0 shadow-lg bg-gradient-to-br from-slate-950 to-slate-800 text-white">
          <CardContent className="p-7">
            <div className="text-sm text-slate-300 mb-2">Welcome back</div>
            <h2 className="text-3xl font-semibold mb-3">Sales Rep Training Console</h2>
            <p className="text-slate-300 max-w-2xl mb-6">
              Build product confidence, sharpen objections, and give new hires a clean path from training into live conversations.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-sm text-slate-300">Completion</div><div className="text-2xl font-semibold mt-1">{overall}%</div></div>
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-sm text-slate-300">Quiz Average</div><div className="text-2xl font-semibold mt-1">86%</div></div>
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-sm text-slate-300">Open Modules</div><div className="text-2xl font-semibold mt-1">{modules.filter((m) => m.progress < 100).length}</div></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-2xl" onClick={() => { setSelectedModule(nextModule); setCurrent('training'); }}>
                Continue {nextModule.title}
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => setCurrent('analytics')}>
                Open Manager Console
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Resume training',
              'Review quizzes',
              'Check team activity',
              'Open sales resources',
            ].map((item) => (
              <button key={item} className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-sm font-medium">{item}</button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {modules.slice(0, 3).map((mod) => {
          const Icon = mod.icon;
          return (
            <Card key={mod.id} className="rounded-[28px] border-0 shadow-lg cursor-pointer hover:-translate-y-1 transition" onClick={() => { setSelectedModule(mod); setCurrent('training'); }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                  <Badge variant="secondary" className="rounded-full">{mod.duration}</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{mod.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{mod.lesson}</p>
                <Progress value={mod.progress} className="h-2 mb-2" />
                <div className="text-xs text-slate-500">{mod.progress}% complete</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TrainingView({ selectedModule, setSelectedModule }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-6">
        <Card className="xl:w-80 rounded-[28px] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Sales Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {modules.map((mod) => {
              const Icon = mod.icon;
              const active = selectedModule.id === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`w-full text-left p-4 rounded-2xl transition border ${active ? 'bg-slate-950 text-white border-slate-950' : 'bg-white hover:bg-slate-50 border-slate-200'}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{mod.title}</span>
                    </div>
                    <span className="text-xs">{mod.progress}%</span>
                  </div>
                  <Progress value={mod.progress} className="h-2" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="lesson" className="space-y-6">
            <TabsList className="rounded-2xl p-1">
              <TabsTrigger value="lesson" className="rounded-2xl">Lesson</TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-2xl">Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="lesson">
              <Card className="rounded-[28px] border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{selectedModule.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-slate-700 leading-relaxed">{selectedModule.lesson}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedModule.bullets.map((bullet) => (
                      <div key={bullet} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{bullet}</div>
                    ))}
                  </div>
                  <div className="rounded-3xl bg-slate-950 text-white p-6">
                    <div className="text-sm text-slate-300 mb-2">Coaching Note</div>
                    <p className="leading-relaxed text-slate-100">
                      This section is where your reps stop sounding scripted and start sounding consultative. Every lesson should move them closer to confidence in front of a real client.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz">
              <Card className="rounded-[28px] border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{selectedModule.title} Quiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedModule.quiz.map((q, i) => (
                    <div key={q.question} className="rounded-3xl border border-slate-200 p-5">
                      <div className="text-sm text-slate-500 mb-3">Question {i + 1}</div>
                      <h4 className="font-medium mb-4">{q.question}</h4>
                      <div className="space-y-3">
                        {q.options.map((option, idx) => (
                          <div key={option} className={`rounded-2xl p-4 border flex items-start gap-3 ${idx === q.answer ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                            {idx === q.answer ? <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600" /> : <Circle className="h-5 w-5 mt-0.5 text-slate-400" />}
                            <span className="text-sm text-slate-700">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button className="rounded-2xl">Submit Quiz</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function QuizzesView() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {modules.map((mod) => (
        <Card key={mod.id} className="rounded-[28px] border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{mod.title}</h3>
              <Badge className="rounded-full">{mod.quiz.length} Questions</Badge>
            </div>
            <p className="text-sm text-slate-600 mb-4">Scenario-based review to lock in the lesson and surface where coaching is needed.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Passing score: 80%</span>
              <Button variant="outline" className="rounded-2xl">Open Quiz</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AnalyticsView() {
  const avgProgress = Math.round(reps.reduce((sum, rep) => sum + rep.progress, 0) / reps.length);
  const avgScore = Math.round(reps.reduce((sum, rep) => sum + rep.score, 0) / reps.length);
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[
          ['Active Learners', reps.length.toString()],
          ['Avg Completion', `${avgProgress}%`],
          ['Avg Quiz Score', `${avgScore}%`],
          ['Needs Coaching', reps.filter((r) => r.status === 'Needs Coaching').length.toString()],
        ].map(([label, value]) => (
          <Card key={label} className="rounded-[28px] border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="text-3xl font-semibold mt-2">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[28px] border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Manager Console</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Progress</th>
                  <th className="pb-3 pr-4">Quiz Score</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {reps.map((rep) => (
                  <tr key={rep.name} className="border-b last:border-b-0">
                    <td className="py-4 pr-4 font-medium">{rep.name}</td>
                    <td className="py-4 pr-4 text-slate-600">{rep.role}</td>
                    <td className="py-4 pr-4 w-64">
                      <div className="flex items-center gap-3">
                        <Progress value={rep.progress} className="h-2" />
                        <span className="text-xs text-slate-500 w-10">{rep.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{rep.score}%</td>
                    <td className="py-4 pr-4">
                      <Badge variant={rep.status === 'Strong' ? 'default' : 'secondary'} className="rounded-full">{rep.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamView() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => reps.filter((r) => `${r.name} ${r.role} ${r.status}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employee or department" className="pl-10 h-12 rounded-2xl" />
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((rep) => (
          <Card key={rep.name} className="rounded-[28px] border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{rep.name}</h3>
                  <p className="text-sm text-slate-500">{rep.role}</p>
                </div>
                <Badge className="rounded-full">{rep.status}</Badge>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <div className="flex justify-between mb-1"><span>Training Progress</span><span>{rep.progress}%</span></div>
                  <Progress value={rep.progress} className="h-2" />
                </div>
                <div className="flex justify-between"><span>Quiz Average</span><span>{rep.score}%</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function CosTrainingPortalMockup() {
  const [entered, setEntered] = useState(false);
  const [current, setCurrent] = useState('dashboard');
  const [selectedModule, setSelectedModule] = useState(modules[0]);

  if (!entered) return <LoginView onEnter={() => setEntered(true)} />;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto lg:flex gap-6">
        <Sidebar current={current} setCurrent={setCurrent} />
        <div className="flex-1 mt-6 lg:mt-0">
          {current === 'dashboard' && <DashboardHome setCurrent={setCurrent} setSelectedModule={setSelectedModule} />}
          {current === 'training' && <TrainingView selectedModule={selectedModule} setSelectedModule={setSelectedModule} />}
          {current === 'quizzes' && <QuizzesView />}
          {current === 'analytics' && <AnalyticsView />}
          {current === 'team' && <TeamView />}
        </div>
      </div>
    </div>
  );
}
