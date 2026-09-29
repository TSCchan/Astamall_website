'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Star, X } from '@phosphor-icons/react';
import type { ProductReview } from '@/lib/catalog';

function Rating({ value }: { value: number }) {
  return <div className="review-rating" aria-label={`${value} out of 5 stars`}>
    <span className="review-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => <Star key={index} weight="fill" className={index < value ? 'is-filled' : ''} />)}
    </span>
    <span>{value.toFixed(1)}</span>
  </div>;
}

export default function ProductReviews({ productName, reviews }: { productName: string; reviews: ProductReview[] }) {
  const reduceMotion = useReducedMotion();
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const average = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0;

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const problems: Record<string, string> = {};
    const name = String(data.get('review-name') || '').trim();
    const email = String(data.get('review-email') || '').trim();
    const comment = String(data.get('review-comment') || '').trim();
    if (!name) problems.name = 'Please enter your name.';
    if (!email) problems.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.email = 'Please enter a valid email address.';
    if (!rating) problems.rating = 'Please choose a rating.';
    if (comment.length < 10) problems.comment = 'Please write at least 10 characters.';
    setErrors(problems);
    if (Object.keys(problems).length) {
      const first = Object.keys(problems)[0];
      const target = first === 'rating' ? form.querySelector<HTMLInputElement>('input[name="review-rating"]') : form.elements.namedItem(`review-${first}`) as HTMLInputElement | HTMLTextAreaElement | null;
      target?.focus();
      return;
    }
    const body = `Product: ${productName}\nName: ${name}\nEmail: ${email}\nRating: ${rating} out of 5\n\nReview:\n${comment}`;
    window.location.href = `mailto:astamall92@gmail.com?subject=${encodeURIComponent(`ASTAMALL product review: ${productName}`)}&body=${encodeURIComponent(body)}`;
    setStatus('Your email draft is ready. Send it from your email app to submit your review for approval.');
  };

  return <section className="pdp-reviews" aria-labelledby="product-reviews-title">
    <header className="pdp-reviews-header">
      <div className="pdp-reviews-overview">
        <p className="eyebrow">Reviews</p>
        <h2 id="product-reviews-title">Customer reviews</h2>
        {reviews.length > 0 ? <div className="review-average" aria-label={`${average.toFixed(1)} out of 5 stars from ${reviews.length} reviews`}>
          <strong>{average.toFixed(1)}</strong>
          <Rating value={average} />
          <p>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
        </div> : <p className="review-count">0 reviews</p>}
      </div>
      {!formOpen&&<button className="button review-write-button" type="button" onClick={() => { setFormOpen(true); setStatus(''); }}>Write a Review</button>}
    </header>

    <AnimatePresence initial={false}>
      {formOpen&&<motion.form
        className="review-form"
        onSubmit={submitReview}
        noValidate
        initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(0 0 14% 0)' }}
        animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 10% 0)' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="review-form-heading"><div><h3>Write a Review</h3><p>Your experience can help another customer.</p></div><button type="button" className="icon-button" aria-label="Close review form" onClick={() => setFormOpen(false)}><X size={20} /></button></div>
        <fieldset className="review-rating-field" aria-describedby={errors.rating ? 'review-rating-error' : undefined}>
          <legend>Your rating</legend>
          <div className="review-rating-options">
            {[1,2,3,4,5].map(value => <label key={value} className={value <= rating ? 'is-selected' : ''}><input type="radio" name="review-rating" value={value} checked={rating === value} onChange={() => { setRating(value); setErrors(current => ({ ...current, rating: '' })); }} /><Star weight="fill" aria-hidden="true" /><span className="sr-only">{value} {value === 1 ? 'star' : 'stars'}</span></label>)}
          </div>
          {errors.rating&&<p className="field-error" id="review-rating-error">{errors.rating}</p>}
        </fieldset>
        <div className="review-form-grid">
          <label className="field">Name<input name="review-name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'review-name-error' : undefined} onBlur={event => { if (!event.target.value.trim()) setErrors(current => ({ ...current, name: 'Please enter your name.' })); }} />{errors.name&&<span className="field-error" id="review-name-error">{errors.name}</span>}</label>
          <label className="field">Email <span>Not published</span><input name="review-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'review-email-error' : undefined} onBlur={event => { const value=event.target.value.trim(); if (!value) setErrors(current => ({ ...current, email: 'Please enter your email address.' })); else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) setErrors(current => ({ ...current, email: 'Please enter a valid email address.' })); }} />{errors.email&&<span className="field-error" id="review-email-error">{errors.email}</span>}</label>
          <label className="field review-comment-field">Your review<textarea name="review-comment" rows={5} aria-invalid={Boolean(errors.comment)} aria-describedby={errors.comment ? 'review-comment-error' : undefined} onBlur={event => { if (event.target.value.trim().length < 10) setErrors(current => ({ ...current, comment: 'Please write at least 10 characters.' })); }} />{errors.comment&&<span className="field-error" id="review-comment-error">{errors.comment}</span>}</label>
        </div>
        <p className="review-form-note">Submitting opens your email app. Reviews are checked before appearing on the website.</p>
        <button className="button" type="submit">Submit Review</button>
        {status&&<p className="review-form-status" role="status">{status}</p>}
      </motion.form>}
    </AnimatePresence>

    <div className="pdp-review-content" aria-label="Customer review list">
      {reviews.length > 0 ? <div className="pdp-review-list">
        {reviews.map((review, index) => <motion.article
          key={`${review.name}-${index}`}
          className="pdp-review"
          initial={reduceMotion ? false : { opacity: 0.45, clipPath: 'inset(0 0 12% 0)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <header>
            <span className="review-person-mark" aria-hidden="true">{review.initials}</span>
            <div className="review-person"><h3>{review.name}</h3>{review.verified&&<p>Verified purchase</p>}</div>
            <Rating value={review.rating} />
          </header>
          <blockquote>“{review.comment}”</blockquote>
        </motion.article>)}
      </div> : <div className="review-empty-state">
        <p>No customer reviews yet.</p>
      </div>}
    </div>
  </section>;
}
