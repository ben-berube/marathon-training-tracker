"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Trophy, ChevronRight } from "lucide-react";
import { getRaceDistance } from "@/lib/plan-templates";
import { getPlanStartDate } from "@/lib/generate-plan";

export default function SetupPage() {
  const router = useRouter();
  const [raceName, setRaceName] = useState("");
  const [raceLocation, setRaceLocation] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [distance, setDistance] = useState<"full" | "half">("full");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planStart = raceDate ? getPlanStartDate(raceDate) : null;
  const raceDistance = getRaceDistance(distance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raceName, raceLocation, raceDate, distance }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Setup failed");
      }

      localStorage.setItem("raceConfigured", "true");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isValid = raceName.trim() && raceLocation.trim() && raceDate;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold">Race Training</h1>
          <p className="text-muted">
            Set up your race and get a personalized 8-week training plan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Race Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted uppercase tracking-wider">
              Race Name
            </label>
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                placeholder="e.g. Hawaii Half Marathon"
                className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted uppercase tracking-wider">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={raceLocation}
                onChange={(e) => setRaceLocation(e.target.value)}
                placeholder="e.g. Honolulu, HI"
                className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Race Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted uppercase tracking-wider">
              Race Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="date"
                value={raceDate}
                onChange={(e) => setRaceDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:border-accent focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Distance Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted uppercase tracking-wider">
              Distance
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDistance("full")}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                  distance === "full"
                    ? "bg-accent/20 border-accent text-accent"
                    : "bg-surface border-border text-muted hover:border-muted"
                }`}
              >
                <div className="text-lg font-bold">26.2 mi</div>
                <div className="text-xs mt-0.5">Full Marathon</div>
              </button>
              <button
                type="button"
                onClick={() => setDistance("half")}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-all ${
                  distance === "half"
                    ? "bg-accent/20 border-accent text-accent"
                    : "bg-surface border-border text-muted hover:border-muted"
                }`}
              >
                <div className="text-lg font-bold">13.1 mi</div>
                <div className="text-xs mt-0.5">Half Marathon</div>
              </button>
            </div>
          </div>

          {/* Plan Preview */}
          {planStart && (
            <div className="bg-surface rounded-xl border border-border p-4 space-y-2">
              <p className="text-sm font-medium">Your 8-Week Plan</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Training starts</span>
                <span className="font-mono">
                  {new Date(planStart + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Race day</span>
                <span className="font-mono text-accent">
                  {new Date(raceDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Race distance</span>
                <span className="font-mono">{raceDistance} miles</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              isValid && !loading
                ? "bg-accent text-background hover:bg-accent-hover"
                : "bg-surface text-muted border border-border cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="animate-pulse">Setting up your plan...</span>
            ) : (
              <>
                Start Training
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
