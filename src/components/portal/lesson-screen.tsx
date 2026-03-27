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
  courseId: string;
  module: Module;
  lesson: Lesson;
  isComplete: boolean;
  previousHref: string;
  nextHref: string;
  nextLabel: string;
};

export function LessonScreen({
  courseId,
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
      <section className="glass-surface-strong relative overflow-hidden rounded-[2rem] px-6 py-8 shadow-[var(--glass-shadow-lg)]">
        <div className="pointer-events-none absolute inset-0 glass-highlight" />
        <div className="relative flex flex-wrap items-center gap-3">
          <Badge className="rounded-full border border-[var(--glass-border)] bg-foreground/10 px-4 py-1 text-foreground hover:bg-foreground/15">
            {module.title}
          </Badge>
          {lesson.sourceSlides.length ? (
            <SourceSlideBadges sourceSlides={lesson.sourceSlides} />
          ) : (
            <Badge variant="outline" className="rounded-full border-[var(--glass-border)] bg-foreground/5 px-3 py-1 text-foreground">
              Custom lesson
            </Badge>
          )}
          <Badge
            variant="outline"
            className="rounded-full border-[var(--glass-border)] bg-foreground/5 px-3 py-1 text-foreground"
          >
            {isComplete ? "Completed" : "In progress"}
          </Badge>
        </div>

        <h2 className="relative mt-4 text-4xl font-semibold tracking-tight text-foreground">{lesson.title}</h2>
        {lesson.description ? (
          <p className="relative mt-4 max-w-4xl text-base leading-8 text-muted-foreground">
            {lesson.description}
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <Card className="rounded-[2rem]">
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
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.objectives.map((objective) => (
                <div key={objective} className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 px-4 py-3 text-sm text-foreground/80">
                  {objective}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lesson.keyTakeaways.map((takeaway) => (
                <div
                  key={takeaway}
                  className="flex gap-3 rounded-3xl border border-[var(--glass-border)] bg-foreground/5 px-4 py-3 text-sm text-foreground/80"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
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
                      await completeLessonAction({ courseId, lessonId: lesson.id });
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
