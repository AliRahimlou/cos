import Link from "next/link";
import { Lock } from "lucide-react";

import { AssessmentScreen } from "@/components/portal/assessment-screen";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { getBestAssessmentAttempt } from "@/lib/onboarding/progress";
import { getLearnerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

export default async function FinalAssessmentPage() {
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context || !context.enrollment) {
    return null;
  }

  const { course, enrollment, summary } = context;
  const finalAssessment = course.finalAssessment;

  if (!finalAssessment) {
    return (
      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">No final assessment configured</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            This onboarding program does not currently include a cumulative final assessment. Module
            completion is the primary completion path for this department.
          </p>
          <Link
            href="/results"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
          >
            Review program status
          </Link>
        </CardContent>
      </Card>
    );
  }

  const bestAttempt = getBestAssessmentAttempt(enrollment.progress, finalAssessment.id);

  if (!summary.finalUnlocked) {
    return (
      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lock className="h-5 w-5" />
            Final assessment locked
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            The final certification assessment unlocks after every module is completed and every
            module quiz is passed, unless a manager explicitly unlocks it from the manager console.
          </p>
          <Link
            href="/training"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
          >
            Return to Training
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <AssessmentScreen
      courseId={course.id}
      assessment={finalAssessment}
      assessmentType="final_assessment"
      heading={`${course.title} Final Assessment`}
      description={`This cumulative exam covers the ${course.title} program. A passing score of ${finalAssessment.passingScore}% is required.`}
      bestScore={bestAttempt?.scorePercent ?? null}
    />
  );
}
