"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader, RefreshCw, Sparkles } from "lucide-react";

import { Button } from "/components/ui/button";
import { getSpendingInsights } from "../ai-actions";
import type { SpendingInsights } from "../ai-actions";

type InsightsStatus = "idle" | "loading" | "ready" | "error";

interface AIInsightsProps {
  enabled: boolean;
}

function AIInsights({ enabled }: AIInsightsProps) {
  const [status, setStatus] = useState<InsightsStatus>("idle");
  const [insights, setInsights] = useState<SpendingInsights | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (forceRefresh: boolean) => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setStatus("loading");

    try {
      const result = await getSpendingInsights(forceRefresh);
      if (requestId.current !== currentRequest) return;

      if (!result.ok) {
        setInsights(null);
        setStatus("error");
        return;
      }

      setInsights(result.data);
      setStatus("ready");
    } catch {
      if (requestId.current !== currentRequest) return;
      setInsights(null);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    load(false);
  }, [enabled, load]);

  const loading = status === "idle" || status === "loading";

  return (
    <section className="mt-6 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-foreground" aria-hidden />
          <h2 className="font-bold text-lg">AI Insights</h2>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!enabled || loading}
          onClick={() => load(true)}
        >
          {status === "loading" ? (
            <Loader className="animate-spin" aria-hidden />
          ) : (
            <RefreshCw aria-hidden />
          )}
          Refresh
        </Button>
      </div>

      <div aria-live="polite">
        {loading && (
          <div role="status" aria-label="Loading insights" className="mt-4 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-accent" />
            <div className="h-4 w-full animate-pulse rounded bg-accent" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-accent" />
          </div>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-muted-foreground">
            Insights are unavailable right now.
          </p>
        )}

        {status === "ready" && insights && (
          <div className="mt-3">
            <p className="text-sm text-foreground">{insights.summary}</p>
            {insights.tips.length > 0 && (
              <ul className="mt-3 space-y-2">
                {insights.tips.map((tip, index) => (
                  <li
                    key={`${index}-${tip}`}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span aria-hidden className="text-foreground">
                      •
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default AIInsights;
