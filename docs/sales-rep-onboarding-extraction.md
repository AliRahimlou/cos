# Sales Rep Onboarding Extraction Report

## Source Deck

- File: `Sales Rep Onboarding Training Deck.pptx`
- Deck size: 36 slides
- Extraction artifact: `src/content/onboarding/sales-rep/source/deck-extraction.json`
- Extracted media: `public/onboarding/sales-rep/deck-assets/`

## Extraction Method

- Parsed the PPTX package directly as Open XML from `ppt/presentation.xml`, slide XML, slide relationships, SmartArt `diagramData` files, and notes slide relationships.
- Extracted all embedded slide text, SmartArt text, notes text, and image relationships without adding a PPT parsing dependency.
- Copied referenced slide media into `public/onboarding/sales-rep/deck-assets/` so the in-app course can render source visuals where useful.
- Added manual visual summaries for slides that were primarily image-driven or where the deck used decorative imagery to support the point.

## Module Mapping

1. `Welcome to COS`
   Slides: 1-4
   Covers company story, orientation, and the advisor mindset for sales reps.

2. `Core Sales Motion`
   Slides: 5-9
   Covers the sales flow, market value positioning, discovery, objection posture, and cadence expectations.

3. `Positioning COS in the Market`
   Slides: 10-13
   Covers account profile, customer pain triggers, offerings, and differentiators.

4. `Consultative Selling Toolkit`
   Slides: 14-16
   Covers objection responses, killer questions, and the KPIs that move deals.

5. `Equipment and Proposal Basics`
   Slides: 17-24
   Covers the Sharp line, machine identification, product categories, acquisition paths, proposal inclusions, service scope, and CPP options.

6. `Toner and Supply Programs`
   Slides: 25-30
   Covers toner fundamentals, MICR, OEM vs compatible toner, COS cartridge value, auto-restock, and cartridge collection.

7. `Approvals and Order Execution`
   Slides: 31-36
   Covers pre-approval requirements, flexibility options for newer businesses, sales order detail capture, and the approval-to-delivery flow.

## Lesson Mapping

- `welcome-history`
  Slides: 1-3
- `sales-rep-role`
  Slides: 4
- `sales-flow-and-value`
  Slides: 5-6
- `discovery-objections-cadence`
  Slides: 7-9
- `customer-triggers`
  Slides: 10-11
- `offerings-differentiators`
  Slides: 12-13
- `major-objections`
  Slides: 14
- `killer-questions`
  Slides: 15
- `kpis-that-move-deals`
  Slides: 16
- `sharp-line-identification`
  Slides: 17-18
- `device-types-buying-paths`
  Slides: 19-20
- `proposal-service-foundation`
  Slides: 21-22
- `cpp-plan-options`
  Slides: 23-24
- `toner-basics-micr`
  Slides: 25-26
- `compatible-toner-value`
  Slides: 27-28
- `auto-restock-and-recycling`
  Slides: 29-30
- `pre-approval-flexibility`
  Slides: 31-32, 36
- `sales-order-and-delivery-flow`
  Slides: 33-35

## Source Slide Coverage

- All 36 deck slides are represented in the normalized extraction artifact.
- All 36 deck slides are mapped into the curated course model.
- Every lesson in `src/content/onboarding/sales-rep/course.ts` carries `sourceSlides` metadata.
- Every knowledge check, module quiz question, and final assessment question carries `sourceSlides` metadata and remediation references where useful.

## Visuals and Assumptions

- Slide 18 uses a machine naming convention graphic. The image was extracted and reused directly in the lesson renderer.
- Slide 19 uses product imagery to support the printer vs MFP vs copier comparison. The course relies primarily on extracted text and keeps the visual optional.
- Slide 20 is image-led. It was summarized as a comparison of lease, rental, and purchase paths, with the extracted image retained in the course content.
- Slides 35 and 36 include decorative background imagery behind operational content. The course keeps the slide text as the source of truth and treats those images as supporting visuals only.
- Slide 36 notes content did not contain usable speaker notes beyond the slide number, so no meaningful notes enrichment was possible there.
