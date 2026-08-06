import { DIFFICULTY_LABELS, DIFFICULTY_STYLES, type Difficulty } from "~/lib/visa-guides";

const GLYPHS: Record<Difficulty, string> = {
  easy: "●",
  moderate: "◐",
  hard: "▲",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_STYLES[difficulty]}`}
    >
      <span aria-hidden="true">{GLYPHS[difficulty]}</span>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
