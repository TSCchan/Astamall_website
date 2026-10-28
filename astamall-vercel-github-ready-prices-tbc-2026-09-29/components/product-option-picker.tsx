'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from '@phosphor-icons/react';
import type { SampleOption } from '@/lib/catalog';

// One selection pill travels between options, so the choice reads as a single physical object.
export function OptionPicker({ name, label, options, value, onChange, compact = false }: { name: string; label: string; options: SampleOption[]; value: string; onChange: (value: string) => void; compact?: boolean }) {
  const reduce = useReducedMotion();
  const pill = useId();
  const swatches = options.some(option => option.color);
  // with a single option the pill already names it, so the legend shows only the label
  const single = options.length === 1;
  return <fieldset className={`option-picker ${swatches ? 'option-picker-swatches' : ''} ${compact ? 'option-picker-compact' : ''}`}>
    <legend><span>{label}</span>{!single && <motion.strong key={value} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>{value}</motion.strong>}</legend>
    <div className="option-picker-list">{options.map(option => {
      const selected = option.label === value;
      return <label key={option.label} className={selected ? 'selected' : ''} title={option.label}>
        <input type="radio" name={name} value={option.label} checked={selected} onChange={() => onChange(option.label)} />
        {selected && <motion.span className="option-picker-pill" layoutId={pill} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}
        {option.color && <span className="option-swatch" style={{ background: option.color }} aria-hidden="true" />}
        <span className="option-picker-label">{option.label}</span>
        {!option.color && <Check className="option-picker-check" size={14} weight="bold" aria-hidden="true" />}
      </label>;
    })}</div>
  </fieldset>;
}
