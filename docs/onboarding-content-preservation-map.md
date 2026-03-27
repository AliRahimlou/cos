# Onboarding Content Preservation Map

## Preservation Goal

Preserve the existing PPTX-derived Sales Rep onboarding program as the authoritative content layer, then extend the platform so additional departments and manager-authored modules can coexist without mutating the protected sales source.

## Protected Sales Program

- Source deck: `/Users/alirahimlou/myapps/cos/Sales Rep Onboarding Training Deck.pptx`
- Extraction artifact: `src/content/onboarding/sales-rep/source/deck-extraction.json`
- Curated course model: `src/content/onboarding/sales-rep/course.ts`
- Extracted media: `public/onboarding/sales-rep/deck-assets/*`
- Extraction notes: `docs/sales-rep-onboarding-extraction.md`
- Program registry entry: `src/content/onboarding/program-registry.ts`

Preservation guarantees applied:

- Course ID preserved: `sales-rep-onboarding`
- Existing module IDs preserved
- Existing lesson IDs preserved
- Existing quiz IDs preserved
- Existing final assessment ID preserved
- Existing `sourceSlides` mappings preserved

## Sales Program Module Map

1. `cos-foundations`
   - Title: `Welcome to COS`
   - Source slides: `1-4`
   - Lessons:
     - `welcome-history`
     - `sales-rep-role`

2. `core-sales-motion`
   - Title: `Core Sales Motion`
   - Source slides: `5-9`
   - Lessons:
     - `sales-flow-and-value`
     - `discovery-objections-cadence`

3. `market-positioning`
   - Title: `Positioning COS in the Market`
   - Source slides: `10-13`
   - Lessons:
     - `customer-triggers`
     - `offerings-differentiators`

4. `consultative-toolkit`
   - Title: `Consultative Selling Toolkit`
   - Source slides: `14-16`
   - Lessons:
     - `major-objections`
     - `killer-questions`
     - `kpis-that-move-deals`

5. `equipment-and-proposals`
   - Title: `Equipment and Proposal Basics`
   - Source slides: `17-24`
   - Lessons:
     - `sharp-line-identification`
     - `device-types-buying-paths`
     - `proposal-service-foundation`
     - `cpp-plan-options`

6. `toner-and-supplies`
   - Title: `Toner and Supply Programs`
   - Source slides: `25-30`
   - Lessons:
     - `toner-basics-micr`
     - `compatible-toner-value`
     - `auto-restock-and-recycling`

7. `approvals-and-execution`
   - Title: `Approvals and Order Execution`
   - Source slides: `31-36`
   - Lessons:
     - `pre-approval-flexibility`
     - `sales-order-and-delivery-flow`

## Coverage and Traceability

- All 36 source slides remain represented in the extraction artifact
- All protected sales lessons retain slide references
- Knowledge checks retain `sourceSlides`
- Module quizzes retain `sourceSlides`
- The final assessment retains `sourceSlides`

Protected content semantics preserved:

- 80% passing threshold for module quizzes
- 85% passing threshold for final certification
- Resume target logic
- Lesson completion logic
- Attempt recording and explanation feedback

## Multi-Department Extension Model

The app now supports departments beyond Sales without altering the protected sales program.

Architecture:

- Static protected programs are registered in `src/content/onboarding/program-registry.ts`
- Manager-authored full programs are stored in `PortalState.customCourses`
- Manager-authored modules for any course are stored in `PortalState.courseModuleExtensions`
- The runtime course list merges protected programs with manager-created programs and extension modules in `src/lib/portal/store.ts`

Design rule:

- Protected PPTX-derived programs are immutable source records
- Manager additions wrap around them as overlays or new programs
- No protected course IDs or slide mappings are rewritten

## Manager Additions Supported

Managers can now:

- create a new department/program
- assign it a starter module and lesson
- add modules to an existing protected or manager-created program
- switch a learner’s active program

Manager-authored content behavior:

- starts with no `sourceSlides`
- is labeled as `Manager-authored` in the UI
- uses the same course/module/lesson schema as the protected sales course
- can later be replaced or augmented by a future PPTX ingestion pass

## Future PPTX Ingestion Path

The preserved extraction pipeline can support future departments such as Marketing, Ops, HR, or Service without replacing the current UI:

1. ingest deck into normalized extraction JSON
2. curate to the shared `Course` schema
3. register the protected program in `src/content/onboarding/program-registry.ts`
4. assign learners to the new program

That keeps the platform content-driven:

- PPTX -> extraction artifact -> typed course -> routed learner experience -> manager oversight

## Visual/Asset Notes

- Image-led slides remain preserved through extracted assets under `public/onboarding/sales-rep/deck-assets/*`
- Sales content remains authoritative where visuals could not be fully parsed
- Manager-authored modules do not fake slide lineage; they intentionally omit `sourceSlides`

## Preservation Conclusion

The Sales Rep program remains intact as the protected PPTX-derived baseline. Multi-department support was added by layering a registry and manager-authored content model around that baseline, not by replacing it.
