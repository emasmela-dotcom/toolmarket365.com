import type { LifeField, LifeToolMeta } from "./types"

const f = (
  id: string,
  category: string,
  title: string,
  description: string,
  fields: LifeField[]
): LifeToolMeta => ({ id, category, title, description, fields })

export const LIFE_TOOLS: LifeToolMeta[] = [
  f("bill-split-calculator", "Personal Finance", "Bill split calculator", "Split a total with optional tip across people.", [
    { key: "total", label: "Bill total ($)", type: "number" },
    { key: "people", label: "People splitting", type: "number" },
    { key: "tipPct", label: "Tip % (optional)", type: "number", optional: true },
  ]),
  f("debt-payoff-planner", "Personal Finance", "Debt payoff planner", "Estimate payoff timeline from balance, APR, and monthly payment.", [
    { key: "balance", label: "Balance ($)", type: "number" },
    { key: "apr", label: "APR %", type: "number" },
    { key: "payment", label: "Monthly payment ($)", type: "number" },
  ]),
  f("savings-goal-tracker", "Personal Finance", "Savings goal tracker", "Months to goal from target, monthly save, starting balance.", [
    { key: "target", label: "Goal amount ($)", type: "number" },
    { key: "saved", label: "Already saved ($)", type: "number" },
    { key: "monthly", label: "Save per month ($)", type: "number" },
  ]),
  f("net-worth-calculator", "Personal Finance", "Net worth calculator", "Assets minus liabilities snapshot.", [
    { key: "assets", label: "Total assets ($)", type: "number" },
    { key: "liabilities", label: "Total liabilities ($)", type: "number" },
  ]),
  f("budget-planner-502020", "Personal Finance", "Budget planner (50/30/20)", "After-tax income split into needs, wants, savings.", [
    { key: "income", label: "Monthly after-tax income ($)", type: "number" },
  ]),
  f("loan-comparison-tool", "Personal Finance", "Loan comparison tool", "Compare two loans by principal, APR, term months.", [
    { key: "p1", label: "Loan A principal ($)", type: "number" },
    { key: "apr1", label: "Loan A APR %", type: "number" },
    { key: "m1", label: "Loan A term (months)", type: "number" },
    { key: "p2", label: "Loan B principal ($)", type: "number" },
    { key: "apr2", label: "Loan B APR %", type: "number" },
    { key: "m2", label: "Loan B term (months)", type: "number" },
  ]),
  f("tip-calculator", "Personal Finance", "Tip calculator", "Tip and total from subtotal and percent.", [
    { key: "subtotal", label: "Subtotal ($)", type: "number" },
    { key: "tipPct", label: "Tip %", type: "number" },
    { key: "split", label: "Split among people", type: "number", optional: true },
  ]),
  f("currency-converter", "Personal Finance", "Currency converter", "Multiply by your own exchange rate (no live FX).", [
    { key: "amount", label: "Amount", type: "number" },
    { key: "rate", label: "Your rate (multiply by this)", type: "number" },
    { key: "from", label: "From currency code", type: "text", placeholder: "USD" },
    { key: "to", label: "To currency code", type: "text", placeholder: "EUR" },
  ]),
  f("cover-letter-generator", "Writing & Communication", "Cover letter generator", "Fill blanks for a short cover letter draft.", [
    { key: "role", label: "Role you want", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "skill", label: "Top skill or win", type: "textarea" },
    { key: "tone", label: "Tone (professional, warm, direct)", type: "text", optional: true },
  ]),
  f("resume-bullet-writer", "Writing & Communication", "Resume bullet point writer", "Turn a rough win into an impact bullet.", [
    { key: "action", label: "What you did", type: "text" },
    { key: "metric", label: "Metric or result", type: "text" },
    { key: "context", label: "Context (team, product)", type: "text", optional: true },
  ]),
  f("apology-letter-writer", "Writing & Communication", "Apology letter writer", "Short apology scaffold you can edit.", [
    { key: "recipient", label: "To whom", type: "text" },
    { key: "wrong", label: "What went wrong (brief)", type: "textarea" },
    { key: "fix", label: "How you will fix it", type: "textarea" },
  ]),
  f("thank-you-note-generator", "Writing & Communication", "Thank you note generator", "Gratitude note after a gift, interview, or favor.", [
    { key: "recipient", label: "Recipient name", type: "text" },
    { key: "reason", label: "What you are thanking them for", type: "textarea" },
  ]),
  f("text-tone-rewriter", "Writing & Communication", "Text tone rewriter", "Rewrite pasted text toward formal or casual.", [
    { key: "text", label: "Paste text", type: "textarea" },
    { key: "direction", label: "Direction (formal or casual)", type: "text" },
  ]),
  f("profile-bio-generator", "Writing & Communication", "Bio generator (profiles)", "Short bios for Twitter, LinkedIn, or dating apps.", [
    { key: "platform", label: "Platform (Twitter / LinkedIn / dating)", type: "text" },
    { key: "facts", label: "3 facts about you", type: "textarea" },
    { key: "goal", label: "Goal of the bio", type: "text", optional: true },
  ]),
  f("email-subject-line-tester", "Writing & Communication", "Email subject line tester", "Score length + checklist for subject lines.", [
    { key: "subject", label: "Subject line", type: "text" },
  ]),
  f("complaint-letter-writer", "Writing & Communication", "Complaint letter writer", "Firm but calm complaint outline.", [
    { key: "company", label: "Company / service", type: "text" },
    { key: "issue", label: "Issue summary", type: "textarea" },
    { key: "ask", label: "What you want them to do", type: "textarea" },
  ]),
  f("bmi-calculator", "Health & Wellness", "BMI calculator", "BMI from height (feet + inches) and weight (pounds).", [
    { key: "feet", label: "Height (feet)", type: "number" },
    { key: "inches", label: "Height (inches)", type: "number", optional: true },
    { key: "lbs", label: "Weight (lbs)", type: "number" },
  ]),
  f("water-intake-calculator", "Health & Wellness", "Water intake calculator", "Rough daily liters from body weight kg.", [
    { key: "kg", label: "Body weight (kg)", type: "number" },
    { key: "activity", label: "Activity (low / medium / high)", type: "text", optional: true },
  ]),
  f("calorie-deficit-calculator", "Health & Wellness", "Calorie deficit calculator", "TDEE rough estimate and deficit calories.", [
    { key: "kg", label: "Weight (kg)", type: "number" },
    { key: "cm", label: "Height (cm)", type: "number" },
    { key: "age", label: "Age", type: "number" },
    { key: "sex", label: "Sex (m/f) for Mifflin estimate", type: "text" },
    { key: "deficit", label: "Desired daily deficit (kcal)", type: "number" },
  ]),
  f("sleep-cycle-calculator", "Health & Wellness", "Sleep cycle calculator", "Wake time from bedtime + 90m cycles.", [
    { key: "bedHour", label: "Bedtime hour (0-23)", type: "number" },
    { key: "bedMin", label: "Bedtime minute (0-59)", type: "number" },
    { key: "cycles", label: "Cycles to sleep (e.g. 5)", type: "number", optional: true },
  ]),
  f("workout-plan-generator", "Health & Wellness", "Workout plan generator", "Simple weekly split from days available.", [
    { key: "days", label: "Days per week you can train", type: "number" },
    { key: "focus", label: "Focus (full body / upper-lower / push-pull)", type: "text", optional: true },
  ]),
  f("meal-prep-planner", "Health & Wellness", "Meal prep planner", "Outline meals for the week from constraints.", [
    { key: "meals", label: "Meals per day", type: "number" },
    { key: "days", label: "Days to plan", type: "number" },
    { key: "prefs", label: "Diet prefs / allergies", type: "textarea", optional: true },
  ]),
  f("habit-streak-tracker", "Health & Wellness", "Habit streak tracker", "Track streak from start date and completions.", [
    { key: "start", label: "Start date (YYYY-MM-DD)", type: "text" },
    { key: "done", label: "Days completed (count)", type: "number" },
  ]),
  f("symptom-journal-helper", "Health & Wellness", "Symptom journal", "Structured log lines to paste in your journal (not medical advice).", [
    { key: "symptoms", label: "Symptoms today", type: "textarea" },
    { key: "duration", label: "Duration / severity", type: "text" },
  ]),
  f("flashcard-generator", "Learning & Productivity", "Flashcard generator", "Turn notes into Q/A flashcard lines.", [
    { key: "notes", label: "Paste notes", type: "textarea" },
  ]),
  f("study-schedule-builder", "Learning & Productivity", "Study schedule builder", "Block plan from hours per day and topics.", [
    { key: "hours", label: "Hours per day", type: "number" },
    { key: "topics", label: "Topics (comma separated)", type: "textarea" },
    { key: "weeks", label: "Weeks until exam", type: "number", optional: true },
  ]),
  f("pomodoro-timer-planner", "Learning & Productivity", "Pomodoro timer planner", "Plan work blocks and breaks for a session.", [
    { key: "work", label: "Work minutes", type: "number" },
    { key: "break", label: "Break minutes", type: "number" },
    { key: "rounds", label: "Rounds", type: "number" },
  ]),
  f("reading-time-estimator", "Learning & Productivity", "Reading time estimator", "Minutes from word count at your WPM.", [
    { key: "words", label: "Word count", type: "number" },
    { key: "wpm", label: "Your WPM", type: "number", optional: true },
  ]),
  f("speed-reading-trainer", "Learning & Productivity", "Speed reading trainer", "Chunking drill outline for a passage.", [
    { key: "words", label: "Words per line (avg)", type: "number" },
    { key: "lines", label: "Lines to practice", type: "number" },
  ]),
  f("note-summarizer-helper", "Learning & Productivity", "Note summarizer", "Bullet summary scaffold from pasted notes.", [
    { key: "notes", label: "Paste notes", type: "textarea" },
  ]),
  f("quiz-from-text-generator", "Learning & Productivity", "Quiz generator", "Draft quiz questions from any text (manual review).", [
    { key: "text", label: "Paste source text", type: "textarea" },
    { key: "count", label: "Number of questions", type: "number", optional: true },
  ]),
  f("language-phrase-cheatsheet", "Learning & Productivity", "Language phrase cheat sheet", "Table of phrases you list with translations.", [
    { key: "phrases", label: "Phrases (one per line)", type: "textarea" },
    { key: "lang", label: "Target language", type: "text" },
  ]),
  f("moving-checklist-generator", "Home & Life", "Moving checklist generator", "Timeline checklist from move date.", [
    { key: "moveDate", label: "Move date (YYYY-MM-DD)", type: "text" },
  ]),
  f("rent-vs-buy-calculator", "Home & Life", "Rent vs. buy calculator", "Very rough comparison (not financial advice).", [
    { key: "rent", label: "Monthly rent ($)", type: "number" },
    { key: "price", label: "Home price ($)", type: "number" },
    { key: "down", label: "Down payment ($)", type: "number" },
    { key: "rate", label: "Mortgage APR %", type: "number" },
    { key: "years", label: "Loan years", type: "number" },
  ]),
  f("home-cleaning-schedule", "Home & Life", "Home cleaning schedule maker", "Weekly room rotation from rooms list.", [
    { key: "rooms", label: "Rooms (comma separated)", type: "textarea" },
  ]),
  f("grocery-list-organizer", "Home & Life", "Grocery list organizer", "Group pasted lines by category buckets.", [
    { key: "items", label: "Items (one per line)", type: "textarea" },
  ]),
  f("recipe-scaler", "Home & Life", "Recipe scaler", "Scale ingredient amounts by serving ratio.", [
    { key: "fromServ", label: "Original servings", type: "number" },
    { key: "toServ", label: "Desired servings", type: "number" },
    { key: "ingredients", label: "Ingredients with amounts (one per line)", type: "textarea" },
  ]),
  f("party-planner-checklist", "Home & Life", "Party / event planner checklist", "Checklist from guest count and vibe.", [
    { key: "guests", label: "Guest count", type: "number" },
    { key: "type", label: "Event type", type: "text" },
  ]),
  f("gift-idea-generator", "Home & Life", "Gift idea generator", "Ideas from recipient + budget + occasion.", [
    { key: "who", label: "Recipient", type: "text" },
    { key: "budget", label: "Budget ($)", type: "number" },
    { key: "occasion", label: "Occasion", type: "text" },
  ]),
  f("lease-explainer-plain-english", "Home & Life", "Lease agreement explainer", "Plain-language questions to ask about pasted clauses (not legal advice).", [
    { key: "clauses", label: "Paste confusing clauses", type: "textarea" },
  ]),
  f("baby-name-generator", "Family & Parenting", "Baby name generator", "Shortlist from style + letters.", [
    { key: "style", label: "Style (classic, modern, nature)", type: "text" },
    { key: "letters", label: "Starts with (optional)", type: "text", optional: true },
  ]),
  f("chore-chart-kids", "Family & Parenting", "Chore chart maker for kids", "Weekly grid from kid names and chores.", [
    { key: "kids", label: "Kid names (comma)", type: "text" },
    { key: "chores", label: "Chores (comma)", type: "text" },
  ]),
  f("allowance-calculator", "Family & Parenting", "Allowance calculator", "Weekly allowance from chores and rates.", [
    { key: "chores", label: "Chores done per week", type: "number" },
    { key: "rate", label: "$ per chore", type: "number" },
  ]),
  f("school-supply-checklist", "Family & Parenting", "School supply checklist", "Grade-based starter list you can edit.", [
    { key: "grade", label: "Grade level", type: "text" },
  ]),
  f("homework-helper-prompt-builder", "Family & Parenting", "Homework helper prompt builder", "Safe tutoring prompt for an LLM (you paste elsewhere).", [
    { key: "subject", label: "Subject", type: "text" },
    { key: "topic", label: "Topic", type: "textarea" },
  ]),
  f("family-meeting-agenda", "Family & Parenting", "Family meeting agenda", "Agenda blocks for a household meeting.", [
    { key: "topics", label: "Topics (comma)", type: "text" },
    { key: "minutes", label: "Meeting length (minutes)", type: "number", optional: true },
  ]),
  f("packing-list-generator", "Travel", "Packing list generator", "List from trip length, climate, and carry-on only?", [
    { key: "days", label: "Trip days", type: "number" },
    { key: "climate", label: "Climate (hot / cold / mixed)", type: "text" },
    { key: "carryon", label: "Carry-on only? (yes/no)", type: "text", optional: true },
  ]),
  f("trip-budget-estimator", "Travel", "Trip budget estimator", "Daily budget × days + flights buffer.", [
    { key: "days", label: "Days", type: "number" },
    { key: "daily", label: "Planned spend per day", type: "number" },
    { key: "flights", label: "Flights/lodging fixed cost", type: "number", optional: true },
  ]),
  f("timezone-converter-helper", "Travel", "Time zone converter", "Offset math between two offsets (hours from UTC).", [
    { key: "from", label: "From offset (hours from UTC)", type: "number" },
    { key: "to", label: "To offset (hours from UTC)", type: "number" },
    { key: "hour", label: "Local hour in FROM zone (0-23)", type: "number" },
  ]),
  f("flight-layover-calculator", "Travel", "Flight layover calculator", "Layover duration from arrival and departure times (same day).", [
    { key: "arrH", label: "Arrival hour", type: "number" },
    { key: "arrM", label: "Arrival minute", type: "number" },
    { key: "depH", label: "Next leg departure hour", type: "number" },
    { key: "depM", label: "Next leg departure minute", type: "number" },
  ]),
  f("travel-itinerary-builder", "Travel", "Travel itinerary builder", "Day-by-day skeleton from cities and dates.", [
    { key: "cities", label: "Cities in order (comma)", type: "text" },
    { key: "start", label: "Start date YYYY-MM-DD", type: "text" },
    { key: "end", label: "End date YYYY-MM-DD", type: "text" },
  ]),
  f("visa-requirement-checklist", "Travel", "Visa requirement checklist", "Research checklist for destination + nationality (not official advice).", [
    { key: "dest", label: "Destination country", type: "text" },
    { key: "passport", label: "Your passport country", type: "text" },
  ]),
  f("random-decision-maker", "Fun & Lifestyle", "Random decision maker", "Pick among comma-separated options.", [
    { key: "options", label: "Options (comma separated)", type: "textarea" },
  ]),
  f("would-you-rather-generator", "Fun & Lifestyle", "Would you rather generator", "Pairs from a theme you give.", [
    { key: "theme", label: "Theme", type: "text" },
  ]),
  f("personality-quiz-builder", "Fun & Lifestyle", "Personality quiz builder", "Outline for a 4-question style quiz.", [
    { key: "topic", label: "Quiz topic", type: "text" },
  ]),
  f("icebreaker-question-generator", "Fun & Lifestyle", "Icebreaker question generator", "Questions for a group size and context.", [
    { key: "size", label: "Group size", type: "number" },
    { key: "context", label: "Context (work, party, class)", type: "text" },
  ]),
  f("trivia-generator-by-topic", "Fun & Lifestyle", "Trivia generator by topic", "Stub questions you can verify and replace.", [
    { key: "topic", label: "Topic", type: "text" },
    { key: "count", label: "How many questions", type: "number", optional: true },
  ]),
  f("random-challenge-generator", "Fun & Lifestyle", "Random challenge generator", "Challenges from difficulty and duration.", [
    { key: "difficulty", label: "Difficulty (easy/med/hard)", type: "text" },
    { key: "minutes", label: "Time available (minutes)", type: "number" },
  ]),
  f("movie-book-recommendation-quiz", "Fun & Lifestyle", "Movie / book recommendation quiz", "Mood-based picks you fill in.", [
    { key: "mood", label: "Mood", type: "text" },
    { key: "genre", label: "Favorite genres", type: "text" },
  ]),
  f("password-strength-checker", "Privacy & Safety", "Password strength checker", "Length, variety, and pattern hints (offline heuristic).", [
    { key: "pw", label: "Password to check (not stored)", type: "text" },
  ]),
  f("phishing-email-analyzer", "Privacy & Safety", "Phishing email detector", "Red-flag checklist for pasted email headers/body.", [
    { key: "email", label: "Paste suspicious email text", type: "textarea" },
  ]),
  f("digital-footprint-checklist", "Privacy & Safety", "Digital footprint checker", "Checklist of accounts to review.", [
    { key: "handles", label: "Usernames / emails to search (comma)", type: "text", optional: true },
  ]),
  f("privacy-policy-plain-explainer", "Privacy & Safety", "Privacy policy plain-language explainer", "Questions to ask about pasted policy text (not legal advice).", [
    { key: "policy", label: "Paste policy excerpt", type: "textarea" },
  ]),
  f("two-factor-auth-setup-guide", "Privacy & Safety", "Two-factor auth setup guide", "Checklist for enabling 2FA on key accounts.", [
    { key: "accounts", label: "Accounts (comma): google, apple, bank…", type: "textarea", optional: true },
  ]),
  f("age-calculator", "Everyday Calculators", "Age calculator", "Age from birth date to today (server date in UTC).", [
    { key: "birth", label: "Birth date YYYY-MM-DD", type: "text" },
  ]),
  f("days-between-dates", "Everyday Calculators", "Days between dates", "Inclusive day count between two dates.", [
    { key: "a", label: "Start YYYY-MM-DD", type: "text" },
    { key: "b", label: "End YYYY-MM-DD", type: "text" },
  ]),
  f("countdown-planner", "Everyday Calculators", "Countdown planner", "Days until target date from today.", [
    { key: "target", label: "Target YYYY-MM-DD", type: "text" },
  ]),
  f("unit-converter", "Everyday Calculators", "Unit converter", "Convert within weight (kg↔lb), temp (C↔F), length (m↔ft).", [
    { key: "kind", label: "Kind (weight / temp / length)", type: "text" },
    { key: "value", label: "Value", type: "number" },
    { key: "from", label: "From unit (kg, lb, C, F, m, ft)", type: "text" },
  ]),
  f("percentage-calculator", "Everyday Calculators", "Percentage calculator", "What is X% of Y, and X as % of Y.", [
    { key: "x", label: "X", type: "number" },
    { key: "y", label: "Y", type: "number" },
  ]),
  f("gpa-calculator", "Everyday Calculators", "GPA calculator", "Simple GPA from grades you enter as lines like A,4 or B,3.", [
    { key: "lines", label: "Lines: grade,weight per line", type: "textarea" },
  ]),
  f("grade-needed-calculator", "Everyday Calculators", "Grade needed to pass", "Required final exam score from weights.", [
    { key: "current", label: "Current % in class", type: "number" },
    { key: "want", label: "Desired final %", type: "number" },
    { key: "finalW", label: "Final exam weight (0-1)", type: "number" },
  ]),
]

const byId = new Map(LIFE_TOOLS.map((t) => [t.id, t]))

export function getLifeTool(id: string): LifeToolMeta | undefined {
  return byId.get(id)
}

export function allLifeToolIds(): string[] {
  return LIFE_TOOLS.map((t) => t.id)
}

export function lifeToolHomeDescriptions(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const t of LIFE_TOOLS) {
    out[`/tools/life/${t.id}`] = t.description
  }
  return out
}
