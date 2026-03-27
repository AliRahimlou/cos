import type { Assessment, ContentBlock, Course, Question, QuestionChoice } from "@/lib/onboarding/types";

const buildChoices = (items: string[]): QuestionChoice[] =>
  items.map((text, index) => ({
    id: String.fromCharCode(97 + index),
    text,
  }));

const paragraph = (text: string): ContentBlock => ({
  type: "paragraph",
  text,
});

const bullets = (items: string[]): ContentBlock => ({
  type: "bullets",
  items,
});

const checklist = (items: string[]): ContentBlock => ({
  type: "checklist",
  items,
});

const callout = (text: string, title?: string): ContentBlock => ({
  type: "callout",
  title,
  text,
});

const table = (headers: string[], rows: string[][]): ContentBlock => ({
  type: "table",
  headers,
  rows,
});

const image = (
  src: string,
  alt: string,
  caption: string,
  width: number,
  height: number,
): ContentBlock => ({
  type: "image",
  src,
  alt,
  caption,
  width,
  height,
});

const video = (
  url: string,
  title: string,
  caption?: string,
  poster?: string,
): ContentBlock => ({
  type: "video",
  url,
  title,
  caption,
  poster,
});

const quote = (text: string): ContentBlock => ({
  type: "quote",
  text,
});

const single = ({
  id,
  prompt,
  options,
  answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
}: {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  sourceSlides: number[];
  difficulty?: "easy" | "medium" | "hard";
  remediationLessonId?: string;
}): Question => ({
  id,
  type: "single",
  prompt,
  choices: buildChoices(options),
  correctAnswer: answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
});

const scenario = ({
  id,
  prompt,
  options,
  answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
}: {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  sourceSlides: number[];
  difficulty?: "easy" | "medium" | "hard";
  remediationLessonId?: string;
}): Question => ({
  id,
  type: "scenario",
  prompt,
  choices: buildChoices(options),
  correctAnswer: answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
});

const multiple = ({
  id,
  prompt,
  options,
  answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
}: {
  id: string;
  prompt: string;
  options: string[];
  answer: string[];
  explanation: string;
  sourceSlides: number[];
  difficulty?: "easy" | "medium" | "hard";
  remediationLessonId?: string;
}): Question => ({
  id,
  type: "multiple",
  prompt,
  choices: buildChoices(options),
  correctAnswer: answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
});

const trueFalse = ({
  id,
  prompt,
  answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
}: {
  id: string;
  prompt: string;
  answer: boolean;
  explanation: string;
  sourceSlides: number[];
  difficulty?: "easy" | "medium" | "hard";
  remediationLessonId?: string;
}): Question => ({
  id,
  type: "true_false",
  prompt,
  correctAnswer: answer,
  explanation,
  sourceSlides,
  difficulty,
  remediationLessonId,
});

const assessment = (
  id: string,
  title: string,
  description: string,
  passingScore: number,
  questions: Question[],
): Assessment => ({
  id,
  title,
  description,
  passingScore,
  questions,
});

export const salesRepOnboardingCourse: Course = {
  id: "sales-rep-onboarding",
  title: "Sales Rep Onboarding",
  description:
    "A content-driven onboarding course built directly from the COS sales rep training deck, with knowledge checks, module quizzes, and a final certification assessment.",
  audience: "New Creative Office Solutions sales representatives",
  estimatedMinutes: 150,
  modules: [
    {
      id: "cos-foundations",
      title: "Welcome to COS",
      description:
        "Meet the company, understand the history behind the business, and align to the advisor mindset expected from every sales rep.",
      estimatedMinutes: 18,
      sourceSlides: [1, 2, 3, 4],
      icon: "building2",
      lessons: [
        {
          id: "welcome-history",
          title: "Company Story and Orientation",
          description:
            "The opening slides establish the company background, highlight Bob Fox's business record, and point new hires to the welcome video.",
          sourceSlides: [1, 2, 3],
          objectives: [
            "Summarize the company story presented in the opening deck slides.",
            "Identify the history points that support COS credibility with prospects.",
            "Use the welcome video as part of initial rep orientation.",
          ],
          keyTakeaways: [
            "Bob Fox founded multiple businesses beginning in 1988.",
            "Laser Life Inc. was sold to Pitney Bowes in 2007.",
            "The deck ties service excellence and environmental innovation directly to the COS story.",
          ],
          content: [
            paragraph(
              "The onboarding deck opens by introducing COS as a family-owned business with a history rooted in entrepreneurship, customer service, and practical innovation around print technology."
            ),
            bullets([
              "Bob Fox founded multiple successful companies starting in 1988.",
              "Laser Life Inc. was sold to Pitney Bowes in 2007.",
              "The company story highlights six consecutive Consumers Choice Awards.",
              "Environmental innovation appears early in the deck through toner and plastic recycling concepts tied to laser printing.",
            ]),
            image(
              "/onboarding/sales-rep/deck-assets/slide-02-1-image2.png",
              "Historic image of the first COS office from 1988.",
              "The deck uses the first office image to reinforce the long-term, family-owned history behind COS.",
              709,
              501,
            ),
            video(
              "https://youtu.be/0OfzgYTEyeA",
              "COS welcome video",
              "The slide 3 welcome video is now playable directly inside the onboarding lesson so reps can complete orientation without leaving the app.",
            ),
            callout(
              "Slide 3 points reps to the welcome video shown above. Keep that asset available during orientation so the deck's intended introduction remains intact.",
              "Orientation asset",
            ),
          ],
          knowledgeChecks: [
            single({
              id: "kc-welcome-history-founder",
              prompt: "Which milestone from the deck anchors the COS history story?",
              options: [
                "A merger with Xerox in 2014",
                "Bob Fox beginning multiple ventures in 1988",
                "A national rebrand away from office technology",
                "A transition from service into office furniture",
              ],
              answer: "b",
              explanation:
                "The history slide starts with Bob Fox founding multiple successful companies beginning in 1988, which frames the rest of the company story.",
              sourceSlides: [2],
              remediationLessonId: "welcome-history",
            }),
          ],
        },
        {
          id: "sales-rep-role",
          title: "Your Role as a COS Sales Rep",
          description:
            "The role slide sets the behavioral standard for how COS expects reps to show up in customer conversations.",
          sourceSlides: [4],
          objectives: [
            "Adopt the advisor mindset described in the deck.",
            "Lead conversations with questions instead of assumptions.",
            "Create clarity and momentum for prospects at every step.",
          ],
          keyTakeaways: [
            "A COS sales rep is positioned as an advisor, not an order-taker.",
            "Question-led conversations are the standard.",
            "The role is to create momentum, not just gather requests.",
          ],
          content: [
            paragraph(
              "The deck keeps the sales rep role simple and specific: do not act like an order-taker. Reps are expected to guide, ask, and create movement."
            ),
            checklist([
              "Be the advisor, not the order-taker.",
              "Lead with questions, not assumptions.",
              "Create clarity and momentum for every prospect.",
            ]),
            quote(
              "Lead with questions, not assumptions."
            ),
            callout(
              "This role definition should shape how reps position COS in discovery, objection handling, and solution design.",
              "Coaching note",
            ),
          ],
          knowledgeChecks: [
            multiple({
              id: "kc-sales-role-principles",
              prompt: "Which behaviors are explicitly called out on the role slide?",
              options: [
                "Lead with questions",
                "Be the advisor",
                "Wait for the customer to define the next step",
                "Create clarity and momentum",
              ],
              answer: ["a", "b", "d"],
              explanation:
                "The role slide highlights three expectations: be the advisor, lead with questions, and create clarity and momentum.",
              sourceSlides: [4],
              remediationLessonId: "sales-rep-role",
            }),
          ],
        },
      ],
      quiz: assessment(
        "quiz-cos-foundations",
        "Module 1 Quiz: Welcome to COS",
        "Checks understanding of the company story and the expected COS sales mindset.",
        80,
        [
          single({
            id: "m1-q1",
            prompt: "According to the deck, when did Bob Fox begin founding successful companies?",
            options: ["1978", "1988", "1998", "2007"],
            answer: "b",
            explanation:
              "The history slide states that Bob Fox founded multiple successful companies starting in 1988.",
            sourceSlides: [2],
            remediationLessonId: "welcome-history",
          }),
          single({
            id: "m1-q2",
            prompt: "Laser Life Inc. was sold to which corporation?",
            options: ["Sharp", "HP", "Pitney Bowes", "Canon"],
            answer: "c",
            explanation:
              "The deck says Laser Life Inc. was sold to Pitney Bowes in 2007.",
            sourceSlides: [2],
            remediationLessonId: "welcome-history",
          }),
          trueFalse({
            id: "m1-q3",
            prompt: "The deck uses the Consumers Choice Award to reinforce COS service credibility.",
            answer: true,
            explanation:
              "The company history slide calls out six consecutive Consumers Choice Awards to emphasize customer loyalty and satisfaction.",
            sourceSlides: [2],
            remediationLessonId: "welcome-history",
          }),
          scenario({
            id: "m1-q4",
            prompt: "A new rep says their job is mostly to quote what the customer asks for. Which response best matches the deck?",
            options: [
              "That is correct because customers already know what they need.",
              "The rep should act as an advisor rather than an order-taker.",
              "The rep should focus only on pricing speed.",
              "The rep should avoid asking questions to keep the conversation short.",
            ],
            answer: "b",
            explanation:
              "Slide 4 explicitly says the COS sales rep should be the advisor, not the order-taker.",
            sourceSlides: [4],
            remediationLessonId: "sales-rep-role",
          }),
          multiple({
            id: "m1-q5",
            prompt: "Which ideas are part of the COS history story in the deck?",
            options: [
              "Customer service excellence",
              "Environmental innovation",
              "A shift away from print technology",
              "Leadership built around customer happiness",
            ],
            answer: ["a", "b", "d"],
            explanation:
              "The history slide highlights service excellence, environmental innovation, and a leadership style built around customer happiness.",
            sourceSlides: [2],
            remediationLessonId: "welcome-history",
          }),
        ],
      ),
    },
    {
      id: "core-sales-motion",
      title: "Core Sales Motion",
      description:
        "Learn the COS conversation flow, the market value points to reinforce, and the day-to-day cadence expected from a sales rep.",
      estimatedMinutes: 20,
      sourceSlides: [5, 6, 7, 8, 9],
      icon: "target",
      lessons: [
        {
          id: "sales-flow-and-value",
          title: "Sales Flow and Market Value",
          description:
            "Slides 5 and 6 define how the rep should move a conversation forward and what value statements support that motion.",
          sourceSlides: [5, 6],
          objectives: [
            "Sequence the conversation steps shown in the sales flow slide.",
            "Recognize the core market value statements the deck expects reps to use.",
            "Use value positioning to support, not replace, discovery.",
          ],
          keyTakeaways: [
            "The deck flow is Connect, Label, Ask, Bridge, and Close.",
            "COS positions speed, service culture, strong technology, and nationwide support with local attention.",
            "The value story is meant to reinforce consultative selling, not shortcut it.",
          ],
          content: [
            paragraph(
              "The sales flow slide gives reps a usable talk track for live conversations, while the market value slide defines what differentiating points should show up once the problem is clear."
            ),
            checklist([
              "Connect with a warm tone and real interest.",
              "Label the gap or issue the customer is facing.",
              "Ask questions that pull information instead of pushing a pitch.",
              "Bridge to a path forward.",
              "Close by making the next step easy to say yes to.",
            ]),
            bullets([
              "Fast 1-hour virtual contact and 3-hour onsite standard.",
              "Family-owned, service-first culture.",
              "Top-tier Sharp and HP technology.",
              "Nationwide support with local attention.",
            ]),
            callout(
              "Use the flow to move the conversation and the value statements to reinforce why COS is a credible solution once the gap is understood.",
              "How the slides work together",
            ),
          ],
          knowledgeChecks: [
            single({
              id: "kc-sales-flow-step",
              prompt: "Which step follows Label in the sales flow slide?",
              options: ["Close", "Ask", "Prospect", "Quote"],
              answer: "b",
              explanation:
                "The slide orders the flow as Connect, Label, Ask, Bridge, and Close.",
              sourceSlides: [5],
              remediationLessonId: "sales-flow-and-value",
            }),
          ],
        },
        {
          id: "discovery-objections-cadence",
          title: "Discovery, Objections, and Daily Cadence",
          description:
            "The next slides combine discovery prompts, the objection-handling posture, and the daily operating rhythm expected from reps.",
          sourceSlides: [7, 8, 9],
          objectives: [
            "Use the discovery prompts in the deck to uncover workflow pain.",
            "Follow the acknowledge, clarify, and guide objection sequence.",
            "Recall the daily cadence metrics shown in training.",
          ],
          keyTakeaways: [
            "Discovery starts with workflow, frustration, and priority questions.",
            "Objection handling begins with acknowledgement rather than resistance.",
            "Daily execution expectations include touches, proposals, pipeline review, and early follow-up.",
          ],
          content: [
            paragraph(
              "COS combines conversation quality and activity discipline. The discovery and objection slides focus on how the rep talks, while the cadence slide shows how often the rep should execute."
            ),
            bullets([
              "Walk me through your current workflow?",
              "What frustrates your team the most with your equipment?",
              "If you could fix one issue today, what would it be?",
            ]),
            checklist([
              "Acknowledge the objection instead of fighting it.",
              "Clarify what the customer really means.",
              "Guide the conversation toward the solution to the true problem.",
            ]),
            table(
              ["Cadence expectation", "Deck detail"],
              [
                ["Touches per day", "40-60"],
                ["Proposals per week", "3-5"],
                ["Pipeline review", "Every morning"],
                ["Follow-up timing", "Before 12pm"],
              ],
            ),
          ],
          knowledgeChecks: [
            scenario({
              id: "kc-discovery-cadence-scenario",
              prompt: "A prospect says, 'We are mostly okay, but things get frustrating sometimes.' What is the best next move based on the training slides?",
              options: [
                "Go straight to pricing to keep momentum",
                "Ask what frustrates the team most about the current equipment",
                "Assume the issue is toner cost and present a compatible toner pitch",
                "Skip discovery and move to close",
              ],
              answer: "b",
              explanation:
                "Slide 7 explicitly prompts reps to ask what frustrates the team most, which helps move from a vague comment into real discovery.",
              sourceSlides: [7, 8, 9],
              remediationLessonId: "discovery-objections-cadence",
            }),
          ],
        },
      ],
      quiz: assessment(
        "quiz-core-sales-motion",
        "Module 2 Quiz: Core Sales Motion",
        "Validates the rep's understanding of the conversation flow, value positioning, and cadence standards.",
        80,
        [
          single({
            id: "m2-q1",
            prompt: "What is the first step named on the sales flow slide?",
            options: ["Connect", "Ask", "Bridge", "Close"],
            answer: "a",
            explanation:
              "Slide 5 starts the flow with Connect, followed by Label, Ask, Bridge, and Close.",
            sourceSlides: [5],
            remediationLessonId: "sales-flow-and-value",
          }),
          single({
            id: "m2-q2",
            prompt: "Which statement is part of COS market value in the deck?",
            options: [
              "Eight-hour onsite response standard",
              "Family-owned, service-first culture",
              "Single-brand support only",
              "Discount-led market positioning",
            ],
            answer: "b",
            explanation:
              "Slide 6 lists family-owned, service-first culture as one of the core market value points.",
            sourceSlides: [6],
            remediationLessonId: "sales-flow-and-value",
          }),
          multiple({
            id: "m2-q3",
            prompt: "Which items appear on the daily cadence slide?",
            options: [
              "40-60 touches per day",
              "3-5 proposals per week",
              "Follow-ups before 12pm",
              "Quarterly pipeline review",
            ],
            answer: ["a", "b", "c"],
            explanation:
              "The cadence slide calls for 40-60 touches per day, 3-5 proposals per week, a morning pipeline check, and follow-ups before 12pm.",
            sourceSlides: [9],
            remediationLessonId: "discovery-objections-cadence",
          }),
          scenario({
            id: "m2-q4",
            prompt: "A customer raises an objection. What should the rep do first according to the deck?",
            options: [
              "Counter the statement immediately",
              "Offer a discount",
              "Acknowledge the objection",
              "Move on to another product",
            ],
            answer: "c",
            explanation:
              "Slide 8 starts the objection flow with acknowledgement, then clarification, then guidance.",
            sourceSlides: [8],
            remediationLessonId: "discovery-objections-cadence",
          }),
          single({
            id: "m2-q5",
            prompt: "Which discovery prompt is explicitly listed in the training deck?",
            options: [
              "How many reps are on your payroll?",
              "Walk me through your current workflow",
              "What is your ideal office paint color?",
              "Who designed your last proposal?",
            ],
            answer: "b",
            explanation:
              "The discovery slide leads with 'Walk me through your current workflow?'",
            sourceSlides: [7],
            remediationLessonId: "discovery-objections-cadence",
          }),
        ],
      ),
    },
    {
      id: "market-positioning",
      title: "Positioning COS in the Market",
      description:
        "Understand the account profile, the trigger conditions that bring customers to COS, and the differentiators reps can use to position the company clearly.",
      estimatedMinutes: 16,
      sourceSlides: [10, 11, 12, 13],
      icon: "users",
      lessons: [
        {
          id: "customer-triggers",
          title: "Customer Profile and Trigger Conditions",
          description:
            "Slides 10 and 11 explain the types of accounts COS serves and the operational pain that causes those customers to look for help.",
          sourceSlides: [10, 11],
          objectives: [
            "Describe the customer profile named in the deck.",
            "Identify the common pain triggers that bring customers to COS.",
            "Connect those trigger conditions to discovery conversations.",
          ],
          keyTakeaways: [
            "COS is positioned as a Metro Atlanta, family-owned office equipment provider serving mid-large accounts.",
            "The deck cites 50 to 500 employee accounts using print and imaging technology.",
            "Customers typically engage COS because their current environment feels costly, unstable, slow, or difficult to manage.",
          ],
          content: [
            paragraph(
              "The deck frames COS around real-world operational frustration. Reps are not expected to create artificial urgency; they are expected to connect with accounts already feeling the strain of print and imaging issues."
            ),
            bullets([
              "Metro Atlanta based and family-owned.",
              "Serving mid-large accounts in the 50 to 500 range.",
              "Focused on businesses using print and imaging technology.",
              "Customers come to COS when the equipment fleet feels out of control.",
            ]),
            checklist([
              "Erratic bills and fluctuations",
              "Dissatisfaction with current vendors or leases",
              "Support needs across multiple brands",
              "Eco-friendly solution requirements",
              "Downtime and technical issues",
              "Long lead times for toner or consumables",
              "Need for managed print and imaging solutions",
            ]),
          ],
          knowledgeChecks: [
            multiple({
              id: "kc-customer-triggers",
              prompt: "Which situations are listed as reasons customers come to COS?",
              options: [
                "Erratic bills and fluctuations",
                "Need for managed print and imaging solutions",
                "A desire to eliminate all office technology",
                "Long lead times for toner and consumables",
              ],
              answer: ["a", "b", "d"],
              explanation:
                "The deck points to billing instability, managed print needs, and toner lead-time issues among the triggers that bring customers to COS.",
              sourceSlides: [10, 11],
              remediationLessonId: "customer-triggers",
            }),
          ],
        },
        {
          id: "offerings-differentiators",
          title: "Offerings and Differentiators",
          description:
            "The next slides summarize the broad offering set and the factors reps can use to explain why COS is different.",
          sourceSlides: [12, 13],
          objectives: [
            "Recall the offering themes stated in the deck.",
            "Use the differentiator list to position COS with confidence.",
            "Understand how the WOW concept supports the customer experience story.",
          ],
          keyTakeaways: [
            "COS emphasizes cost-effective, efficiency-driven solutions with nationwide deployment.",
            "Environmental responsibility is part of the service story, not a side note.",
            "In-house manufacturing, logistics, service, and leasing flexibility all appear as differentiators in the deck.",
          ],
          content: [
            paragraph(
              "The deck does not position COS as just another copier provider. It presents a broader operating model that combines service, supplies, logistics, fleet management, and financing flexibility."
            ),
            bullets([
              "Cost-effective, efficiency-driven solutions",
              "Nationwide deployment",
              "Environmental responsibility integrated into all services",
            ]),
            checklist([
              "Complete deployment, service, monitoring, and supply access",
              "In-house eco-friendly toner manufacturing",
              "Own leasing company for flexible agreements",
              "Fleet management that frees human capital",
              "In-house logistics and service for speed",
              "WOW concept used throughout the customer experience",
            ]),
            callout(
              "Use these differentiators when prospects ask why they should change vendors. The deck gives reps a grounded answer beyond price alone.",
              "Positioning guidance",
            ),
          ],
          knowledgeChecks: [
            scenario({
              id: "kc-offerings-differentiators",
              prompt: "A prospect asks what makes COS different from a dealer that only brokers equipment. Which answer best matches the deck?",
              options: [
                "COS only sells one OEM line at the lowest price",
                "COS combines in-house toner manufacturing, logistics, service, and leasing flexibility",
                "COS avoids managed print and focuses only on desktop printers",
                "COS requires customers to source service and supplies elsewhere",
              ],
              answer: "b",
              explanation:
                "Slide 13 emphasizes an integrated operating model that includes in-house toner manufacturing, in-house logistics and service, and flexible agreements through an owned leasing company.",
              sourceSlides: [12, 13],
              remediationLessonId: "offerings-differentiators",
            }),
          ],
        },
      ],
      quiz: assessment(
        "quiz-market-positioning",
        "Module 3 Quiz: Positioning COS",
        "Confirms the rep can describe the target customer profile and the differentiators that define COS.",
        80,
        [
          single({
            id: "m3-q1",
            prompt: "What account size range is listed on the COS Power Pages slide?",
            options: ["5 to 25", "25 to 100", "50 to 500", "500 to 5,000"],
            answer: "c",
            explanation:
              "Slide 10 says COS serves mid-large accounts in the 50 to 500 range.",
            sourceSlides: [10],
            remediationLessonId: "customer-triggers",
          }),
          single({
            id: "m3-q2",
            prompt: "Which issue is named as a reason customers come to COS?",
            options: [
              "They want to move away from print entirely",
              "They are frustrated by erratic bills and fluctuations",
              "They need a cloud accounting platform",
              "They want to stop all onsite service",
            ],
            answer: "b",
            explanation:
              "Slide 11 explicitly lists erratic bills and fluctuations as a trigger.",
            sourceSlides: [11],
            remediationLessonId: "customer-triggers",
          }),
          single({
            id: "m3-q3",
            prompt: "Which offering statement appears in the deck?",
            options: [
              "Environmental responsibility integrated into all services",
              "Local deployment only",
              "No service after installation",
              "Single-brand supply restrictions",
            ],
            answer: "a",
            explanation:
              "Slide 12 names environmental responsibility as part of all services.",
            sourceSlides: [12],
            remediationLessonId: "offerings-differentiators",
          }),
          multiple({
            id: "m3-q4",
            prompt: "Which points appear in the differentiators slide?",
            options: [
              "Own leasing company",
              "In-house eco-friendly toner manufacturing",
              "In-house logistics and service",
              "Mandatory third-party service network",
            ],
            answer: ["a", "b", "c"],
            explanation:
              "The differentiators slide highlights owned leasing, in-house toner manufacturing, and in-house logistics and service.",
            sourceSlides: [13],
            remediationLessonId: "offerings-differentiators",
          }),
          trueFalse({
            id: "m3-q5",
            prompt: "The deck presents COS as a family-owned office equipment provider.",
            answer: true,
            explanation:
              "Slide 10 explicitly describes COS that way.",
            sourceSlides: [10],
            remediationLessonId: "customer-triggers",
          }),
        ],
      ),
    },
    {
      id: "consultative-toolkit",
      title: "Consultative Selling Toolkit",
      description:
        "Reinforce objection handling, sharpen discovery with stronger questions, and focus on the KPIs the deck says move deals.",
      estimatedMinutes: 18,
      sourceSlides: [14, 15, 16],
      icon: "message-square",
      lessons: [
        {
          id: "major-objections",
          title: "Responding to Major Customer Objections",
          description:
            "The objection slide provides specific talk-track pivots for common objections reps will hear early and often.",
          sourceSlides: [14],
          objectives: [
            "Recognize the objection types named in the deck.",
            "Use the suggested redirect or follow-up question for each objection.",
            "Keep the conversation active instead of retreating.",
          ],
          keyTakeaways: [
            "The deck prepares reps for agreement timing, lease uncertainty, price, toner, ownership, and decision-maker objections.",
            "Most objection responses begin with a clarifying question rather than a hard rebuttal.",
            "The training encourages reps to widen the conversation instead of narrowing it too early.",
          ],
          content: [
            paragraph(
              "The deck's objection guidance is practical: answer the concern, but also reopen the conversation by asking for context or reframing the issue."
            ),
            table(
              ["Objection", "Deck guidance"],
              [
                ["Signed a new agreement", "Ask the term length and how far into it they are"],
                ["Do not know lease end", "Remind them COS offers more than copiers"],
                ["Happy with vendor", "Respect loyalty and position COS as a backup option"],
                ["Price", "Discuss cost versus price"],
                ["Toner concerns", "Clarify that COS makes compatible toner, not recycled toner"],
              ],
            ),
          ],
          knowledgeChecks: [
            scenario({
              id: "kc-major-objections",
              prompt: "A prospect says they just signed a new agreement. Which response best follows the deck?",
              options: [
                "End the call because the account is closed",
                "Ask the term and how far into the agreement they are",
                "Offer toner recycling immediately",
                "Tell them price is the only thing that matters",
              ],
              answer: "b",
              explanation:
                "Slide 14 tells reps to ask about the term and how far into the agreement the customer is.",
              sourceSlides: [14],
              remediationLessonId: "major-objections",
            }),
          ],
        },
        {
          id: "killer-questions",
          title: "Using Killer Questions",
          description:
            "Slide 15 expands discovery into more consultative territory by pushing reps to ask questions about spend, workflow, support, and future timing.",
          sourceSlides: [15],
          objectives: [
            "Use the consultative question list as a discovery guide.",
            "Move beyond surface-level equipment talk toward cost, workflow, and vendor performance.",
            "Tie stronger questions to better qualification.",
          ],
          keyTakeaways: [
            "The killer questions span current environment, annual spend, sustainability, lease timing, CPP understanding, and workflow analysis.",
            "The deck encourages reps to discover operational and financial impact, not just equipment age.",
            "Consultative questions make the rep sound prepared and intentional.",
          ],
          content: [
            paragraph(
              "The killer question slide is a discovery library. It helps reps move from product talk into business impact, vendor performance, cost structure, and workflow efficiency."
            ),
            bullets([
              "How are you currently managing your print environment?",
              "Do you know your annual print and imaging spend?",
              "What is your plan when the lease ends?",
              "Do you know your cost per page and how it changes over time?",
              "How much time goes into managing supplies?",
              "Has a walk-time or downtime analysis been done?",
              "What has your current vendor done to impress you?",
            ]),
          ],
          knowledgeChecks: [
            single({
              id: "kc-killer-questions",
              prompt: "Which question from the deck pushes discovery into cost structure rather than equipment specs?",
              options: [
                "What color do you want the machine to be?",
                "Do you know your cost per page and how it increases yearly?",
                "Which printer tray do you use most often?",
                "Would you prefer a smaller control panel?",
              ],
              answer: "b",
              explanation:
                "The killer questions slide explicitly asks whether the customer knows their cost per page and whether they understand it increases yearly.",
              sourceSlides: [15],
              remediationLessonId: "killer-questions",
            }),
          ],
        },
        {
          id: "kpis-that-move-deals",
          title: "KPIs That Move Deals",
          description:
            "The KPI slide keeps reps focused on behaviors and conversion metrics that affect revenue production.",
          sourceSlides: [16],
          objectives: [
            "Recall the KPI categories listed in the deck.",
            "Connect KPI tracking to deal velocity and execution quality.",
            "Use KPI language consistently in performance coaching.",
          ],
          keyTakeaways: [
            "The deck names new opportunities generated, WWSB performance, speed to follow-up, and proposal-to-close ratios.",
            "The KPI slide is about deal movement, not vanity metrics.",
            "Fast follow-up is treated as a meaningful performance lever.",
          ],
          content: [
            paragraph(
              "The KPI slide keeps the conversation tied to performance. Reps are expected to create opportunities, respond quickly, and improve conversion, not just stay busy."
            ),
            bullets([
              "New opportunities generated",
              "WWSB performance",
              "Speed to follow-up",
              "Proposal-to-close ratios",
            ]),
            image(
              "/onboarding/sales-rep/deck-assets/slide-16-1-image38.png",
              "Stylized chart and truck graphic used behind the KPI slide.",
              "The KPI slide pairs deal metrics with a growth visual to reinforce momentum and production.",
              1136,
              768,
            ),
          ],
          knowledgeChecks: [
            single({
              id: "kc-kpis-that-move-deals",
              prompt: "Which KPI from the deck directly measures conversion quality?",
              options: [
                "Proposal-to-close ratios",
                "Office seating count",
                "Average email signature length",
                "Printer color preference",
              ],
              answer: "a",
              explanation:
                "Proposal-to-close ratios measure how effectively proposals become won business.",
              sourceSlides: [16],
              remediationLessonId: "kpis-that-move-deals",
            }),
          ],
        },
      ],
      quiz: assessment(
        "quiz-consultative-toolkit",
        "Module 4 Quiz: Consultative Selling Toolkit",
        "Measures how well the rep can handle objections, ask stronger questions, and focus on productive KPIs.",
        80,
        [
          single({
            id: "m4-q1",
            prompt: "How does the deck suggest reps respond when a prospect says they are happy with their vendor?",
            options: [
              "Attack the current vendor's service quality",
              "Respect the loyalty and position COS as a helpful backup",
              "End the conversation immediately",
              "Focus only on toner pricing",
            ],
            answer: "b",
            explanation:
              "The objection slide says loyalty should be valued and COS can still be positioned as a backup.",
            sourceSlides: [14],
            remediationLessonId: "major-objections",
          }),
          single({
            id: "m4-q2",
            prompt: "Which response matches the deck when the customer raises toner concerns?",
            options: [
              "Promise OEM-only toner forever",
              "Clarify that COS makes compatible toner, not recycled toner",
              "Avoid the topic",
              "Say toner is never part of the conversation",
            ],
            answer: "b",
            explanation:
              "Slide 14 specifically frames COS toner as compatible, not recycled.",
            sourceSlides: [14],
            remediationLessonId: "major-objections",
          }),
          scenario({
            id: "m4-q3",
            prompt: "You want to learn whether a prospect is exposed to rising print costs over time. Which killer question is the best fit?",
            options: [
              "Do you know your cost per page and that it increases yearly?",
              "What is your favorite output tray?",
              "Would you prefer a black or white device?",
              "Can we skip directly to the lease paperwork?",
            ],
            answer: "a",
            explanation:
              "That exact cost-per-page question appears on slide 15.",
            sourceSlides: [15],
            remediationLessonId: "killer-questions",
          }),
          multiple({
            id: "m4-q4",
            prompt: "Which items are listed on the KPI slide?",
            options: [
              "New opportunities generated",
              "WWSB performance",
              "Speed to follow-up",
              "Office supply reorder accuracy",
            ],
            answer: ["a", "b", "c"],
            explanation:
              "The KPI slide lists new opportunities generated, WWSB performance, speed to follow-up, and proposal-to-close ratios.",
            sourceSlides: [16],
            remediationLessonId: "kpis-that-move-deals",
          }),
          trueFalse({
            id: "m4-q5",
            prompt: "The killer questions are meant to deepen discovery, not replace it with a scripted close.",
            answer: true,
            explanation:
              "Slide 15 is a question bank that helps reps uncover workflow, cost, and vendor context.",
            sourceSlides: [15],
            remediationLessonId: "killer-questions",
          }),
        ],
      ),
    },
    {
      id: "equipment-and-proposals",
      title: "Equipment and Proposal Basics",
      description:
        "Build fluency in the Sharp lineup, device categories, acquisition paths, and the proposal components reps need to explain accurately.",
      estimatedMinutes: 32,
      sourceSlides: [17, 18, 19, 20, 21, 22, 23, 24],
      icon: "printer",
      lessons: [
        {
          id: "sharp-line-identification",
          title: "Sharp Line Overview and Machine Identification",
          description:
            "Slides 17 and 18 orient reps to the product line and show how to decode the BP naming convention.",
          sourceSlides: [17, 18],
          objectives: [
            "Differentiate the MX-70, MX-71, and BP-series references from the deck.",
            "Decode the major parts of a BP model number.",
            "Use the naming convention slide to speak more confidently about hardware.",
          ],
          keyTakeaways: [
            "MX-70 is positioned as the oldest line and a fit for startups or low-approval deals.",
            "MX-71 is framed as the solid mid-generation line.",
            "The BP-series is presented as the newest line with AI integration and improved toner efficiency.",
          ],
          content: [
            paragraph(
              "The deck expects reps to sound credible when discussing the Sharp line. That starts with knowing how the product generations are positioned and how to read the BP naming convention."
            ),
            bullets([
              "MX-70: oldest line, best for startups or low approval deals",
              "MX-71: solid mid-generation line",
              "BP-series: 50, 70, and 71 models positioned as the newest line",
              "The BP-series is described as having AI integration and improved toner technology that lowers usage over time",
            ]),
            image(
              "/onboarding/sales-rep/deck-assets/slide-18-1-image42.png",
              "Sharp BP naming convention diagram.",
              "The deck labels the BP model prefix, series, version, color or mono identifier, and speed.",
              600,
              600,
            ),
          ],
          knowledgeChecks: [
            single({
              id: "kc-sharp-line-identification",
              prompt: "How does the deck position the BP-series line?",
              options: [
                "Oldest line for low approval deals",
                "Mid-generation line with no toner improvements",
                "Newest line with AI integration and improved toner technology",
                "Legacy line reserved only for used equipment",
              ],
              answer: "c",
              explanation:
                "Slide 17 describes the BP-series as the newest line with AI integration and improved toner technology.",
              sourceSlides: [17, 18],
              remediationLessonId: "sharp-line-identification",
            }),
          ],
        },
        {
          id: "device-types-buying-paths",
          title: "Device Types and Acquisition Paths",
          description:
            "The next slides define printer, MFP, and copier roles, then show the basic lease, rental, and purchase options reps should understand.",
          sourceSlides: [19, 20],
          objectives: [
            "Distinguish printer, MFP, and copier use cases.",
            "Match heavier environments to copier capabilities.",
            "Recall the lease, rental, and purchase options shown in the deck.",
          ],
          keyTakeaways: [
            "Printers handle simple output.",
            "MFPs are all-in-one workflow hubs.",
            "Copiers are built for heavier environments, larger capacity, and stronger long-term economics.",
          ],
          content: [
            paragraph(
              "The product comparison slide clarifies what type of device belongs in which environment. The next slide adds the high-level acquisition choices reps should know when talking through next steps."
            ),
            table(
              ["Device", "How the deck positions it"],
              [
                [
                  "Printer",
                  "Fast, efficient, compact, and print-only",
                ],
                [
                  "MFP",
                  "Print, scan, copy, fax, automate workflows, and send to email or drive",
                ],
                [
                  "Copier",
                  "Higher duty cycle, finishing options, larger paper capacity, and long-term savings for consistent volume",
                ],
              ],
            ),
            image(
              "/onboarding/sales-rep/deck-assets/slide-20-1-image46.png",
              "Graphic showing lease, rental, and purchase options.",
              "The deck summarizes three acquisition paths: lease with 60, 48, or 36 month terms, a 12-month rental option, and purchase via upfront payment.",
              1536,
              1024,
            ),
          ],
          knowledgeChecks: [
            single({
              id: "kc-device-types-buying-paths",
              prompt: "Which device type does the deck reserve for heavier environments with more capacity and finishing options?",
              options: ["Printer", "MFP", "Copier", "Toner cartridge"],
              answer: "c",
              explanation:
                "The product comparison slide says copiers are built for heavier environments and stronger long-term cost savings for consistent volume.",
              sourceSlides: [19, 20],
              remediationLessonId: "device-types-buying-paths",
            }),
          ],
        },
        {
          id: "proposal-service-foundation",
          title: "Proposal and Service Agreement Foundation",
          description:
            "Slides 21 and 22 outline what belongs in a copier proposal and what the service and supply agreement does and does not include.",
          sourceSlides: [21, 22],
          objectives: [
            "List the core items included in every copier proposal.",
            "Describe what the service and supply agreement covers.",
            "Avoid overpromising around excluded items.",
          ],
          keyTakeaways: [
            "Every copier proposal includes equipment basics plus delivery, installation, and training.",
            "Additional finishing and capability options can be layered onto the proposal.",
            "Client-caused damage and post-install networking are excluded from the service and supply agreement.",
          ],
          content: [
            paragraph(
              "These slides help reps scope the proposal accurately. They also create clean boundaries so customers understand what is included in service and what still sits outside the agreement."
            ),
            checklist([
              "Main body, power filter, drawers, and starter toner for new units",
              "Delivery, installation, and training",
              "Optional capabilities such as stapling, hole punch, folding, booklet making, fax, and more",
            ]),
            bullets([
              "Service and supply includes 24/7 monitoring and auto-restocked toner",
              "Software updates, service, all parts, and labor are included",
              "Client-caused damage and post-install networking are not included",
            ]),
            callout(
              "The proposal slide notes that purchase options can have separate charges. Make sure the customer understands when charges sit outside the standard package.",
              "Scope control",
            ),
          ],
          knowledgeChecks: [
            trueFalse({
              id: "kc-proposal-service-foundation",
              prompt: "Post-install networking is included in the standard service and supply agreement.",
              answer: false,
              explanation:
                "Slide 22 says post-install networking is not included.",
              sourceSlides: [21, 22],
              remediationLessonId: "proposal-service-foundation",
            }),
          ],
        },
        {
          id: "cpp-plan-options",
          title: "CPP Plan Options",
          description:
            "Slides 23 and 24 explain the standard CPP plan and the inclusive option so reps can explain billing structure and fit.",
          sourceSlides: [23, 24],
          objectives: [
            "Describe what is included in the standard CPP option.",
            "Explain the logic behind the inclusive plan.",
            "Match predictable billing needs to the inclusive plan.",
          ],
          keyTakeaways: [
            "The standard plan includes a base fee with remote monitoring software and more.",
            "The inclusive plan is essentially a single-price, all-you-can-print structure tied to a monthly allowance.",
            "Pages on the inclusive plan do not roll into the next month.",
          ],
          content: [
            paragraph(
              "The deck gives reps two ways to describe CPP structure: a standard plan with stated rates and a more predictable inclusive model tied to a monthly allowance."
            ),
            table(
              ["Plan", "Deck details"],
              [
                [
                  "Standard plan",
                  "Base fee includes remote monitoring software and more, free black-and-white pages for onboarding, BP-series has cheaper rates due to improved toner tech",
                ],
                [
                  "Inclusive plan",
                  "Average monthly volume or page allowance, positioned as all you can print for one price, pages do not roll to the next month, ideal for predictable monthly bills",
                ],
              ],
            ),
            bullets([
              "Standard plan black-and-white rate: $0.01",
              "Standard plan color rate: $0.07",
              "Inclusive plan is best framed around predictability rather than rollover volume",
            ]),
          ],
          knowledgeChecks: [
            single({
              id: "kc-cpp-plan-options",
              prompt: "Which plan is presented as ideal for predictable monthly bills?",
              options: ["Standard plan", "Inclusive plan", "Purchase plan", "Rental plan"],
              answer: "b",
              explanation:
                "Slide 24 explicitly says the inclusive plan is ideal for predictable monthly bills.",
              sourceSlides: [23, 24],
              remediationLessonId: "cpp-plan-options",
            }),
          ],
        },
      ],
      quiz: assessment(
        "quiz-equipment-and-proposals",
        "Module 5 Quiz: Equipment and Proposal Basics",
        "Checks hardware fluency, proposal structure, service agreement boundaries, and CPP plan understanding.",
        80,
        [
          single({
            id: "m5-q1",
            prompt: "Which Sharp line does the deck describe as the oldest and best for startups or low approval deals?",
            options: ["MX-70", "MX-71", "BP-70", "BP-71"],
            answer: "a",
            explanation:
              "Slide 17 positions the MX-70 that way.",
            sourceSlides: [17],
            remediationLessonId: "sharp-line-identification",
          }),
          single({
            id: "m5-q2",
            prompt: "In the BP naming convention visual, what does the letter C identify?",
            options: [
              "Customer-owned device",
              "Color model",
              "Copier-only machine",
              "Connected service plan",
            ],
            answer: "b",
            explanation:
              "The slide says C identifies color and M identifies monochrome.",
            sourceSlides: [18],
            remediationLessonId: "sharp-line-identification",
          }),
          single({
            id: "m5-q3",
            prompt: "Which acquisition path on the deck is tied to a 12-month option?",
            options: ["Lease", "Rental", "Purchase", "CPP"],
            answer: "b",
            explanation:
              "Slide 20 labels rental as the 12-month option.",
            sourceSlides: [20],
            remediationLessonId: "device-types-buying-paths",
          }),
          multiple({
            id: "m5-q4",
            prompt: "Which items are included in every copier proposal according to the deck?",
            options: [
              "Delivery",
              "Installation",
              "Training",
              "Post-install networking",
            ],
            answer: ["a", "b", "c"],
            explanation:
              "Slide 21 includes delivery, installation, and training, but networking is addressed as an exclusion in the service agreement slide.",
            sourceSlides: [21, 22],
            remediationLessonId: "proposal-service-foundation",
          }),
          trueFalse({
            id: "m5-q5",
            prompt: "Pages on the inclusive CPP plan roll into the following month.",
            answer: false,
            explanation:
              "Slide 24 explicitly says pages do not roll to the next month.",
            sourceSlides: [24],
            remediationLessonId: "cpp-plan-options",
          }),
        ],
      ),
    },
    {
      id: "toner-and-supply-programs",
      title: "Toner and Supply Programs",
      description:
        "Learn the toner fundamentals, the COS compatible toner value story, and the managed supply and recycling programs reps can use to deepen the relationship.",
      estimatedMinutes: 22,
      sourceSlides: [25, 26, 27, 28, 29, 30],
      icon: "package",
      lessons: [
        {
          id: "toner-basics-micr",
          title: "Toner Basics and MICR",
          description:
            "The first two toner slides help reps explain yield differences and the special role of MICR toner in check printing.",
          sourceSlides: [25, 26],
          objectives: [
            "Explain the difference between low-yield and high-yield cartridges.",
            "Describe why MICR toner matters in check printing workflows.",
            "Use toner education to reduce ordering mistakes and downtime.",
          ],
          keyTakeaways: [
            "High-yield cartridges hold significantly more toner and reduce replacement frequency.",
            "The deck says many HP printers use low-yield and high-yield cartridge options.",
            "MICR toner creates the signal strength needed for bank check readers to recognize routing and account numbers.",
          ],
          content: [
            paragraph(
              "The toner section starts with basics that affect daily customer experience. Reps are expected to educate customers so they avoid mis-orders and reduce downtime."
            ),
            bullets([
              "Many HP printers use both low-yield and high-yield cartridge options",
              "High-yield cartridges often provide two to three times the page yield",
              "Higher yield reduces cartridge replacement frequency and lowers downtime risk",
            ]),
            callout(
              "MICR toner is not generic specialty toner. The deck links it specifically to check printing and bank reader signal strength.",
              "MICR reminder",
            ),
            bullets([
              "MICR toner is for printing checks",
              "Its formula creates signal strength for bank check readers",
              "It enables routing number and account number recognition",
            ]),
          ],
          knowledgeChecks: [
            single({
              id: "kc-toner-basics-micr",
              prompt: "Why does the deck say customers benefit from high-yield toner?",
              options: [
                "It removes the need for service agreements",
                "It reduces replacement frequency and downtime",
                "It only works in monochrome copiers",
                "It replaces MICR toner for check printing",
              ],
              answer: "b",
              explanation:
                "Slide 25 says high-yield cartridges hold more toner and reduce both replacement frequency and downtime.",
              sourceSlides: [25, 26],
              remediationLessonId: "toner-basics-micr",
            }),
          ],
        },
        {
          id: "compatible-toner-value",
          title: "OEM vs Compatible Toner and the COS Value Story",
          description:
            "Slides 27 and 28 clarify how COS frames compatible toner and why reps should feel comfortable explaining the value proposition.",
          sourceSlides: [27, 28],
          objectives: [
            "Define OEM and compatible toner in the way the deck presents them.",
            "Understand the in-house manufacturing advantage cited in training.",
            "Use the compatible toner value points without overstating them.",
          ],
          keyTakeaways: [
            "OEM refers to original equipment manufacturers such as HP, Xerox, and Lexmark.",
            "The deck positions COS compatible toner as same-performance, lower-cost, and manufactured in-house.",
            "The cartridge slide adds yield, testing, warranty, recycling, and cost savings points to the story.",
          ],
          content: [
            paragraph(
              "The deck gives reps a direct way to discuss compatible toner. The intent is to frame COS cartridges as controlled, tested, and margin-positive without sounding defensive."
            ),
            bullets([
              "OEM means original equipment manufacturer, such as HP, Xerox, or Lexmark",
              "OEM toner is sold in the manufacturer's packaging",
              "COS compatible toner is positioned as same performance at lower cost",
              "The deck says COS compatible toner is manufactured in-house for higher margins and control",
            ]),
            checklist([
              "Manufactured in the USA",
              "Success rate higher than 99%",
              "Extra toner added for higher yield",
              "Rigorously tested before distribution",
              "Higher density and vibrant prints",
              "Free recycling options for up to 95% of plastic",
              "Lower printing costs by up to 20%",
              "Lifetime warranty",
            ]),
          ],
          knowledgeChecks: [
            trueFalse({
              id: "kc-compatible-toner-value",
              prompt: "The deck says COS compatible toner is recycled toner collected from customers.",
              answer: false,
              explanation:
                "The deck distinguishes COS compatible toner from recycled toner and says it is manufactured in-house.",
              sourceSlides: [27, 28],
              remediationLessonId: "compatible-toner-value",
            }),
          ],
        },
        {
          id: "auto-restock-and-recycling",
          title: "Auto-Restock and Cartridge Collection",
          description:
            "The final toner slides show how supply automation and recycling programs can improve customer experience while opening the door to more conversation.",
          sourceSlides: [29, 30],
          objectives: [
            "Explain the auto-restock program clearly.",
            "Describe the cartridge collection process.",
            "Recognize how these programs support sustainability and account development.",
          ],
          keyTakeaways: [
            "Auto-restock is framed as a zero-effort way to keep supplies available.",
            "COS can manage the supply closet and ship toner when devices run low.",
            "The cartridge collection program supports recycling and can create a foot-in-the-door sales conversation.",
          ],
          content: [
            paragraph(
              "The final supply slides position COS as a proactive partner that can reduce chaos around consumables while supporting recycling goals."
            ),
            image(
              "/onboarding/sales-rep/deck-assets/slide-29-1-image57.png",
              "Auto-restock icon from the training deck.",
              "The auto-restock slide uses a circular replenishment icon to reinforce hands-off supply management.",
              512,
              512,
            ),
            bullets([
              "COS ships toner as soon as the printer runs low",
              "An optional monthly shipment schedule is available",
              "The program removes supply closet chaos and downtime",
              "The service is framed as free and includes supply closet management",
            ]),
            bullets([
              "COS provides toner collection boxes",
              "Customers fill them with empties and COS picks them up periodically",
              "The program supports sustainability and reduces landfill waste",
              "The deck notes that the usage report creates a foot-in-the-door opportunity for sales",
            ]),
          ],
          knowledgeChecks: [
            scenario({
              id: "kc-auto-restock-and-recycling",
              prompt: "A customer says they constantly run out of toner because no one manages supplies closely. Which COS program best fits the deck?",
              options: [
                "CPP Inclusive Plan only",
                "Auto-supply and auto-restock program",
                "Secretary of State pre-approval workflow",
                "Personal Guarantee option",
              ],
              answer: "b",
              explanation:
                "Slide 29 says COS can ship toner automatically when printers run low and even manage the supply closet.",
              sourceSlides: [29, 30],
              remediationLessonId: "auto-restock-and-recycling",
            }),
          ],
        },
      ],
      quiz: assessment(
        "quiz-toner-and-supply-programs",
        "Module 6 Quiz: Toner and Supply Programs",
        "Validates toner fundamentals, compatible toner positioning, and supply program knowledge.",
        80,
        [
          single({
            id: "m6-q1",
            prompt: "What does the deck say high-yield cartridges often provide compared with low-yield cartridges?",
            options: [
              "Half the page yield",
              "Two to three times the page yield",
              "No change in yield",
              "Check-printing capability",
            ],
            answer: "b",
            explanation:
              "Slide 25 says high-yield cartridges often provide two to three times the page yield.",
            sourceSlides: [25],
            remediationLessonId: "toner-basics-micr",
          }),
          single({
            id: "m6-q2",
            prompt: "What is MICR toner used for according to the deck?",
            options: [
              "Printing checks",
              "Replacing service calls",
              "Producing stapled booklets",
              "Activating AI workflows",
            ],
            answer: "a",
            explanation:
              "Slide 26 says MICR toner is for printing checks.",
            sourceSlides: [26],
            remediationLessonId: "toner-basics-micr",
          }),
          trueFalse({
            id: "m6-q3",
            prompt: "OEM stands for Original Equipment Manufacturer.",
            answer: true,
            explanation:
              "Slide 27 defines OEM exactly that way.",
            sourceSlides: [27],
            remediationLessonId: "compatible-toner-value",
          }),
          multiple({
            id: "m6-q4",
            prompt: "Which benefits are listed for COS toner cartridges?",
            options: [
              "Lifetime warranty",
              "Success rate above 99%",
              "Lower printing costs by up to 20%",
              "Elimination of all service agreements",
            ],
            answer: ["a", "b", "c"],
            explanation:
              "Slide 28 lists warranty, success rate, and cost reduction benefits, but it does not say toner replaces service agreements.",
            sourceSlides: [28],
            remediationLessonId: "compatible-toner-value",
          }),
          single({
            id: "m6-q5",
            prompt: "What does the cartridge collection program provide to customers?",
            options: [
              "A lease approval decision",
              "Toner collection boxes and periodic pickup",
              "Free post-install networking",
              "A guaranteed OEM-only supply stream",
            ],
            answer: "b",
            explanation:
              "Slide 30 says COS provides collection boxes and picks them up periodically.",
            sourceSlides: [30],
            remediationLessonId: "auto-restock-and-recycling",
          }),
        ],
      ),
    },
    {
      id: "approvals-and-order-execution",
      title: "Approvals and Order Execution",
      description:
        "Learn the pre-approval requirements, the flexibility COS can use with younger businesses, and the order-to-delivery information flow reps must control.",
      estimatedMinutes: 24,
      sourceSlides: [31, 32, 33, 34, 35, 36],
      icon: "clipboard-check",
      lessons: [
        {
          id: "pre-approval-flexibility",
          title: "Pre-Approval Requirements and Flexibility",
          description:
            "Slides 31, 32, and 36 define the standard approval inputs and the options COS can use when a business does not meet the two-year benchmark.",
          sourceSlides: [31, 32, 36],
          objectives: [
            "Recall the minimum pre-approval inputs named in the deck.",
            "Explain the options COS can use when the Secretary of State record shows fewer than two years.",
            "Position approval flexibility as a differentiator without inventing new rules.",
          ],
          keyTakeaways: [
            "Standard pre-approval requires a business with two years of active registration via the Secretary of State plus addresses, model, term, and monthly rate.",
            "If the business is under two years, the deck lists Personal Guarantee, another active company, DBA filing, or rental as options.",
            "The approvals summary slide frames this flexibility as a real COS differentiator.",
          ],
          content: [
            paragraph(
              "The approvals section is procedural, but it is also a sales advantage. Reps need to know both the standard requirements and the flexibility COS can use when a younger business still looks like a fit."
            ),
            bullets([
              "Business must show two years of active registration via the Secretary of State search",
              "Delivery and billing address are required",
              "Model selected, lease term, and monthly rate are required",
              "The deck specifically references the Georgia Secretary of State business search link: https://ecorp.sos.ga.gov/BusinessSearch",
            ]),
            checklist([
              "Personal Guarantee option",
              "Another active company owned by the client",
              "DBA filing under that active company",
              "Rental option when leasing is not possible",
              "In-house leasing through COL for faster decisions",
            ]),
            callout(
              "Slide 36 contrasts COS flexibility with dealers that have strict or limited options around PGs, DBAs, and rentals. Use that difference carefully and stay inside the deck's language.",
              "Positioning note",
            ),
          ],
          knowledgeChecks: [
            multiple({
              id: "kc-pre-approval-flexibility",
              prompt: "If a Secretary of State record shows less than two years, which options does the deck say COS can use?",
              options: [
                "Personal Guarantee",
                "DBA filing under another active company",
                "Rental option",
                "Ignore the registration history entirely",
              ],
              answer: ["a", "b", "c"],
              explanation:
                "Slides 32 and 36 list Personal Guarantee, DBA under another active company, and rental as flexibility tools. They do not say to ignore registration history.",
              sourceSlides: [31, 32, 36],
              remediationLessonId: "pre-approval-flexibility",
            }),
          ],
        },
        {
          id: "sales-order-and-delivery-flow",
          title: "Sales Order Details and Delivery Flow",
          description:
            "The final slides show what the rep must gather before an order can move cleanly through lease, scheduling, delivery, and service activation.",
          sourceSlides: [33, 34, 35],
          objectives: [
            "Gather the order information named in the deck before handoff.",
            "Use the sales order form detail list to avoid preventable delays.",
            "Understand the approval-to-delivery sequence shown in the flowchart slide.",
          ],
          keyTakeaways: [
            "The order needs a point of contact, install instructions, addresses, model, quantity, accessories, term, leasing details, pricing, CPP, and pickup information when applicable.",
            "The sales order form needs billing, shipping, meter contact, equipment, pickup, lease, and service agreement detail.",
            "The flowchart moves from pre-approval through credit options, proposal, acceptance, lease docs, scheduling, installation, funding, and service start.",
          ],
          content: [
            paragraph(
              "The last operational section is about discipline. The rep's ability to gather complete information affects approval speed, installation accuracy, and the handoff to service."
            ),
            checklist([
              "Onsite point of contact name, number, and email",
              "Specific installation instructions",
              "Full bill-to and ship-to information",
              "Selected model, quantity, and accessories",
              "Lease term, leasing company, and FMV or $1 buyout",
              "Monthly base rate and CPP details",
              "Pickup equipment information when applicable",
            ]),
            table(
              ["Sales order form detail", "Examples named in the deck"],
              [
                ["Customer billing", "Name, address, AP email"],
                ["Customer shipping", "Name and address if different"],
                ["Meter contact", "Email"],
                ["Equipment detail", "Item number, model or description, serial number if used"],
                ["Financial detail", "Unit cost, unit price, lease payment, rate, and term"],
                ["Service detail", "Service agreement yes or no, buyout included, covered pages, CPP rates"],
              ],
            ),
            checklist([
              "Pre-approval complete",
              "Credit option confirmed",
              "Proposal presented",
              "Client accepts and install details are confirmed",
              "Lease docs issued and signed",
              "Equipment ordered and scheduled",
              "Delivery and installation completed",
              "Funding released and service begins",
            ]),
          ],
          knowledgeChecks: [
            single({
              id: "kc-sales-order-and-delivery-flow",
              prompt: "Which item is explicitly required before placing a sales order?",
              options: [
                "Onsite point of contact name, number, and email",
                "The customer's preferred desk arrangement",
                "A signed recycling box pickup schedule",
                "A completed auto-restock icon review",
              ],
              answer: "a",
              explanation:
                "Slide 33 lists the onsite point of contact name, number, and email among the required order inputs.",
              sourceSlides: [33, 34, 35],
              remediationLessonId: "sales-order-and-delivery-flow",
            }),
          ],
        },
      ],
      quiz: assessment(
        "quiz-approvals-and-order-execution",
        "Module 7 Quiz: Approvals and Order Execution",
        "Checks approval requirements, flexibility options, order detail capture, and the post-acceptance workflow.",
        80,
        [
          single({
            id: "m7-q1",
            prompt: "What is the default registration benchmark named on the pre-approval slide?",
            options: [
              "Six months active registration",
              "One year active registration",
              "Two years active registration",
              "Five years active registration",
            ],
            answer: "c",
            explanation:
              "Slide 31 says the business must show two years of active registration via the Secretary of State.",
            sourceSlides: [31],
            remediationLessonId: "pre-approval-flexibility",
          }),
          multiple({
            id: "m7-q2",
            prompt: "Which items are named as required pre-approval inputs?",
            options: [
              "Delivery and billing address",
              "Selected model",
              "Lease term and monthly rate",
              "Confirmed toner collection pickup date",
            ],
            answer: ["a", "b", "c"],
            explanation:
              "Slide 31 requires addresses, model, term, and monthly rate. It does not require a toner collection pickup date.",
            sourceSlides: [31],
            remediationLessonId: "pre-approval-flexibility",
          }),
          single({
            id: "m7-q3",
            prompt: "If leasing is not possible for a business under two years, what alternative is named in the deck?",
            options: ["Unlimited CPP", "Rental option", "Post-install networking waiver", "OEM-only toner plan"],
            answer: "b",
            explanation:
              "Slide 32 explicitly says COS can offer a rental option when leasing is not possible.",
            sourceSlides: [32],
            remediationLessonId: "pre-approval-flexibility",
          }),
          single({
            id: "m7-q4",
            prompt: "Which form detail is explicitly required on the sales order form slide?",
            options: [
              "Meter contact email",
              "LinkedIn URL",
              "Office paint specification",
              "Vehicle parking permit number",
            ],
            answer: "a",
            explanation:
              "Slide 34 calls for the meter contact's email.",
            sourceSlides: [34],
            remediationLessonId: "sales-order-and-delivery-flow",
          }),
          scenario({
            id: "m7-q5",
            prompt: "A customer has accepted the proposal. What step comes next in the flowchart before equipment is ordered and scheduled?",
            options: [
              "Lease docs are issued",
              "Funding is released immediately",
              "The machine is delivered before paperwork",
              "The sales rep skips installation details",
            ],
            answer: "a",
            explanation:
              "Slide 35 shows the flow moving from client acceptance to lease docs issued, then lease signed and submitted, then equipment ordered and scheduled.",
            sourceSlides: [35],
            remediationLessonId: "sales-order-and-delivery-flow",
          }),
        ],
      ),
    },
  ],
  finalAssessment: assessment(
    "final-sales-rep-certification",
    "Final Certification Assessment",
    "Cumulative assessment covering the full onboarding course. Passing score is 85%.",
    85,
    [
      single({
        id: "final-q1",
        prompt: "Which company did the deck say acquired Laser Life Inc. in 2007?",
        options: ["Sharp", "Pitney Bowes", "HP", "Lexmark"],
        answer: "b",
        explanation:
          "Slide 2 says Laser Life Inc. was sold to Pitney Bowes in 2007.",
        sourceSlides: [2],
        remediationLessonId: "welcome-history",
      }),
      multiple({
        id: "final-q2",
        prompt: "Which expectations define the COS sales rep role?",
        options: [
          "Be the advisor",
          "Lead with questions",
          "Wait to create momentum until procurement asks for it",
          "Create clarity and momentum",
        ],
        answer: ["a", "b", "d"],
        explanation:
          "Slide 4 expects reps to be advisors, lead with questions, and create clarity and momentum.",
        sourceSlides: [4],
        remediationLessonId: "sales-rep-role",
      }),
      single({
        id: "final-q3",
        prompt: "Which sequence matches the sales flow slide?",
        options: [
          "Connect, Label, Ask, Bridge, Close",
          "Ask, Close, Connect, Quote, Deliver",
          "Connect, Quote, Service, Close, Renew",
          "Prospect, Install, Bill, Service, Recycle",
        ],
        answer: "a",
        explanation:
          "Slide 5 orders the flow as Connect, Label, Ask, Bridge, and Close.",
        sourceSlides: [5],
        remediationLessonId: "sales-flow-and-value",
      }),
      single({
        id: "final-q4",
        prompt: "Which service promise appears in the value slide?",
        options: [
          "Next-day virtual support and 24-hour onsite service",
          "Fast 1-hour virtual contact and 3-hour onsite standard",
          "No onsite service commitment",
          "Weekly response windows for major accounts only",
        ],
        answer: "b",
        explanation:
          "Slide 6 lists fast 1-hour virtual contact and 3-hour onsite standard.",
        sourceSlides: [6],
        remediationLessonId: "sales-flow-and-value",
      }),
      scenario({
        id: "final-q5",
        prompt: "A prospect says their current setup is frustrating but cannot explain why. Which question best fits the discovery training?",
        options: [
          "What frustrates your team the most with your equipment?",
          "What color would you like the next machine to be?",
          "Can we go straight to the contract?",
          "Do you prefer monthly or quarterly invoices without changing equipment?",
        ],
        answer: "a",
        explanation:
          "Slide 7 directly suggests asking what frustrates the team most with the current equipment.",
        sourceSlides: [7],
        remediationLessonId: "discovery-objections-cadence",
      }),
      single({
        id: "final-q6",
        prompt: "What daily touch expectation appears in the cadence slide?",
        options: ["10-20", "20-30", "40-60", "75-100"],
        answer: "c",
        explanation:
          "Slide 9 says reps should aim for 40-60 touches per day.",
        sourceSlides: [9],
        remediationLessonId: "discovery-objections-cadence",
      }),
      single({
        id: "final-q7",
        prompt: "How does the deck describe the account segment COS serves?",
        options: [
          "Startups under 10 employees only",
          "Mid-large accounts in the 50 to 500 range",
          "Fortune 100 accounts only",
          "Public schools only",
        ],
        answer: "b",
        explanation:
          "Slide 10 says COS serves mid-large 50 to 500 accounts using print and imaging technology.",
        sourceSlides: [10],
        remediationLessonId: "customer-triggers",
      }),
      multiple({
        id: "final-q8",
        prompt: "Which differentiators from the deck help explain why COS is different?",
        options: [
          "Owned leasing company",
          "In-house logistics and service",
          "In-house eco-friendly toner manufacturing",
          "No monitoring or supply access",
        ],
        answer: ["a", "b", "c"],
        explanation:
          "Slide 13 highlights owned leasing, in-house logistics and service, and in-house eco-friendly toner manufacturing.",
        sourceSlides: [13],
        remediationLessonId: "offerings-differentiators",
      }),
      scenario({
        id: "final-q9",
        prompt: "A prospect says price is their main concern. Which response best matches the objection slide?",
        options: [
          "Immediately discount the machine",
          "Discuss cost versus price",
          "Ignore the concern and continue the demo",
          "Move directly to service paperwork",
        ],
        answer: "b",
        explanation:
          "Slide 14 tells reps to discuss cost versus price when price comes up as an objection.",
        sourceSlides: [14],
        remediationLessonId: "major-objections",
      }),
      single({
        id: "final-q10",
        prompt: "Which killer question helps uncover future timing around replacement or renewal?",
        options: [
          "What is your plan when the lease ends?",
          "How many windows are in the office?",
          "Do you like the control panel angle?",
          "What day of the week do you receive mail?",
        ],
        answer: "a",
        explanation:
          "The lease-end question appears on slide 15 as part of the consultative discovery list.",
        sourceSlides: [15],
        remediationLessonId: "killer-questions",
      }),
      single({
        id: "final-q11",
        prompt: "Which line is presented as the newest Sharp line in the deck?",
        options: ["MX-70", "MX-71", "BP-series", "Legacy MX-only line"],
        answer: "c",
        explanation:
          "Slide 17 says the BP-series is the newest line.",
        sourceSlides: [17],
        remediationLessonId: "sharp-line-identification",
      }),
      single({
        id: "final-q12",
        prompt: "Which device type is positioned for heavier environments with higher duty cycles?",
        options: ["Printer", "MFP", "Copier", "Toner cartridge"],
        answer: "c",
        explanation:
          "Slide 19 describes copiers as built for heavier environments and stronger long-term savings for consistent volume.",
        sourceSlides: [19],
        remediationLessonId: "device-types-buying-paths",
      }),
      single({
        id: "final-q13",
        prompt: "Which acquisition path on the deck requires upfront payment?",
        options: ["Lease", "Rental", "Purchase", "CPP Inclusive"],
        answer: "c",
        explanation:
          "Slide 20 labels purchase as the upfront payment option.",
        sourceSlides: [20],
        remediationLessonId: "device-types-buying-paths",
      }),
      trueFalse({
        id: "final-q14",
        prompt: "Client-caused damage is included in the standard service and supply agreement.",
        answer: false,
        explanation:
          "Slide 22 says client-caused damage is not included.",
        sourceSlides: [22],
        remediationLessonId: "proposal-service-foundation",
      }),
      single({
        id: "final-q15",
        prompt: "What does the deck say MICR toner is used for?",
        options: [
          "Printing checks",
          "Reducing CPP rates",
          "Replacing OEM packaging",
          "Increasing tray capacity",
        ],
        answer: "a",
        explanation:
          "Slide 26 says MICR toner is for printing checks.",
        sourceSlides: [26],
        remediationLessonId: "toner-basics-micr",
      }),
      single({
        id: "final-q16",
        prompt: "Which claim about COS toner cartridges appears in the deck?",
        options: [
          "They remove the need for service",
          "They are rigorously tested before distribution",
          "They are imported only from overseas vendors",
          "They cannot be recycled",
        ],
        answer: "b",
        explanation:
          "Slide 28 says COS toner cartridges are rigorously tested before distribution.",
        sourceSlides: [28],
        remediationLessonId: "compatible-toner-value",
      }),
      multiple({
        id: "final-q17",
        prompt: "When a business shows less than two years on the Secretary of State record, which options are named in the deck?",
        options: [
          "Personal Guarantee",
          "DBA under another active company",
          "Rental option",
          "Skip the approval review entirely",
        ],
        answer: ["a", "b", "c"],
        explanation:
          "Slides 32 and 36 list PG, DBA under another active company, and rental. They do not say the approval review can be skipped.",
        sourceSlides: [32, 36],
        remediationLessonId: "pre-approval-flexibility",
      }),
      scenario({
        id: "final-q18",
        prompt: "A customer has accepted the proposal and provided install instructions. What major step must happen before funding is released and service begins?",
        options: [
          "Lease documents must be issued and signed",
          "The cartridge collection box must be filled",
          "The customer must choose a new logo",
          "The rep must wait for the next monthly CPP cycle",
        ],
        answer: "a",
        explanation:
          "Slide 35 shows lease docs being issued and signed before equipment is scheduled, installed, and funded.",
        sourceSlides: [35],
        remediationLessonId: "sales-order-and-delivery-flow",
      }),
    ],
  ),
};

export const salesRepOnboardingLessonIds = salesRepOnboardingCourse.modules.flatMap(
  (module) => module.lessons.map((lesson) => lesson.id),
);
