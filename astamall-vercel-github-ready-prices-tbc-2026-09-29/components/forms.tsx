'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { CaretDown, ArrowUpRight } from '@phosphor-icons/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { faqs } from '@/lib/catalog';

export function FaqList({ compact = false }: { compact?: boolean }) {
  const [category, setCategory] = useState('All');
  const visible = compact ? faqs.slice(0, 4) : faqs.filter(f => category === 'All' || f.category === category);
  return <>{!compact && <div className="category-filters">{['All', ...faqs.map(f => f.category)].map(c => <button key={c} onClick={() => setCategory(c)} aria-pressed={c === category}>{c}</button>)}</div>}<Accordion type="single" collapsible className="faq-list">{visible.map(f => <AccordionItem key={f.q} value={f.q}><AccordionTrigger className="faq-trigger">{f.q}<span aria-hidden="true"><CaretDown size={20} weight="light" /></span></AccordionTrigger><AccordionContent className="faq-answer">{f.a}</AccordionContent></AccordionItem>)}</Accordion></>;
}

const contactFields = [
  { name: 'name', label: 'Name', type: 'text', required: true, auto: 'name' },
  { name: 'email', label: 'Email', type: 'email', required: true, auto: 'email' },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', required: false, auto: 'tel' },
];

export function ContactForm() {
  const params = useSearchParams();
  const enquiry = params.get('items') ? `I would like to request an order for:\n${params.get('items')}\n\nPlease confirm pricing, availability and delivery.\n\n` : params.get('product') ? `I would like to enquire about ${params.get('product')}.\nOption: ${params.get('option') || 'Standard'}\nQuantity: ${params.get('quantity') || '1'}\n\n` : '';
  const topics = ['Product question', 'Ingredients', 'Orders', 'Business enquiry', 'Other'];
  const initialTopic = topics.includes(params.get('topic') || '') ? params.get('topic')! : 'Product question';
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const problems: Record<string, string> = {};
    for (const key of ['name', 'email', 'message']) if (!String(data.get(key) || '').trim()) problems[key] = `Please enter your ${key}.`;
    if (data.get('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email')))) problems.email = 'Please enter a valid email address.';
    setErrors(problems);
    if (Object.keys(problems).length) { (form.elements.namedItem(Object.keys(problems)[0]) as HTMLInputElement)?.focus(); return; }
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone') || 'Not provided'}\nOrder number: ${data.get('order') || 'Not provided'}\n\n${data.get('message')}`;
    window.location.href = `mailto:astamall92@gmail.com?subject=${encodeURIComponent(`ASTAMALL: ${data.get('topic')}`)}&body=${encodeURIComponent(body)}`;
    setMessage('Your email draft is ready. Send it from your email app to contact us. Nothing has been submitted through this website.');
  };
  return <form className="contact-form" onSubmit={submit} noValidate><div className="form-grid">{contactFields.map(f => <label className="field" key={f.name}>{f.label}<input name={f.name} type={f.type} autoComplete={f.auto} required={f.required} aria-invalid={Boolean(errors[f.name])} aria-describedby={errors[f.name] ? `${f.name}-error` : undefined} />{errors[f.name] && <span className="field-error" id={`${f.name}-error`}>{errors[f.name]}</span>}</label>)}<label className="field">Topic<select name="topic" defaultValue={initialTopic}>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></label><label className="field full-field">Order number (optional)<input name="order" /></label><label className="field full-field">Message<textarea name="message" defaultValue={enquiry} rows={enquiry ? 8 : 5} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</label></div><p className="small-text">This opens your email app with a draft. We do not collect this form on the website.</p><button className="button" type="submit">Create email draft <ArrowUpRight size={18} /></button>{message && <p role="status" className="notice">{message}</p>}</form>;
}

