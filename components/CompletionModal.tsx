"use client";

import { useState, useEffect } from "react";
import { X, Check, Droplets, Cookie, Sparkles, Heart, Apple, Moon, Trash2 } from "lucide-react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompletionData) => void;
  onDelete?: () => void;
  workout: {
    id: number;
    date: string;
    workoutType: string;
    milesPlanned: number;
    workoutDescription: string;
    isLongRun: boolean;
  };
  existingCompletion?: {
    actualMiles: number | null;
    durationMinutes: number | null;
    rpe: number | null;
    notes: string | null;
    fuelingCarbsPerHour: number | null;
    fuelingHydration: string | null;
  };
}

export interface CompletionData {
  workoutId: number;
  actualMiles: number | null;
  durationMinutes: number | null;
  rpe: number | null;
  notes: string;
  fuelingCarbsPerHour: number | null;
  fuelingHydration: string;
}

// Recovery reminder tips based on workout intensity
const getRecoveryTips = (milesRun: number, isLongRun: boolean) => {
  const isHardWorkout = milesRun >= 10 || isLongRun;
  
  return [
    {
      icon: Heart,
      title: "Stretch",
      description: isHardWorkout 
        ? "15-20 min of gentle stretching. Focus on quads, hamstrings, calves, and hip flexors."
        : "10-15 min light stretching. Hit the major muscle groups.",
      color: "#ef4444",
    },
    {
      icon: Droplets,
      title: "Hydrate",
      description: isHardWorkout
        ? "Drink 20-24 oz water within 30 min. Add electrolytes after runs over 60 min."
        : "Drink 16-20 oz water within the next 30 minutes.",
      color: "#3b82f6",
    },
    {
      icon: Apple,
      title: "Refuel",
      description: isHardWorkout
        ? "Eat within 30-45 min: 20-30g protein + 50-80g carbs. Recovery shake or chocolate milk works great!"
        : "Eat a balanced meal within 1-2 hours. Include protein and carbs.",
      color: "#22c55e",
    },
    {
      icon: Moon,
      title: "Rest",
      description: isHardWorkout
        ? "Prioritize 8-9 hours sleep tonight. Consider foam rolling and compression."
        : "Listen to your body. Take it easy the rest of the day.",
      color: "#8b5cf6",
    },
  ];
};

export function CompletionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  workout,
  existingCompletion,
}: CompletionModalProps) {
  const [actualMiles, setActualMiles] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [rpe, setRpe] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  const [carbsPerHour, setCarbsPerHour] = useState<string>("");
  const [hydration, setHydration] = useState<string>("");
  const [showRecoveryReminder, setShowRecoveryReminder] = useState(false);
  const [savedMiles, setSavedMiles] = useState<number>(0);

  useEffect(() => {
    if (existingCompletion) {
      setActualMiles(existingCompletion.actualMiles?.toString() || "");
      setDuration(existingCompletion.durationMinutes?.toString() || "");
      setRpe(existingCompletion.rpe || 5);
      setNotes(existingCompletion.notes || "");
      setCarbsPerHour(existingCompletion.fuelingCarbsPerHour?.toString() || "");
      setHydration(existingCompletion.fuelingHydration || "");
    } else {
      setActualMiles(workout.milesPlanned.toString());
      setDuration("");
      setRpe(5);
      setNotes("");
      setCarbsPerHour("");
      setHydration("");
    }
    setShowRecoveryReminder(false);
  }, [existingCompletion, workout, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const miles = actualMiles ? parseFloat(actualMiles) : workout.milesPlanned;
    setSavedMiles(miles);
    
    onSave({
      workoutId: workout.id,
      actualMiles: actualMiles ? parseFloat(actualMiles) : null,
      durationMinutes: duration ? parseInt(duration) : null,
      rpe,
      notes,
      fuelingCarbsPerHour: carbsPerHour ? parseInt(carbsPerHour) : null,
      fuelingHydration: hydration,
    });
    
    // Show recovery reminder for new completions (not updates)
    if (!existingCompletion) {
      setShowRecoveryReminder(true);
    }
  };
  
  const handleCloseRecovery = () => {
    setShowRecoveryReminder(false);
    onClose();
  };

  const rpeLabels: Record<number, string> = {
    1: "Very Easy",
    2: "Easy",
    3: "Light",
    4: "Moderate",
    5: "Somewhat Hard",
    6: "Hard",
    7: "Very Hard",
    8: "Very Very Hard",
    9: "Near Max",
    10: "Maximum",
  };

  const showFueling = workout.isLongRun || workout.milesPlanned >= 14;

  // Show recovery reminder after saving
  if (showRecoveryReminder) {
    const recoveryTips = getRecoveryTips(savedMiles, workout.isLongRun);
    
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleCloseRecovery}
        />
        
        <div className="relative w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border text-center bg-gradient-to-r from-success/20 to-accent/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-success" />
              <h2 className="text-lg font-bold text-success">Great Run!</h2>
              <Sparkles className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted">
              {savedMiles} miles logged. Now focus on recovery.
            </p>
          </div>
          
          {/* Recovery Tips */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
            <p className="text-sm font-medium text-center text-muted mb-4">
              Your post-run recovery checklist:
            </p>
            
            {recoveryTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="flex gap-3 p-3 bg-background rounded-lg border border-border"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${tip.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tip.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: tip.color }}>
                      {tip.title}
                    </h3>
                    <p className="text-sm text-muted">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleCloseRecovery}
              className="w-full py-4 bg-accent text-background rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
            >
              <Check className="w-6 h-6" />
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">
            {existingCompletion ? "Update Log" : "Log Workout"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Workout info */}
          <div className="bg-background rounded-lg p-3">
            <p className="text-sm text-muted">{new Date(workout.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            <p className="font-semibold">{workout.workoutType}</p>
            <p className="text-sm text-muted">{workout.workoutDescription}</p>
          </div>

          {/* Miles */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Actual Miles
            </label>
            <input
              type="number"
              step="0.1"
              value={actualMiles}
              onChange={(e) => setActualMiles(e.target.value)}
              placeholder={workout.milesPlanned.toString()}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg font-mono text-lg focus:outline-none focus:border-accent"
            />
            <p className="text-xs text-muted mt-1">
              Planned: {workout.milesPlanned} miles
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 45"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg font-mono text-lg focus:outline-none focus:border-accent"
            />
          </div>

          {/* RPE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Perceived Effort (RPE): {rpe} — {rpeLabels[rpe]}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rpe}
              onChange={(e) => setRpe(parseInt(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>Easy</span>
              <span>Hard</span>
              <span>Max</span>
            </div>
          </div>

          {/* Fueling (for long runs) */}
          {showFueling && (
            <div className="space-y-4 p-4 bg-type-long/10 rounded-lg border border-type-long/30">
              <div className="flex items-center gap-2 text-type-long font-medium">
                <Cookie className="w-5 h-5" />
                Fueling Log (Long Run)
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Carbs per hour (g)
                </label>
                <input
                  type="number"
                  value={carbsPerHour}
                  onChange={(e) => setCarbsPerHour(e.target.value)}
                  placeholder="e.g., 45"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Hydration / Electrolytes
                </label>
                <input
                  type="text"
                  value={hydration}
                  onChange={(e) => setHydration(e.target.value)}
                  placeholder="e.g., 2 bottles water + Nuun"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Weather, route, shoes..."
              rows={3}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-accent text-background rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
          >
            <Check className="w-6 h-6" />
            {existingCompletion ? "Update Log" : "Mark Complete"}
          </button>

          {existingCompletion && onDelete && (
            <button
              onClick={onDelete}
              className="w-full py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Log
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
