# Onboarding Content Map

## Source and Extraction

- Source deck: `/Users/alirahimlou/myapps/cos/Sales Rep Onboarding Training Deck.pptx`
- Raw normalized extraction: `src/content/onboarding/sales-rep/source/deck-extraction.json`
- Curated course model: `src/content/onboarding/sales-rep/course.ts`
- Extracted media: `public/onboarding/sales-rep/deck-assets/`
- Extraction method: direct Open XML parsing of the PPTX package, including slide text, relationships, SmartArt text, notes text, and media references

## Routed App Mapping

Learner-facing routes built from the normalized course:

- `/dashboard`
- `/training`
- `/training/[moduleId]`
- `/training/[moduleId]/lessons/[lessonId]`
- `/quizzes`
- `/quizzes/[moduleId]`
- `/assessment/final`
- `/results`

Manager-facing oversight routes:

- `/manager`
- `/manager/team`
- `/manager/analytics`
- `/manager/users`
- `/manager/content`

## Module Mapping

1. `cos-foundations`
   Title: `Welcome to COS`
   Slides: 1-4
   Lessons:
   - `welcome-history`
   - `sales-rep-role`

2. `core-sales-motion`
   Title: `Core Sales Motion`
   Slides: 5-9
   Lessons:
   - `sales-flow-and-value`
   - `discovery-objections-cadence`

3. `market-positioning`
   Title: `Positioning COS in the Market`
   Slides: 10-13
   Lessons:
   - `customer-triggers`
   - `offerings-differentiators`

4. `consultative-toolkit`
   Title: `Consultative Selling Toolkit`
   Slides: 14-16
   Lessons:
   - `major-objections`
   - `killer-questions`
   - `kpis-that-move-deals`

5. `equipment-and-proposals`
   Title: `Equipment and Proposal Basics`
   Slides: 17-24
   Lessons:
   - `sharp-line-identification`
   - `device-types-buying-paths`
   - `proposal-service-foundation`
   - `cpp-plan-options`

6. `toner-and-supplies`
   Title: `Toner and Supply Programs`
   Slides: 25-30
   Lessons:
   - `toner-basics-micr`
   - `compatible-toner-value`
   - `auto-restock-and-recycling`

7. `approvals-and-execution`
   Title: `Approvals and Order Execution`
   Slides: 31-36
   Lessons:
   - `pre-approval-flexibility`
   - `sales-order-and-delivery-flow`

## Assessment Mapping

Per-module assessments:

- Every module in `src/content/onboarding/sales-rep/course.ts` includes a quiz with a passing score of 80%
- Each quiz question carries `sourceSlides`
- Each quiz question includes `explanation`
- Each quiz question includes `remediationLessonId` where useful

Final certification:

- Assessment ID: `sales-rep-final-certification`
- Route: `/assessment/final`
- Passing score: 85%
- Coverage: full-course cumulative review grounded in module content from the deck

Inline lesson checks:

- Major lessons include lightweight knowledge checks rendered in-route on lesson pages
- Knowledge checks do not count toward certification but use the same grounded question model and explanations

## Source Slide Coverage

- All 36 slides from the deck are represented in the extraction artifact
- All 36 slides are mapped into the curated course model
- Every lesson includes `sourceSlides`
- Every knowledge check includes `sourceSlides`
- Every module quiz includes `sourceSlides`
- The final assessment includes `sourceSlides`

## Visuals and Assumptions

- Slide 18 image assets were extracted and retained for the machine naming convention lesson
- Slide 19 product imagery was partially parsed; the course uses the extracted text as the source of truth and keeps the supporting image optional
- Slide 20 is image-led; the course preserves the extracted asset and models the content as a lease/rental/purchase comparison
- Slides 35 and 36 include decorative imagery behind operational content; the course keeps the text and process flow as the authoritative source
- Slide 36 speaker notes did not contain meaningful additional training content beyond the slide number

## Editable Architecture

The app now follows a content-driven path:

- PPTX
- normalized extraction JSON
- curated typed course data
- reusable renderers and assessment components
- routed learner and manager experiences

This means future deck revisions can primarily be handled by updating:

- `src/content/onboarding/sales-rep/source/deck-extraction.json`
- `src/content/onboarding/sales-rep/course.ts`

without rewriting page components or assessment UI.
