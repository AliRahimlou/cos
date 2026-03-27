"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type TeamRecord = {
  id: string;
  name: string;
  title: string;
  status: string;
  completionPercent: number;
  quizAverage: number | null;
  nextHref: string | null;
};

export function TeamView({ records }: { records: TeamRecord[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      records.filter((record) =>
        `${record.name} ${record.title} ${record.status}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [query, records],
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search learner, title, or status"
              className="h-12 rounded-2xl pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((record) => (
          <Card key={record.id} className="rounded-[2rem] border-0 shadow-lg">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{record.name}</h3>
                  <p className="text-sm text-slate-500">{record.title}</p>
                </div>
                <Badge className="rounded-full">{record.status}</Badge>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span>Training Progress</span>
                    <span>{record.completionPercent}%</span>
                  </div>
                  <Progress value={record.completionPercent} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Quiz Average</span>
                  <span>{record.quizAverage ?? "No quizzes yet"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next Route</span>
                  <span className="max-w-[11rem] truncate text-right text-slate-500">
                    {record.nextHref ?? "No next step"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
