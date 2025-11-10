# Dyslexia Reading Software - Feature Design

## Software Vision

A comprehensive, computer-based reading intervention program that provides engaging, evidence-based exercises to help individuals with dyslexia develop reading skills while tracking measurable progress.

## Core Exercise Modules

### Instructional Scope and Sequence (Required)

All decoding/encoding exercises and connected texts must align to a clear, cumulative phonics scope‑and‑sequence. Placeholder sequence (adapt during curriculum development):
- Consonants and short vowels; CVC words
- Common digraphs (ch, sh, th, wh, ck) and initial/final blends
- CVCe (silent‑e), long vowels; soft c/g
- R‑controlled vowels (ar, er, ir, or, ur)
- Vowel teams/diphthongs (ai/ay, ee/ea, oa/ow, oi/oy, ou/ow, aw/au, ew/ui, etc.)
- Syllable types and division (closed, open, magic‑e, vowel team, r‑controlled, consonant‑le)
- Multisyllabic decoding strategies; morphology (common prefixes/suffixes)

Decodable passages and fluency texts should be controlled to taught patterns to support orthographic mapping and discourage guessing.

### Module 1: Phonological Awareness Training

#### 1.1 Sound Identification
**Exercise: "Sound Detective"**
- Audio plays a word, student identifies target sound
- Levels: beginning sound → ending sound → middle sound
- Visual feedback with animations
- Tracks accuracy and response time

**Exercise: "How Many Sounds?"**
- Present word (audio + text option)
- Student counts phonemes
- Progressive difficulty (cat=3 → script=6)
- Immediate feedback with sound breakdown

#### 1.2 Sound Manipulation
**Exercise: "Sound Swapper"**
- Show/say word (e.g., "cat")
- Prompt: "Change /k/ to /r/"
- Student types or selects answer
- Visual representation of sound positions
- Gamified with points for speed and accuracy

**Exercise: "Sound Builder"**
- Present individual sounds: /k/ /æ/ /t/
- Student blends to form word
- Progressively faster presentation
- Tracks blending speed improvement

#### 1.3 Rhyme Recognition
**Exercise: "Rhyme Time"**
- Present target word with audio/visual
- Show 4 options, student selects rhyme
- Mix with similar but non-rhyming words
- Difficulty increases with longer words

### Module 2: Phonics & Decoding

#### 2.1 Letter-Sound Association
**Exercise: "Letter Sound Match"**
- Flash letter or grapheme
- Student says sound (voice recording) or selects from options
- Include digraphs (ch, sh, th) and vowel teams
- Spaced repetition algorithm for retention

**Exercise: "Sound Sort"**
- Drag letters/graphemes to correct sound category
- Visual and auditory reinforcement
- Track mastery of each letter-sound pair

#### 2.2 Word Decoding Practice
**Exercise: "Word Builder Pro"**
- Present word with sound-by-sound breakdown
- Student practices decoding with highlighting
- Adjustable speed for pronunciation
- Real words and pseudowords mixed

**Exercise: "Decoder Challenge"**
- Timed word reading (CVC → CVCC → multisyllabic)
- Track accuracy and speed (words per minute)
- Immediate correction with sound breakdown
- Adaptive difficulty based on performance

#### 2.3 Decodable Text Alignment
- Provide short decodable sentences/passages aligned to the current code knowledge.
- Avoid untaught grapheme–phoneme patterns in controlled texts.
- Include repeated readings to consolidate accuracy then build rate.

### Module 3: Word Recognition & Fluency

#### 3.1 Sight Word Mastery
**Exercise: "Flash Cards 2.0"**
- High-frequency word practice
- Adaptive presentation based on response time
- Words mastered move to review pool
- Track total sight word vocabulary

**Exercise: "Sentence Speed"**
- Read sentences with high-frequency words
- Time tracking for fluency
- Comprehension check questions
- Progress from simple to complex sentences

#### 3.2 Oral Reading Fluency
**Exercise: "Story Reader"**
- Present age-appropriate passages
- Record student reading aloud
- Calculate WCPM automatically
- Track fluency improvement over time
- Option for repeated reading of same passage

**Exercise: "Fluency Sprint"**
- Timed reading challenges
- Progressive difficulty levels
- Visual progress bars and goals
- Celebrate personal bests

Note: If automated speech recognition (ASR) is used to compute WCPM, validate against human scoring with the target population and provide a manual fallback.

### Module 4: Reading Comprehension

#### 4.1 Literal Comprehension
**Exercise: "Story Questions"**
- Read short passages (with TTS support option)
- Answer who, what, when, where questions
- Immediate feedback with passage reference
- Track comprehension accuracy

#### 4.2 Vocabulary Building
**Exercise: "Word Explorer"**
- Introduce new words in context
- Multiple exposures in different sentences
- Visual supports (images, example uses)
- Review and practice activities

### Module 5: Spelling & Encoding

#### 5.1 Sound-to-Letter Practice
**Exercise: "Spell It Right"**
- Hear word, type spelling
- Sound-by-sound hints available
- Tracks common error patterns
- Adaptive practice on trouble areas

**Exercise: "Word Pattern Practice"**
- Focus on common patterns (CVC, CVCe, CVCC)
- Sorting and categorization
- Build pattern recognition
- Progressive complexity

## Progress Tracking & Measurement

### Dashboard Features

#### Student Dashboard
- **Today's Practice**: Quick access to daily exercises
- **Progress Overview**: Visual charts showing improvement
- **Achievements**: Badges and milestones unlocked
- **Streak Counter**: Days of consecutive practice
- **Current Level**: Overall progress indicator

#### Detailed Metrics (Parent/Educator View)
1. **Oral Reading Fluency**
   - WCPM graph over time
   - Accuracy percentage
   - Goal progress tracker

2. **Phonological Awareness**
   - Accuracy by skill type
   - Response time trends
   - Mastered vs. practicing skills

3. **Decoding Skills**
   - Real word vs. pseudoword accuracy
   - Letter-sound mastery matrix
   - Error pattern analysis

4. **Comprehension**
   - Passage difficulty level
   - Question accuracy trends
   - Vocabulary growth

5. **Spelling**
   - Pattern mastery
   - Common error tracking
   - Weekly spelling growth

### Progress Reporting
- **Weekly Summary**: Email/PDF report of practice time and progress
- **Monthly Assessment**: Standardized progress check with recommendations
- **Skill Heat Map**: Visual representation of strong/weak areas
- **Comparative Growth**: Track against expected trajectory

## Engagement & Motivation Features

### Gamification Elements
1. **Points System**
   - Earn points for exercises completed
   - Bonus points for accuracy and speed
   - Redeemable for avatar customization

2. **Achievement Badges**
   - "Sound Master" - 100% accuracy on phoneme identification
   - "Speed Reader" - Reach fluency milestone
   - "Persistence Pro" - 30-day practice streak
   - "Word Wizard" - Master 100 sight words

3. **Progress Visualization**
   - Animated level-up sequences
   - Visual progress bars
   - Before/after comparison charts
   - Celebration animations for milestones

4. **Personalization**
   - Choose avatar/theme
   - Select preferred topics for passages
   - Set personal daily goals
   - Customize difficulty preferences

### Adaptive Learning System
- **Smart Difficulty Adjustment**
  - Monitor real-time performance
  - Increase difficulty after consistent success
  - Provide support exercises when struggling
  - Maintain optimal challenge level (not too easy/hard)

- **Spaced Repetition**
  - Review previously learned skills at optimal intervals
  - Ensure long-term retention
  - Automated scheduling of review sessions

- **Error Pattern Recognition**
  - Identify specific areas of difficulty
  - Automatically generate targeted practice
  - Track improvement on specific error types

## Accessibility Features

### Core Accessibility
1. **Text-to-Speech (TTS)**
   - Option to hear all text read aloud
   - Adjustable speed
   - Word highlighting during reading

2. **Visual Customization**
   - Adjustable text size
   - High contrast mode
   - Reduced animations option
   - Clean, uncluttered interface design
   - Sans-serif font (Arial default)

3. **Audio Support**
   - Clear, professional narration
   - Adjustable volume
   - Repeat audio option
   - Headphone support

4. **Flexible Pacing**
   - No time pressure on untimed exercises
   - Pause/resume capability
   - Breaks built into longer sessions

### Multi-Sensory Approach
- Visual: Text, images, animations
- Auditory: Sounds, words, instructions
- Kinesthetic: Typing, clicking, dragging (touch support)

## User Experience Design Principles

### Session Structure
1. **Warm-up** (2-3 minutes)
   - Quick review of mastered skills
   - Build confidence

2. **Core Practice** (15-20 minutes)
   - Mix of new and review exercises
   - Variety to maintain engagement
   - Progressive difficulty

3. **Cool-down** (2-3 minutes)
   - Fun, confidence-building activity
   - Review session achievements
   - Preview next session

### Interface Guidelines
- **Minimal Distractions**: Clean, focused design
- **Clear Instructions**: Simple, concise directions with audio option
- **Immediate Feedback**: Positive reinforcement, constructive correction
- **Error Handling**: Patient, encouraging messaging
- **Navigation**: Intuitive, consistent layout

## Future Expansion Ideas

### Advanced Features
1. **AI-Powered Tutor**
   - Natural language question answering
   - Personalized encouragement
   - Adaptive hint system

2. **Social Features** (Optional)
   - Share achievements with family
   - Practice with peers (non-competitive)
   - Parent/educator messaging

3. **Content Library**
   - Age-appropriate reading materials
   - Interest-based topics
   - Dyslexia-friendly texts

4. **Multi-Device Sync**
   - Practice on computer, tablet, phone
   - Seamless progress synchronization
   - Offline mode capability

5. **Integration with Schools**
   - Import student rosters
   - Align with curriculum standards
   - Teacher dashboards
   - RTI/IEP goal tracking

## Implementation Priorities (MVP)

### Phase 1: Core Foundation
1. User accounts and authentication
2. Basic phonological awareness exercises (Module 1)
3. Simple progress tracking (accuracy, completion)
4. Clean, accessible interface

### Phase 2: Reading Skills
1. Phonics and decoding exercises (Module 2)
2. Word recognition practice (Module 3.1)
3. Enhanced progress dashboard
4. Points and basic gamification

### Phase 3: Fluency & Comprehension
1. Oral reading fluency with audio recording (Module 3.2)
2. WCPM calculation and tracking
3. Reading comprehension exercises (Module 4)
4. Spelling practice (Module 5)

### Phase 4: Engagement & Polish
1. Achievement system
2. Adaptive difficulty algorithm
3. Spaced repetition system
4. Weekly/monthly reporting

### Phase 5: Advanced Features
1. Error pattern analysis
2. Advanced analytics for educators
3. Content library expansion
4. Multi-device support
### Mastery and Advancement
- Define per‑skill mastery criteria (e.g., ≥90% accuracy across two sessions with acceptable response time) before advancing difficulty.
- Use consistent error‑correction routines (model–lead–test; immediate return to the point of error; reattempt then spaced review).
- Gate new code elements until prerequisites are mastered; schedule automated spaced review of previously mastered items.
