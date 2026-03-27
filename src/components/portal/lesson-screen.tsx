"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { completeLessonAction } from "@/app/actions/onboarding";
import { ContentBlockRenderer } from "@/components/onboarding/content-block-renderer";
import { KnowledgeCheckPanel } from "@/components/onboarding/knowledge-check-panel";
import { SourceSlideBadges } from "@/components/onboarding/source-slide-badges";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lesson, Module } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

type LessonScreenProps = {
  module: Module;
  lesson: Lesson;
  isComplete: boolean;
  previousHref: string;
  nextHref: string;
  nextLabel: string;
};

export function LessonScreen({
  module,
  lesson,
  isComplete,
  previousHref,
  nextHref,
  nextLabel,
}: LessonScreenProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white shadow-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-white/12 px-4 py-1 text-white hover:bg-white/12">
            {module.title}
          </Badge>
          <SourceSlideBadges sourceSlides={lesson.sourceSlides} />
          <Badge
            variant="outline"
            className="rounded-full border-white/20 bg-white/8 px-3 py-1 text-white"
          >
            {isComplete ? "Completed" : "In progress"}
          </Badge>
        </div>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight">{lesson.title}</h2>
        {lesson.description ? (
          <p className="mt-4 max-w-4xl text-base leading-8 text-white/80">
            {lesson.description}
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Lesson Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ContentBlockRenderer blocks={lesson.content} />
            </CardContent>
          </Card>

          {lesson.knowledgeChecks?.length ? (
            <KnowledgeCheckPanel
              title={`${lesson.title} Knowledge Check`}
              questions={lesson.knowledgeChecks}
            />
          ) : null}
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.objectives.map((objective) => (
                <div key={objective} className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {objective}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.keyTakeaways.map((takeaway) => (
                <div
                  key={takeaway}
                  className="flex gap-3 rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Lesson Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3">
                <Link
                  href={previousHref}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-2xl")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
                <Button
                  className="w-full rounded-2xl"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await completeLessonAction({ lessonId: lesson.id });
                      router.push(nextHref);
                      router.refresh();
                    })
                  }
                >
                  {pending ? "Saving..." : isComplete ? nextLabel : "Mark Complete and Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
