# 01 - Learning Taxonomy

## Two-Layer Roadmap System

### Layer 1: World Map (Simple Overview)
- 7 skill categories x 6 CEFR levels = 42 category-level combinations
- Displayed as **category cards** (not hex tiles)
- Each card shows: category name, current CEFR level badge, progress bar, verified/self-reported counts

### Layer 2: Skill Map (Deep Detail)
- Accessed by tapping a Layer 1 category card
- Displayed as an **organic hex tile tree** expanding in 6 directions
- Each hex = one specific sub-skill node
- Connected by lines showing prerequisite relationships

---

## 7 Skill Categories

| # | Category      | Type      | Icon | Description                        |
|---|---------------|-----------|------|------------------------------------|
| 1 | Vocabulary    | Basic     | book | Words, collocations, idioms        |
| 2 | Grammar       | Basic     | cog  | Sentence structure, tenses, clauses|
| 3 | Pronunciation | Basic     | mic  | Sounds, stress, intonation         |
| 4 | Reading       | Practical | book-open | Comprehension, analysis       |
| 5 | Writing       | Practical | pen  | Composition, structure, style      |
| 6 | Listening     | Practical | headphones | Comprehension, inference    |
| 7 | Speaking      | Practical | message-circle | Fluency, conversation    |

**Basic** categories are foundational building blocks.
**Practical** categories apply those foundations to real-world skills.

---

## CEFR Levels

```
A1 (Beginner) → A2 (Elementary) → B1 (Intermediate) → B2 (Upper-Intermediate) → C1 (Advanced) → C2 (Mastery)
```

Each sub-skill node is assigned exactly one CEFR level.
One node = one CEFR level (no nodes spanning multiple levels).

---

## Layer 2: Sub-skill Taxonomy

### Grammar (14 nodes)

| ID                          | Sub-skill                   | CEFR | Prerequisites                         |
|-----------------------------|-----------------------------|------|---------------------------------------|
| grammar-basic-sentence      | Basic Sentence Structure    | A1   | (none - root node)                    |
| grammar-nouns-pronouns      | Nouns & Pronouns            | A1   | (none - root node)                    |
| grammar-present-simple      | Present Simple & Continuous | A1   | grammar-basic-sentence                |
| grammar-past-simple         | Past Simple                 | A2   | grammar-present-simple                |
| grammar-articles            | Articles & Determiners      | A2   | grammar-nouns-pronouns                |
| grammar-modal-verbs         | Modal Verbs (basic)         | A2   | grammar-present-simple                |
| grammar-future-forms        | Future Forms                | B1   | grammar-past-simple                   |
| grammar-conditionals        | Conditionals                | B1   | grammar-future-forms, grammar-modal-verbs |
| grammar-passive-voice       | Passive Voice               | B1   | grammar-past-simple                   |
| grammar-relative-clauses    | Relative Clauses            | B2   | grammar-conditionals                  |
| grammar-reported-speech     | Reported Speech             | B2   | grammar-past-simple, grammar-passive-voice |
| grammar-inversion           | Inversion                   | C1   | grammar-relative-clauses              |
| grammar-cleft-sentences     | Cleft Sentences             | C1   | grammar-relative-clauses              |
| grammar-advanced-clauses    | Advanced Clause Structure   | C2   | grammar-inversion, grammar-cleft-sentences |

### Vocabulary (11 nodes)

| ID                          | Sub-skill                  | CEFR | Prerequisites                            |
|-----------------------------|----------------------------|------|------------------------------------------|
| vocab-core-500              | Core 500 Words             | A1   | (none - root node)                       |
| vocab-word-classes          | Word Classes               | A1   | (none - root node)                       |
| vocab-core-1000             | Core 1000 Words            | A2   | vocab-core-500                           |
| vocab-collocations-basic    | Collocations (basic)       | A2   | vocab-core-500, vocab-word-classes       |
| vocab-core-2000             | Core 2000 Words            | B1   | vocab-core-1000                          |
| vocab-phrasal-verbs         | Phrasal Verbs              | B1   | vocab-collocations-basic                 |
| vocab-academic-word-list    | Academic Word List         | B2   | vocab-core-2000                          |
| vocab-collocations-advanced | Collocations (advanced)    | B2   | vocab-phrasal-verbs                      |
| vocab-idioms                | Idioms                     | C1   | vocab-collocations-advanced              |
| vocab-register              | Register (Formal/Informal) | C1   | vocab-academic-word-list                 |
| vocab-near-native           | Near-native Lexical Range  | C2   | vocab-idioms, vocab-register             |

### Pronunciation (10 nodes)

| ID                          | Sub-skill                    | CEFR | Prerequisites                              |
|-----------------------------|------------------------------|------|--------------------------------------------|
| pron-phonemes               | Individual Sounds (Phonemes) | A1   | (none - root node)                         |
| pron-word-stress            | Word Stress                  | A1   | (none - root node)                         |
| pron-sentence-stress        | Sentence Stress              | A2   | pron-word-stress                           |
| pron-basic-intonation       | Basic Intonation             | A2   | pron-phonemes                              |
| pron-connected-speech       | Connected Speech             | B1   | pron-sentence-stress, pron-basic-intonation|
| pron-weak-forms             | Weak Forms                   | B1   | pron-sentence-stress                       |
| pron-accent-awareness       | Accent Awareness             | B2   | pron-connected-speech                      |
| pron-rhythm-chunking        | Rhythm & Chunking            | B2   | pron-connected-speech, pron-weak-forms     |
| pron-advanced-intonation    | Advanced Intonation          | C1   | pron-accent-awareness, pron-rhythm-chunking|
| pron-style-register         | Style & Register in Speech   | C2   | pron-advanced-intonation                   |

### Reading (9 nodes)

| ID                          | Sub-skill                   | CEFR | Prerequisites                              |
|-----------------------------|-----------------------------|------|--------------------------------------------|
| reading-simple-texts        | Simple Texts (signs, menus) | A1   | (none - root node)                         |
| reading-short-paragraphs    | Short Paragraphs            | A2   | reading-simple-texts                       |
| reading-main-idea           | Main Idea Comprehension     | B1   | reading-short-paragraphs                   |
| reading-skim-scan           | Skimming & Scanning         | B1   | reading-short-paragraphs                   |
| reading-inference           | Inference                   | B2   | reading-main-idea                          |
| reading-vocab-context       | Vocabulary in Context       | B2   | reading-main-idea, reading-skim-scan       |
| reading-text-structure      | Text Structure Awareness    | C1   | reading-inference, reading-vocab-context   |
| reading-critical            | Critical Reading            | C1   | reading-inference                          |
| reading-academic            | Academic Texts              | C2   | reading-text-structure, reading-critical   |

### Writing (9 nodes)

| ID                          | Sub-skill                 | CEFR | Prerequisites                              |
|-----------------------------|---------------------------|------|--------------------------------------------|
| writing-sentence            | Sentence Construction     | A1   | (none - root node)                         |
| writing-simple-messages     | Simple Messages & Forms   | A2   | writing-sentence                           |
| writing-paragraph           | Paragraph Structure       | B1   | writing-simple-messages                    |
| writing-cohesion            | Cohesion & Coherence      | B1   | writing-paragraph                          |
| writing-essay               | Essay Structure           | B2   | writing-cohesion                           |
| writing-formal              | Formal Writing            | B2   | writing-cohesion                           |
| writing-academic            | Academic Writing          | C1   | writing-essay, writing-formal              |
| writing-argumentation       | Argumentation             | C1   | writing-essay                              |
| writing-style-rhetoric      | Advanced Style & Rhetoric | C2   | writing-academic, writing-argumentation    |

### Listening (9 nodes)

| ID                          | Sub-skill                    | CEFR | Prerequisites                              |
|-----------------------------|------------------------------|------|--------------------------------------------|
| listening-gist              | Gist Listening (slow, clear) | A1   | (none - root node)                         |
| listening-key-info          | Key Information Extraction   | A2   | listening-gist                             |
| listening-detail            | Detail Listening             | B1   | listening-key-info                         |
| listening-inference-tone    | Inference from Tone          | B1   | listening-key-info                         |
| listening-accents           | Accents & Varieties          | B2   | listening-detail                           |
| listening-fast-speech       | Fast Speech Comprehension    | B2   | listening-detail, listening-inference-tone |
| listening-lecture           | Lecture Comprehension        | C1   | listening-accents, listening-fast-speech   |
| listening-nuance            | Conversational Nuance        | C1   | listening-fast-speech                      |
| listening-native-speed      | Native-speed Comprehension   | C2   | listening-lecture, listening-nuance        |

### Speaking (9 nodes)

| ID                          | Sub-skill                 | CEFR | Prerequisites                              |
|-----------------------------|---------------------------|------|--------------------------------------------|
| speaking-basic-conversation | Basic Conversation        | A1   | (none - root node)                         |
| speaking-familiar-topics    | Familiar Topic Discussion | A2   | speaking-basic-conversation                |
| speaking-discourse-markers  | Discourse Markers         | B1   | speaking-familiar-topics                   |
| speaking-pron-fluency       | Pronunciation Fluency     | B1   | speaking-familiar-topics                   |
| speaking-opinion            | Expressing Opinion        | B2   | speaking-discourse-markers                 |
| speaking-debate             | Debate & Argument         | B2   | speaking-discourse-markers, speaking-pron-fluency |
| speaking-presentation       | Presentation Skills       | C1   | speaking-opinion, speaking-debate          |
| speaking-spontaneous        | Spontaneous Speech        | C1   | speaking-debate                            |
| speaking-native-fluency     | Native-like Fluency       | C2   | speaking-presentation, speaking-spontaneous|

---

## Node Statistics Summary

| Category      | A1 | A2 | B1 | B2 | C1 | C2 | Total |
|---------------|----|----|----|----|----|----|-------|
| Grammar       | 3  | 3  | 3  | 2  | 2  | 1  | 14    |
| Vocabulary    | 2  | 2  | 2  | 2  | 2  | 1  | 11    |
| Pronunciation | 2  | 2  | 2  | 2  | 1  | 1  | 10    |
| Reading       | 1  | 1  | 2  | 2  | 2  | 1  | 9     |
| Writing       | 1  | 1  | 2  | 2  | 2  | 1  | 9     |
| Listening     | 1  | 1  | 2  | 2  | 2  | 1  | 9     |
| Speaking      | 1  | 1  | 2  | 2  | 2  | 1  | 9     |
| **Total**     | **11** | **11** | **15** | **14** | **13** | **7** | **71** |
