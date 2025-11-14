# Placement Assessment System - Implementation Summary

## Overview

This document summarizes the placement assessment system added to the dyslexia intervention app. The system personalizes learning pathways by assessing students' current skill levels and recommending appropriate starting modules, difficulty levels, and content to skip.

## Why Placement Assessment?

### Evidence-Based Rationale
- **Individualized instruction** is more effective than one-size-fits-all (RESEARCH.md)
- Students with dyslexia have **highly varied skill profiles**
- **Time optimization**: Low-income families may have limited device access
- **Engagement**: Students succeed faster when content matches their skill level
- **Baseline data**: Enables meaningful progress tracking over time

### Target Metrics
- Assessment completion time: **< 7 minutes**
- Student satisfaction: **90%+ find exercises "just right" difficulty**
- Data capture: **100% of students have baseline scores for core skills**

## Database Schema (Supabase)

### New Tables Added

#### `placement_assessments`
Stores overall assessment sessions and results.

**Key fields:**
- `student_id` - Links to student
- `assessment_type` - 'initial', 'progress_check', 'reassessment'
- `phoneme_awareness_score`, `letter_sound_score`, `decoding_score` (0-100)
- `fluency_wcpm` - Words Correct Per Minute (optional)
- `recommended_module` (1, 2, or 3)
- `recommended_difficulty` (1-10)
- `skip_exercises` (JSONB array)
- `assessment_data` (JSONB) - Full breakdown

#### `placement_assessment_items`
Stores individual test items and student responses.

**Key fields:**
- `assessment_id` - Links to parent assessment
- `domain` - 'phoneme_awareness', 'letter_sounds', 'decoding'
- `item_type` - Specific exercise type
- `difficulty_level` (1-10)
- `item_content` (JSONB) - Question data
- `student_response`, `correct_response` (JSONB)
- `is_correct`, `response_time_ms`

#### `student_placement`
Stores current placement and customization per student (1 row per student).

**Key fields:**
- `student_id` - One placement per student
- `placement_assessment_id` - Links to source assessment
- `current_module`, `current_difficulty`
- `skipped_exercises` (JSONB) - Mastered content to skip
- `unlocked_modules` (JSONB) - Available modules
- `next_reassessment_due` - Trigger for periodic check
- `manual_override` - Parent/educator can override
- `override_reason`, `override_by`

#### `baseline_skills`
Stores skill-by-skill baseline for progress comparison.

**Key fields:**
- `student_id`, `placement_assessment_id`
- `skill_category`, `skill_name`
- `baseline_score`, `baseline_accuracy`, `baseline_speed_ms`
- `items_tested`, `items_correct`

## Assessment Content

### What Gets Tested (25 items, ~7 minutes)

1. **Phoneme Awareness** (5 items)
   - Sound identification (beginning/ending/middle)
   - Phoneme segmentation
   - Varying difficulty: 1-5

2. **Letter-Sound Knowledge** (10 items)
   - Consonants (b, t, m, s, etc.)
   - Short vowels (a, e, i, o, u)
   - Common digraphs (ch, sh, th)
   - Varying difficulty: 1-5

3. **Decoding** (10 items)
   - 5 real words (cat, dog, fish, jump, black)
   - 5 pseudowords (zat, tope, flig, brank, screlt)
   - Tests actual decoding skill vs. sight memorization
   - Varying difficulty: 1-8

## Placement Algorithm

### Scoring Logic

```typescript
type PlacementScores = {
  phoneme_awareness: number;  // 0-100 (5 items x 20 points each)
  letter_sound: number;       // 0-100 (10 items x 10 points each)
  decoding: number;           // 0-100 (10 items x 10 points each)
};

type PlacementResult = {
  recommended_module: 1 | 2 | 3;
  recommended_difficulty: number; // 1-10
  skip_exercises: string[];
};
```

### Decision Tree

**Module 1: Phonological Awareness**
- IF `phoneme_awareness <= 40` → Start Module 1, Difficulty 1
- IF `phoneme_awareness 41-70` → Start Module 1, Difficulty 2, Skip beginner exercises
- IF `phoneme_awareness 71-100` AND `letter_sound <= 50` → Start Module 1, Difficulty 3

**Module 2: Phonics & Decoding**
- IF `phoneme_awareness >= 70` AND `letter_sound 51-70` → Start Module 2, Difficulty 1
- IF `phoneme_awareness >= 70` AND `letter_sound 71-100` AND `decoding <= 50` → Start Module 2, Difficulty 2

**Module 3: Word Recognition & Fluency**
- IF ALL scores >= 70 → Start Module 3, Difficulty varies by decoding score

## Implementation Roadmap

### Sprint 5 (Weeks 9-10): Placement Assessment System
**Status:** Planned (Post-MVP Priority 1)

**Stories:**
1. Design assessment content & scoring
2. Build placement UI (mobile-first)
3. Implement database tables & algorithm
4. Integrate into user flow (first login)
5. Build baseline tracking
6. Add manual override for educators

**Dependencies:**
- Module 1 exercises complete (for reuse of UI patterns)
- Supabase schema migrations ready
- Progress dashboard exists (to show baseline comparison)

### Post-Pilot Features (Backlog - High Priority)

1. **Periodic Reassessment** (every 4-6 weeks)
   - Abbreviated assessment (faster than initial)
   - Update placement if skills improved
   - Generate growth trajectory report

2. **Dynamic Exercise Skipping**
   - Auto-skip mastered exercises (90%+ accuracy)
   - Update `skipped_exercises` dynamically
   - "Unlocked!" badge for new content

3. **Struggling Skills Detection**
   - Flag skills below expected progress
   - Recommend focused practice
   - Alert parent/educator

## User Experience Flow

### For New Students

```
1. [Sign Up / First Login]
   ↓
2. [Welcome: "Let's find your perfect starting point!"]
   ↓
3. [Placement Assessment - 7 minutes]
   - Progress: "Item 5 of 25"
   - Feels like a game
   ↓
4. [Results Screen]
   "Great job! Based on your skills, we recommend:
    • Starting with: Module 1 - Sound Detective
    • Difficulty: Level 2

    [Start Learning] [View Details]"
   ↓
5. [Jump directly to recommended exercise]
```

### For Parents/Educators

**Dashboard View:**
- **Placement Results Card**
  - Date taken
  - Phoneme Awareness: 65/100
  - Letter-Sound Knowledge: 45/100
  - Decoding: 30/100
  - Recommendation: Module 1, Level 2
  - [View Detailed Report] [Override Placement]

- **Progress Comparison**
  - Chart: Baseline (Week 1) → Current (Week 6)
  - Growth indicators (+15 points in phoneme awareness!)

### For Returning Students

- Skip assessment
- Resume where they left off
- Settings: "Re-take Placement Test" (if they want to reassess)

## Technical Implementation Notes

### Reuse Existing Components
- Assessment exercises use same UI as regular exercises
- `SoundIdentificationMock` pattern → `PlacementSoundId`
- Minimal new code, maximum reuse

### Database Schema Location
- **TECHNICAL_PLAN.md** lines 434-559 (full SQL schema)
- Migrations go in `frontend/supabase/migrations/`

### API Integration
```typescript
// Supabase queries
const { data } = await supabase
  .from('placement_assessments')
  .select('*, baseline_skills(*)')
  .eq('student_id', studentId)
  .order('completed_at', { ascending: false })
  .limit(1);
```

## Success Metrics

### During Implementation
- [ ] Assessment completion rate > 85%
- [ ] Average completion time < 7 minutes
- [ ] Mobile usability score (Lighthouse) > 90

### Post-Launch
- [ ] 90%+ students report exercises are "just right" difficulty
- [ ] Engagement rate +20% vs. no-placement control group
- [ ] Parent satisfaction with recommendations > 85%
- [ ] Baseline data captured for 100% of students

## Future Enhancements

1. **Adaptive Assessment** - CAT (Computerized Adaptive Testing)
   - Adjust difficulty mid-assessment based on responses
   - Reduce total items needed (25 → 15-20)

2. **Multi-Language Assessments**
   - Spanish placement test
   - Other languages per i18n roadmap

3. **IEP Integration**
   - Export placement results to PDF
   - Include in IEP packets for schools

4. **Machine Learning Placement**
   - Use historical data to improve accuracy
   - Predict optimal module better than rules-based algorithm

## Files Modified

### Documentation
- **docs/TECHNICAL_PLAN.md** - Added placement tables to schema (lines 434-559)
- **docs/TECHNICAL_PLAN.md** - Added Week 9-10 sprint, updated timeline
- **docs/plan/SPRINT_PLAN.md** - Expanded Sprint 5 with detailed placement stories
- **docs/plan/SPRINT_PLAN.md** - Added reassessment to high-priority backlog
- **docs/plan/PLACEMENT_SYSTEM_SUMMARY.md** - This document (NEW)

### Code
- No code changes yet (schema designed, implementation planned for Sprint 5)

## References

- **RESEARCH.md** - Evidence-based intervention methods
- **FEATURE_DESIGN.md** - Module structure (Modules 1-3)
- **TECHNICAL_PLAN.md** - Database schema, API design
- **SPRINT_PLAN.md** - Sprint 5 detailed stories

---

**Document Version:** 1.0
**Last Updated:** 2025-11-14
**Status:** Schema designed, implementation planned for Sprint 5 (Post-MVP)
