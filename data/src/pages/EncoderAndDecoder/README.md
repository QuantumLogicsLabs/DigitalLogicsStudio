# Modular Refactor — Decoder & Encoder Pages

## What Changed

Both original files were single monolithic JSX files (~2500 lines each) with
all data, logic, and UI mixed together.  They have been split into small,
focused modules following the **single-responsibility principle**.

---

## Directory Structure

```
shared/
  theme.js                        ← Design tokens (colors, helpers)
  components/
    Section.jsx                   ← Titled card wrapper used on both pages
    Quiz.jsx                      ← Reusable quiz widget (pass any questions array)
    TipsPanel.jsx                 ← Floating tips pop-up (pass any tips array)
    TruthTable.jsx                ← Truth-table renderer (headers + rows arrays)

decoder/
  decoderData.js                  ← ALL static data: types, tips, quiz questions
  DecoderPage.jsx                 ← Main page — thin orchestrator, no logic
  components/
    TypeSelector.jsx              ← Decoder type picker buttons
    DecoderSimulator.jsx          ← Input toggles, output LEDs, equations
    SevenSeg.jsx                  ← SVG 7-segment display
    BCDDigitPad.jsx               ← Clickable digit pad + BCD demo
    MintermEquationBuilder.jsx    ← Interactive minterm → equation builder
    FunctionGeneratorDemo.jsx     ← Decoder-as-function-generator demo
    CascadingExplainer.jsx        ← 4-to-16 cascading decoder demo

encoder/
  encoderData.js                  ← ALL static data: types, tips, quiz questions
  EncoderPage.jsx                 ← Main page — thin orchestrator, no logic
  components/
    EncoderTypeSelector.jsx       ← Encoder type picker buttons
    EncoderSimulator.jsx          ← Input toggles, output LEDs, equations
    SignalFlowDiagram.jsx         ← Animated signal-flow pipeline
    BinaryIndexExplorer.jsx       ← Binary-index trick interactive table
    PriorityConflictSim.jsx       ← Multi-input priority conflict demo
    ComparisonTable.jsx           ← Basic vs Priority encoder comparison
```

---

## Key Design Decisions

### 1. Data is completely separated from UI
`decoderData.js` and `encoderData.js` hold every piece of static content:
decoder configurations, truth tables, Boolean equations, tips, and quiz
questions.  Adding a new decoder type (e.g. "4to16") requires editing only
the data file — no component changes needed.

### 2. Shared components are truly generic
`Quiz`, `TipsPanel`, `TruthTable`, and `Section` accept their content as
**props**, so the same component runs identically on both pages.

Before (duplicated in both files):
```jsx
// ~150 lines of Quiz code in DecoderPage.jsx
// ~150 lines of Quiz code in EncoderPage.jsx (identical structure!)
```

After:
```jsx
// shared/components/Quiz.jsx — written once
<Quiz questions={DECODER_QUIZ} feedbackText={decoderQuizFeedback} />
<Quiz questions={ENCODER_QUIZ} feedbackText={encoderQuizFeedback} />
```

### 3. Main page files are thin orchestrators
`DecoderPage.jsx` and `EncoderPage.jsx` only:
- Import sub-components
- Own the top-level state (`selectedType`, `inputVals`)
- Arrange sections using `<Section>`

They contain no rendering logic themselves.

### 4. Design tokens in one place
`shared/theme.js` exports `COLORS`, font constants, and reusable style
helpers (`bitIndicatorStyle`, `cardStyle`).  Changing the brand color
means editing one file, not hunting through 5000 lines.

---

## How to Add a New Decoder Type

1. Open `decoder/decoderData.js`
2. Add a new key to `DECODER_TYPES` following the existing pattern
3. Provide: `label`, `codeInputs`, `outputs`, `decode()`, `booleanEqs`, `truthHeaders`, `truthRows`, `minterms`
4. Done — `TypeSelector` and `DecoderSimulator` automatically pick it up

## How to Add a New Quiz Question

1. Open `decoder/decoderData.js` (or `encoder/encoderData.js`)
2. Push a new object onto `DECODER_QUIZ` (or `ENCODER_QUIZ`):
   ```js
   { q: "...", opts: ["A","B","C","D"], ans: 2, exp: "...", hint: "..." }
   ```
3. Done — `Quiz` renders all questions dynamically
