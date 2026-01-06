"use client";

import { useState } from "react";
import {
  Mountain,
  Zap,
  Target,
  Timer,
  Heart,
  Moon,
  Footprints,
  Trophy,
  Droplets,
  Apple,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Section = "types" | "nutrition" | "hydration" | "race";

const runTypes = [
  {
    type: "Easy",
    icon: Heart,
    color: "#6b7280",
    rpe: "3-4",
    description: "Conversational pace where you can easily hold a conversation. Builds aerobic base and promotes recovery.",
    tips: "Most of your runs should be easy. If you can't talk comfortably, slow down!",
  },
  {
    type: "Long",
    icon: Footprints,
    color: "#f97316",
    rpe: "4-5",
    description: "Extended duration at easy pace. Builds endurance, teaches your body to burn fat, and prepares you mentally for race distance.",
    tips: "Start slower than you think. Practice your race-day fueling strategy on these runs.",
  },
  {
    type: "Tempo",
    icon: Timer,
    color: "#06b6d4",
    rpe: "6-7",
    description: "Comfortably hard pace you could sustain for about an hour. Improves lactate threshold.",
    tips: "Should feel controlled but challenging. You can speak in short sentences.",
  },
  {
    type: "MP",
    icon: Target,
    color: "#3b82f6",
    rpe: "5-6",
    description: "Marathon Pace - your target race pace. Teaches your body to run efficiently at goal speed.",
    tips: "Practice pacing. Use a GPS watch to stay consistent.",
  },
  {
    type: "Intervals",
    icon: Zap,
    color: "#8b5cf6",
    rpe: "8-9",
    description: "Fast repeats with recovery periods. Improves VO2max, speed, and running economy.",
    tips: "Focus on consistent splits. Don't start too fast. Recovery jogs should be truly easy.",
  },
  {
    type: "Hills",
    icon: Mountain,
    color: "#ef4444",
    rpe: "7-8",
    description: "Hill repeats for strength and power. Builds leg strength and improves running form.",
    tips: "Drive your knees, pump your arms, and stay tall. Recover on the way down.",
  },
  {
    type: "Strides",
    icon: Zap,
    color: "#6b7280",
    rpe: "7-8",
    description: "Short 20-30 second accelerations to near-sprint. Improves form, turnover, and neuromuscular coordination.",
    tips: "Smooth acceleration, not explosive sprinting. Focus on quick, light feet.",
  },
  {
    type: "Rest",
    icon: Moon,
    color: "#404040",
    rpe: "0-2",
    description: "Full rest or light cross-training. Essential for adaptation and preventing injury.",
    tips: "Rest is when your body gets stronger. Don't skip rest days or make them hard.",
  },
  {
    type: "Race",
    icon: Trophy,
    color: "#fbbf24",
    rpe: "9-10",
    description: "Race day effort. All your training comes together. Trust your preparation!",
    tips: "Don't try anything new. Stick to your plan. Start conservative, finish strong.",
  },
];

const nutritionSections = [
  {
    id: "daily",
    title: "Daily Fueling",
    icon: Apple,
    content: [
      { label: "Carbohydrates", value: "5-7g per kg body weight during heavy training weeks" },
      { label: "Protein", value: "1.4-1.8g per kg for muscle repair and recovery" },
      { label: "Fats", value: "0.8-1g per kg for hormone function and energy" },
      { label: "Timing", value: "Eat every 3-4 hours to maintain energy levels" },
    ],
  },
  {
    id: "pre-run",
    title: "Pre-Run Nutrition",
    icon: Clock,
    content: [
      { label: "3-4 hours before", value: "Full meal: 300-500 cal, high carb, moderate protein, low fat/fiber" },
      { label: "1-2 hours before", value: "Light snack: 100-200 cal, easily digestible carbs (banana, toast)" },
      { label: "30 min before", value: "Optional: 100-150ml water, small carb if needed" },
      { label: "Avoid", value: "High fiber, high fat, new foods you haven't tested" },
    ],
  },
  {
    id: "during",
    title: "During-Run Fueling",
    icon: Flame,
    content: [
      { label: "Under 60 min", value: "Water only, no fuel needed" },
      { label: "60-90 min", value: "30-40g carbs/hour (1 gel or 500ml sports drink)" },
      { label: "90+ min", value: "40-60g carbs/hour - practice this on long runs!" },
      { label: "Options", value: "Gels, chews, sports drinks, real food (dates, dried fruit)" },
    ],
  },
  {
    id: "post-run",
    title: "Post-Run Recovery",
    icon: Droplets,
    content: [
      { label: "Within 30 min", value: "Consume 20-30g protein + 40-60g carbs" },
      { label: "Rehydration", value: "16-24 oz fluid per pound lost during exercise" },
      { label: "Recovery meal", value: "Within 2 hours: balanced meal with carbs, protein, vegetables" },
      { label: "Sleep", value: "7-9 hours for optimal recovery and adaptation" },
    ],
  },
];

const hydrationGuide = {
  daily: "Aim for half your body weight (lbs) in ounces of water daily. Add 16-24oz for every hour of exercise.",
  signs: [
    "Light yellow urine = well hydrated",
    "Dark yellow = drink more",
    "Clear = might be overhydrating",
  ],
  electrolytes: "For runs over 60 minutes or in heat, include sodium (300-600mg/hour) through sports drinks or salt tabs.",
};

const raceWeekNutrition = {
  title: "Race Week Strategy",
  days: [
    { day: "5-3 days out", tip: "Gradually increase carbs to 8-10g per kg body weight" },
    { day: "2 days out", tip: "Reduce fiber, eat familiar foods, stay well hydrated" },
    { day: "Night before", tip: "Carb-rich dinner by 7pm, nothing too heavy. Hydrate well." },
    { day: "Race morning", tip: "Wake 3-4 hrs early. 300-400 cal breakfast: bagel, banana, coffee if usual." },
    { day: "Pre-start", tip: "Sip water, have a gel 15 min before start if desired" },
  ],
};

export default function GuidePage() {
  const [expandedSection, setExpandedSection] = useState<Section | null>("types");

  const toggleSection = (section: Section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <header className="text-center py-2">
        <h1 className="text-2xl font-bold">Training Guide</h1>
        <p className="text-muted text-sm">Everything you need to know</p>
      </header>

      {/* Run Types Section */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => toggleSection("types")}
          className="w-full flex items-center justify-between p-4 hover:bg-background/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Footprints className="w-5 h-5 text-accent" />
            <span className="font-semibold">Run Types Glossary</span>
          </div>
          {expandedSection === "types" ? (
            <ChevronUp className="w-5 h-5 text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted" />
          )}
        </button>

        {expandedSection === "types" && (
          <div className="px-4 pb-4 space-y-3">
            {runTypes.map((run) => {
              const Icon = run.icon;
              return (
                <div
                  key={run.type}
                  className="bg-background rounded-lg p-3 border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${run.color}33` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: run.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{run.type}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${run.color}33`, color: run.color }}
                        >
                          RPE {run.rpe}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted mb-2">{run.description}</p>
                  <p className="text-xs text-accent italic">Tip: {run.tips}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Nutrition Section */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => toggleSection("nutrition")}
          className="w-full flex items-center justify-between p-4 hover:bg-background/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Apple className="w-5 h-5 text-success" />
            <span className="font-semibold">Nutrition Guide</span>
          </div>
          {expandedSection === "nutrition" ? (
            <ChevronUp className="w-5 h-5 text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted" />
          )}
        </button>

        {expandedSection === "nutrition" && (
          <div className="px-4 pb-4 space-y-4">
            {nutritionSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="bg-background rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <div className="space-y-2">
                    {section.content.map((item, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-accent font-medium min-w-[100px]">{item.label}:</span>
                        <span className="text-muted">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Hydration Section */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => toggleSection("hydration")}
          className="w-full flex items-center justify-between p-4 hover:bg-background/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Hydration</span>
          </div>
          {expandedSection === "hydration" ? (
            <ChevronUp className="w-5 h-5 text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted" />
          )}
        </button>

        {expandedSection === "hydration" && (
          <div className="px-4 pb-4">
            <div className="bg-background rounded-lg p-3 border border-border space-y-3">
              <p className="text-sm text-muted">{hydrationGuide.daily}</p>
              
              <div>
                <span className="text-sm font-medium text-accent">Check your hydration:</span>
                <ul className="mt-1 space-y-1">
                  {hydrationGuide.signs.map((sign, i) => (
                    <li key={i} className="text-sm text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-sm font-medium text-accent">Electrolytes:</span>
                <p className="text-sm text-muted mt-1">{hydrationGuide.electrolytes}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Race Week Section */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => toggleSection("race")}
          className="w-full flex items-center justify-between p-4 hover:bg-background/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5" style={{ color: "#fbbf24" }} />
            <span className="font-semibold">Race Week Strategy</span>
          </div>
          {expandedSection === "race" ? (
            <ChevronUp className="w-5 h-5 text-muted" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted" />
          )}
        </button>

        {expandedSection === "race" && (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {raceWeekNutrition.days.map((item, i) => (
                <div
                  key={i}
                  className="bg-background rounded-lg p-3 border border-border flex gap-3"
                >
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full h-fit whitespace-nowrap"
                    style={{ backgroundColor: "#fbbf2433", color: "#fbbf24" }}
                  >
                    {item.day}
                  </span>
                  <p className="text-sm text-muted">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Quick Reference Card */}
      <section className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl border border-accent/30 p-4">
        <h3 className="font-semibold mb-2">RPE Scale Quick Reference</h3>
        <div className="grid grid-cols-5 gap-1 text-center text-xs">
          {[
            { rpe: "1-2", label: "Very Easy", color: "#404040" },
            { rpe: "3-4", label: "Easy", color: "#6b7280" },
            { rpe: "5-6", label: "Moderate", color: "#3b82f6" },
            { rpe: "7-8", label: "Hard", color: "#f97316" },
            { rpe: "9-10", label: "Max", color: "#ef4444" },
          ].map((item) => (
            <div
              key={item.rpe}
              className="bg-surface rounded p-2 border border-border"
            >
              <div
                className="font-bold text-sm"
                style={{ color: item.color }}
              >
                {item.rpe}
              </div>
              <div className="text-muted text-[10px]">{item.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
