import { salesRepOnboardingCourse } from "@/content/onboarding/sales-rep/course";
import type { Course } from "@/lib/onboarding/types";

export type StaticProgramDefinition = {
  courseId: string;
  department: string;
  source: "pptx";
  protected: true;
  deckPath: string;
  extractionArtifact: string;
  notesPath: string;
  course: Course;
};

const protectedPrograms: StaticProgramDefinition[] = [
  {
    courseId: salesRepOnboardingCourse.id,
    department: "Sales",
    source: "pptx",
    protected: true,
    deckPath: "/Users/alirahimlou/myapps/cos/Sales Rep Onboarding Training Deck.pptx",
    extractionArtifact: "src/content/onboarding/sales-rep/source/deck-extraction.json",
    notesPath: "docs/sales-rep-onboarding-extraction.md",
    course: salesRepOnboardingCourse,
  },
];

export function listProtectedPrograms() {
  return protectedPrograms;
}

export function getProtectedProgram(courseId: string) {
  return protectedPrograms.find((program) => program.courseId === courseId) ?? null;
}
