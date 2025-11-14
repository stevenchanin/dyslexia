# Dyslexia Reading Software - Feature Design

## Software Vision

A comprehensive, computer-based reading intervention program that provides engaging, evidence-based exercises to help individuals with dyslexia develop reading skills while tracking measurable progress.

## Kindergarten & Grade 1 Experience Guidelines

Because early readers rely more on visuals than text, every surface of the app should follow these rules:
- **Audio-first instructions**: tap-to-play voice guidance on every screen, paired with short looping animations that model the action instead of paragraphs of text.
- **Iconic navigation**: bottom nav uses recognizable symbols (home, play, stars, backpack) plus color-coded backgrounds so non-readers can self-orient.
- **Large, touch-friendly targets**: minimum 56px tap zones, generous spacing, and drag handles sized for small thumbs.
- **Character-led motivation**: a friendly guide character introduces exercises, celebrates success, and keeps language consistent for kids and caregivers.
- **Minimal on-screen text**: when words must appear, use single words or short phrases with pictograms; detailed copy lives behind a parent lock.
- **Multisensory cues**: pair sound, vibration (if available), particle effects, and stickers so correct answers feel tangible; errors trigger gentle animations rather than red text.

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
- Audio plays a word while a short animation mouths the target phoneme
- Student taps from three illustrated icons (e.g., cat’s mouth, train, sun) instead of text labels
- Levels: beginning sound → ending sound → middle sound
- Visual feedback with celebratory confetti; wrong answers rewind animation and highlight the correct mouth shape
- Tracks accuracy and response time

**Exercise: "How Many Sounds?"**
- Present word (audio + floating letter tiles)
- Student drags colored counters into a ten-frame to count phonemes
- Progressive difficulty (cat=3 → script=6)
- Immediate feedback with sound breakdown

#### 1.2 Sound Manipulation
**Exercise: "Sound Swapper"**
- Show/say word (e.g., "cat") with magnet-letter tiles
- Prompt delivered via character voice: "Let’s swap the first sound!"
- Student drags replacement tile; no keyboard entry required
- Visual representation of sound positions pulses to show where to drop
- Gamified with sparkle trail for quick swaps

**Exercise: "Sound Builder"**
- Present individual sounds: /k/ /æ/ /t/
- Student flicks each sound coin into a blending track that animates the word coming together
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
- Flash letter or grapheme on a card while a guide character traces it
- Student says sound (voice recording) or taps from illustrated options if mic permissions are off
- Include digraphs (ch, sh, th) and vowel teams
- Spaced repetition algorithm for retention

**Exercise: "Sound Sort"**
- Drag letters/graphemes into color-coded “sound baskets” that play auditory feedback when opened
- Visual and auditory reinforcement
- Track mastery of each letter-sound pair

#### 2.2 Word Decoding Practice
- Present word with sound-by-sound highlight while a bouncing ball tracks each phoneme
- Student practices decoding by sliding a finger across the letters (touch tracing) to reinforce left-to-right tracking
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
- High-frequency word practice with illustrated context (e.g., picture of “dog” next to the word)
- Adaptive presentation based on response time
- Words mastered move to review pool
- Track total sight word vocabulary

**Exercise: "Sentence Speed"**
- Read sentences with high-frequency words
- Time tracking for fluency
- Comprehension check questions
- Progress from simple to complex sentences

#### 3.2 Oral Reading Fluency
- Present age-appropriate passages with large text, chunked lines, and optional word-level highlighting
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
- Answer who, what, when, where questions using illustrated answer choices (characters, objects, locations)
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
- Hear word, then tap-and-drag letter tiles into a word board (keyboard optional but not required)
- Sound-by-sound hints available via audio + color glow
- Tracks common error patterns
- Adaptive practice on trouble areas

**Exercise: "Word Pattern Practice"**
- Focus on common patterns (CVC, CVCe, CVCC)
- Sorting and categorization
- Build pattern recognition
- Progressive complexity

## Progress Tracking & Measurement

### Dashboard Features

#### Student Dashboard (Kid Mode)
- **Today’s Adventure**: Single large “Play” button showing the next exercise with iconography
- **Sticker Trail**: Visual progress path where each activity places a sticker instead of reading charts
- **Buddy Boosts**: Character pops up with simple phrases (“Great job!”) plus animated reactions
- **Streak Garden**: Water a plant for every practice day; plant growth replaces numeric streak counters
- **Level Meter**: Thermometer-style gauge fills with color rather than numbers

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
