import { ImagePlus } from 'lucide-react';

/**
 * Conversion-asset placeholder.
 * Renders a clean, clearly-labeled slot telling the creative team exactly
 * which high-converting visual belongs here (e.g. UGC social proof,
 * before/after, trust badges, COD delivery assurance).
 * Replace the whole block with a real asset when it's ready — the `note`
 * text is intentionally visible so it can't ship unnoticed.
 */
export default function AssetPlaceholder({
  label,
  note,
  ratio = 'aspect-[4/3]',
}: {
  /** Short slot name, e.g. 'Social Proof' */
  label: string;
  /** What asset to produce for this slot */
  note: string;
  ratio?: string;
}) {
  return (
    <div
      className={`${ratio} w-full rounded-3xl flex flex-col items-center justify-center gap-3 text-center p-6 select-none`}
      style={{
        border: '2px dashed #E0CEBA',
        background: 'linear-gradient(135deg, #FBF7F1 0%, #F8F2EA 100%)',
      }}
      role="img"
      aria-label={`${label} — placeholder`}
    >
      <span
        className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ background: '#FFFFFF', border: '1px solid #EFE4D4', color: '#C4943E' }}
      >
        <ImagePlus size={20} />
      </span>
      <span className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: '#A87830' }}>
        {label}
      </span>
      <span className="text-xs leading-relaxed font-medium max-w-[240px]" style={{ color: '#8C7B6E' }}>
        {note}
      </span>
    </div>
  );
}
