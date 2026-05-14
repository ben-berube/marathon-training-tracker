export interface TemplateWorkout {
  weekNumber: number;
  dayOfWeek: number; // 0=Mon .. 6=Sun
  dayLabel: string;
  milesPlanned: number;
  type: string;
  workout: string;
  isTaperWeek: boolean;
  isLongRun: boolean;
  isRaceDay: boolean;
}

// Full Marathon: 8-week intermediate plan
// Peak long run 20mi, race 26.2mi, ~33-45 mi/wk
export const fullMarathonTemplate: TemplateWorkout[] = [
  // Week 1 — Build (~33 mi)
  { weekNumber: 1, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + 15-25 min mobility (hips/calves)", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 5, type: "Hills", workout: "WU, 6x60 sec uphill (strong effort), easy jog down, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 6, type: "MP", workout: "2 E + 3 at MP + 1 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT 30-45 min easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 4, type: "Easy+Strides", workout: "Easy + 4-6 strides", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 14, type: "Long", workout: "Long run E", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 2 — Build (~37 mi)
  { weekNumber: 2, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + strength 20-30 min", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 6, type: "Intervals", workout: "WU, 5x800m (10K-ish) w/ equal easy jog, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 5, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 7, type: "Steady/MP", workout: "Mostly E, finish with 2 mi at MP", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT 30-45 min easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 4, type: "Easy+Strides", workout: "Easy + 4-6 strides", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 15, type: "Long", workout: "Long run E", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 3 — Build (~40 mi)
  { weekNumber: 3, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + strength 20-30 min", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 6, type: "Hills", workout: "WU, 5x2 min uphill (strong but controlled), jog down, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 5, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 8, type: "Tempo", workout: "2 E + 4 mi T + 2 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 5, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 16, type: "Long", workout: "Long run E (last 2 mi steady if feeling good)", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 4 — Build (~43 mi)
  { weekNumber: 4, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + mobility + light strength", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 7, type: "Intervals", workout: "WU, 3x1 mile (10K-ish) w/ 3 min easy jog, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 5, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 9, type: "MP", workout: "2 E + 5 at MP (split 3+2 ok) + 2 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 4, type: "Easy+Strides", workout: "Easy + strides", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 18, type: "Long", workout: "Long run E (practice fueling)", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 5 — Peak (~45 mi)
  { weekNumber: 5, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest (prioritize sleep)", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 7, type: "Hills", workout: "WU, 8x60 sec uphill, jog down, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 6, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 8, type: "MP", workout: "2 E + 5 at MP + 1 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 20, type: "Long", workout: "20 mi long E; optional last 3-4 mi at MP if smooth", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 6 — Taper 1 (~36 mi)
  { weekNumber: 6, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + mobility", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 6, type: "Speed", workout: "WU, 6x400m (5K-ish) w/ easy jog, CD", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 5, type: "Easy", workout: "Easy run", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 7, type: "MP", workout: "2 E + 3 at MP + 2 E", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest", workout: "Rest", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 4, type: "Easy+Strides", workout: "Easy + strides", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 14, type: "Long", workout: "Long run E", isTaperWeek: true, isLongRun: true, isRaceDay: false },

  // Week 7 — Taper 2 (~28 mi)
  { weekNumber: 7, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + very light strength (optional)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 5, type: "Intervals", workout: "WU, 3x1K (10K-ish) w/ easy jog, CD", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 6, type: "MP", workout: "2 E + 2-3 at MP + E to finish", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest", workout: "Rest", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 3, type: "Easy+Strides", workout: "Easy + 4 strides", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 10, type: "Long", workout: "10 mi long E", isTaperWeek: true, isLongRun: false, isRaceDay: false },

  // Week 8 — Race week
  { weekNumber: 8, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest (or optional 3 mi E)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 5, type: "Easy+Strides", workout: "5 mi E + 6x20 sec strides", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 3, type: "Sharpen", workout: "3 mi E with 2x5 min at MP (easy between)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest", workout: "Rest", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 2, type: "Shakeout", workout: "2 mi very easy + 4 short strides (or full rest)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 26.2, type: "Race", workout: "Marathon race day!", isTaperWeek: true, isLongRun: false, isRaceDay: true },
];

// Half Marathon: 8-week intermediate plan
// Peak long run 12mi, race 13.1mi, ~22-33 mi/wk
export const halfMarathonTemplate: TemplateWorkout[] = [
  // Week 1 — Base (~22 mi)
  { weekNumber: 1, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + 15-25 min mobility (hips/calves)", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 4, type: "Hills", workout: "WU, 4x60 sec uphill (strong effort), easy jog down, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 3, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 5, type: "MP", workout: "1.5 E + 2 at MP + 1.5 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT 30-45 min easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 3, type: "Easy+Strides", workout: "Easy + 4-6 strides", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 1, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 7, type: "Long", workout: "Long run E", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 2 — Base (~25 mi)
  { weekNumber: 2, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + strength 20-30 min", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 5, type: "Intervals", workout: "WU, 4x800m (10K-ish) w/ equal easy jog, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 3, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 5, type: "Steady/MP", workout: "Mostly E, finish with 1.5 mi at MP", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT 30-45 min easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 3, type: "Easy+Strides", workout: "Easy + 4-6 strides", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 2, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 9, type: "Long", workout: "Long run E", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 3 — Build (~28 mi)
  { weekNumber: 3, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + strength 20-30 min", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 5, type: "Hills", workout: "WU, 5x90 sec uphill (strong but controlled), jog down, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 6, type: "Tempo", workout: "1.5 E + 3 mi T + 1.5 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 3, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 3, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 10, type: "Long", workout: "Long run E", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 4 — Build (~31 mi)
  { weekNumber: 4, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + mobility + light strength", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 5, type: "Intervals", workout: "WU, 5x800m (10K-ish) w/ equal easy jog, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 7, type: "MP", workout: "2 E + 3 at MP + 2 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 4, type: "Easy+Strides", workout: "Easy + strides", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 4, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 11, type: "Long", workout: "Long run E (practice fueling if 90+ min)", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 5 — Peak (~33 mi)
  { weekNumber: 5, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest (prioritize sleep)", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 6, type: "Hills", workout: "WU, 6x60 sec uphill, jog down, CD", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 7, type: "Tempo", workout: "2 E + 3 mi T + 2 E", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest/XT", workout: "Rest or XT easy", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: false, isLongRun: false, isRaceDay: false },
  { weekNumber: 5, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 12, type: "Long", workout: "12 mi long E; optional last 2 mi at MP if smooth", isTaperWeek: false, isLongRun: true, isRaceDay: false },

  // Week 6 — Taper 1 (~26 mi)
  { weekNumber: 6, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + mobility", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 5, type: "Speed", workout: "WU, 4x400m (5K-ish) w/ easy jog, CD", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 4, type: "Easy", workout: "Easy run", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 5, type: "MP", workout: "1.5 E + 2 at MP + 1.5 E", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest", workout: "Rest", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 3, type: "Easy+Strides", workout: "Easy + strides", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 6, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 9, type: "Long", workout: "Long run E", isTaperWeek: true, isLongRun: true, isRaceDay: false },

  // Week 7 — Taper 2 (~19 mi)
  { weekNumber: 7, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest + very light strength (optional)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 4, type: "Intervals", workout: "WU, 3x1K (10K-ish) w/ easy jog, CD", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 3, type: "Easy", workout: "Easy run", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 4, type: "MP", workout: "1.5 E + 2 at MP + 0.5 E", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest", workout: "Rest", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 3, type: "Easy+Strides", workout: "Easy + 4 strides", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 7, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 5, type: "Easy", workout: "Easy 5 mi", isTaperWeek: true, isLongRun: false, isRaceDay: false },

  // Week 8 — Race week
  { weekNumber: 8, dayOfWeek: 0, dayLabel: "Mon", milesPlanned: 0, type: "Rest", workout: "Rest (or optional 2 mi E)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 1, dayLabel: "Tue", milesPlanned: 4, type: "Easy+Strides", workout: "4 mi E + 4x20 sec strides", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 2, dayLabel: "Wed", milesPlanned: 3, type: "Easy", workout: "Easy run", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 3, dayLabel: "Thu", milesPlanned: 2, type: "Sharpen", workout: "2 mi E with 2x3 min at MP (easy between)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 4, dayLabel: "Fri", milesPlanned: 0, type: "Rest", workout: "Rest", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 5, dayLabel: "Sat", milesPlanned: 2, type: "Shakeout", workout: "2 mi very easy + 4 short strides (or full rest)", isTaperWeek: true, isLongRun: false, isRaceDay: false },
  { weekNumber: 8, dayOfWeek: 6, dayLabel: "Sun", milesPlanned: 13.1, type: "Race", workout: "Half marathon race day!", isTaperWeek: true, isLongRun: false, isRaceDay: true },
];

export function getTemplate(distance: string): TemplateWorkout[] {
  return distance === "half" ? halfMarathonTemplate : fullMarathonTemplate;
}

export function getRaceDistance(distance: string): number {
  return distance === "half" ? 13.1 : 26.2;
}
