---
name: review-content
description: Review topic JSON content for argumentative quality, balance, and intellectual honesty. Use when creating new topic content, adding sections or arguments to existing topics, editing existing content, or when the user asks to review or improve a factsheet's argumentative strength.
argument-hint: "[topicId]"
allowed-tools: Read, Glob, Grep, Bash, WebSearch, Agent, TodoWrite, AskUserQuestion, Edit
---

# Inhaltliche Qualitätsprüfung für `public/data/$ARGUMENTS.json`

Complementary to `verify-sources` (which checks data accuracy). This skill checks whether the **framing, argumentation, and presentation** are intellectually honest and hard to attack.

## When to run

- **Review mode**: On explicit request or after substantial content edits — produces a structured report
- **Author mode**: When creating or extending topic content — apply quality dimensions as guardrails before writing

## Quality Dimensions

Every content block and argument MUST pass these 7 checks:

### 1. Nuance & Teilwahrheiten

Stammtisch-Aussagen are often partially true. Never frame a response as pure debunking when the claim has a legitimate kernel.

- If a claim is partially valid, acknowledge it explicitly before presenting counter-evidence
- Use formulations like "Der Kern stimmt, aber…", "Das war bis X richtig, seitdem…"
- Flag any argument where the `response` treats a complex issue as black/white

### 2. Claim-Source-Fit

The source must actually support the specific claim. Over-reading is the most common error.

- Each `sourceRef` must carry exactly the claim it's attached to — not more
- If a source supports a broader trend but not the specific number, say so
- Remove `sourceRefs` that don't directly support the attached content block

### 3. Annahmen-Transparenz

Cost calculations and projections must be honest about their assumptions.

- All calculations need explicit premises (energy price, usage, region, building type)
- Show sensitivity: what changes under less favorable conditions?
- Use range values (`range_bar`) or caveats in `text` blocks for uncertain projections
- Flag calculations that only show the best-case scenario

### 4. Fakt vs. Bewertung

Strictly separate data from interpretation.

- `fact` and `stat_grid` blocks: only verifiable data, no adjectives or framing
- `text` blocks: may contain interpretation, but must be clearly recognizable as such
- Arguments (`response` field): interpretation is expected but must be grounded in the referenced sections

### 5. Gegenargumente einbeziehen

Legitimate counter-positions strengthen credibility when addressed rather than ignored.

- Each argument should acknowledge the strongest opposing view
- Use patterns like "Kritiker wenden ein, dass… — allerdings zeigen die Daten…"
- If a counter-argument can't be refuted with data, say so honestly
- `relatedSections` should link to sections that provide the evidence

### 6. Sprachliche Präzision

Avoid absolutist language that creates unnecessary attack surface.

- **Never use**: "beweist", "widerlegt endgültig", "die Medien verschweigen", "eindeutig"
- **Prefer**: "deutet darauf hin", "die Daten zeigen", "nach aktueller Studienlage"
- Include necessary conditions (e.g., "bei Nutzung erneuerbarer Energien" for EV CO₂ claims)
- Use full names on first mention, abbreviations only after (e.g., "Statistisches Bundesamt (Destatis)")

### 7. Argument-Claim-Passung

The response must directly address the claim — not a related but different topic.

- Read the `claim` and `response` as a pair: does the response actually answer what was asked?
- Check causal logic: does the evidence support the specific conclusion drawn?
- `relatedSections` must contain sections that actually back the response
- `keywords` must match what someone would say when making this claim

## Review Workflow (Review Mode)

1. **Load** — Read `public/data/$ARGUMENTS.json`, extract all `arguments` and `sections`
2. **Analyze** — For each argument, evaluate against all 7 dimensions. For each section, check dimensions 1–4 and 6.
3. **Classify** — Rate each finding:
   - ✓ **OK**: Passes the check
   - ⚠ **VERBESSERBAR**: Not wrong, but creates attack surface — suggest improvement
   - ✗ **PROBLEM**: Intellectually dishonest or logically flawed — must fix
4. **Report** — Present findings grouped by dimension, with concrete fix suggestions
5. **Apply** — After user confirmation: edit the JSON, then run `npm run lint && npm run build`

## Author Guardrails (Author Mode)

When writing new content, apply before committing to JSON:

### New Argument Checklist

```
- [ ] Response acknowledges kernel of truth in the claim (Dim 1)
- [ ] Every sourceRef directly supports its attached claim (Dim 2)
- [ ] Calculations show assumptions and sensitivity (Dim 3)
- [ ] Facts and interpretation clearly separated (Dim 4)
- [ ] Strongest counter-argument addressed (Dim 5)
- [ ] No absolutist language (Dim 6)
- [ ] Response directly answers the claim (Dim 7)
```

### New Section Checklist

```
- [ ] Data blocks contain only verifiable facts (Dim 4)
- [ ] Sources actually support the specific numbers (Dim 2)
- [ ] Caveats and conditions are stated (Dim 3, 6)
- [ ] No loaded language in captions or labels (Dim 6)
```

## Rules

- **No whitewashing**: Don't remove valid criticism — address it
- **Conservative language**: When uncertain, hedge; never overstate
- **Structural honesty**: The site is advocacy with good sources — don't pretend it's neutral, but ensure it's fair
- **Complement verify-sources**: This skill checks framing; `verify-sources` checks data accuracy. Run both on new content.

## Reference

See `${CLAUDE_SKILL_DIR}/reference.md` for concrete examples of problematic patterns and their fixes, derived from real feedback.
