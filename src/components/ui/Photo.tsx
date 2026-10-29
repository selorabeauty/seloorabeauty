import { Droplets } from 'lucide-react';

interface PhotoProps {
  src?: string | null;
  alt: string;
  className?: string;
  label?: string;
  priority?: boolean;
}

export default function Photo({ src, alt, className = 'w-full h-full object-contain', label, priority }: PhotoProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? undefined : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className="w-full h-full min-h-[3rem] flex flex-col items-center justify-center gap-2 text-center p-2"
      style={{ background: 'linear-gradient(135deg, #F8F2EA, #EFE4D4)', color: '#8C7B6E' }}
    >
      <Droplets size={20} />
      {label && <span className="text-xs font-bold leading-snug">{label}</span>}
    </div>
  );
}
