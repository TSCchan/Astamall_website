'use client';

import Link from 'next/link';
import { cartLineKey } from '@/lib/cart-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, CreditCard, Bank, Check } from '@phosphor-icons/react';
import { useStore } from '@/components/store-context';
import { ProductArt } from '@/components/brand-assets';
import { products, money, productOptions } from '@/lib/catalog';
import { getDemoOrder, getServerDemoOrder, setDemoOrder, subscribeDemoOrder, validateCheckout } from '@/lib/demo-order';

const contactFields = [['name', 'Full Name', 'name', 'text'], ['email', 'Email', 'email', 'email'], ['phone', 'Phone', 'tel', 'tel']];
const deliveryFields = [['address', 'Address', 'address-line1', 'text'], ['address2', 'Address Line 2 (optional)', 'address-line2', 'text'], ['postcode', 'Postcode', 'postal-code', 'text'], ['city', 'City', 'address-level2', 'text']];
const states = ['Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'];

function PaymentPanel({ method }: { method: string }) {
  const reduce = useReducedMotion();
  return <AnimatePresence mode="wait" initial={false}><motion.div className="payment-panel" key={method === 'Bank Transfer' ? 'bank' : method ? 'card' : 'none'} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .18 }}>
    {method === 'Bank Transfer' ? <div className="bank-instructions"><Bank size={27} weight="light" /><h3>Bank Transfer</h3><p>Bank details and your payment reference will appear here when ordering opens.</p><p className="small-text">No transfer is required for this demo.</p></div> : method ? <><div className="payment-panel-heading"><CreditCard size={25} weight="light" /><span>Visa / Mastercard</span><small>Demo fields</small></div><fieldset disabled className="form-grid demo-card-fields" aria-label="Card payment preview, fields disabled"><label className="field full-field">Cardholder Name<input autoComplete="off" placeholder="Cardholder name" /></label><label className="field full-field">Card Number<input autoComplete="off" placeholder="••••  ••••  ••••  ••••" /></label><label className="field">Expiry<input autoComplete="off" placeholder="MM / YY" /></label><label className="field">CVV<input autoComplete="off" placeholder="•••" /></label></fieldset><p className="small-text">Card entry is unavailable in this demo.</p></> : <p className="small-text">Choose a method to preview the payment details.</p>}
  </motion.div></AnimatePresence>;
}

export function Checkout() {
  const { lines, loaded } = useStore();
  const router = useRouter();
  const [method, setMethod] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const problems = validateCheckout(data);
    setErrors(problems);
    if (Object.keys(problems).length) {
      const name = Object.keys(problems)[0];
      form.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
      return;
    }
    busy.current = true;
    setProcessing(true);
    const text = (key: string) => String(data.get(key) || '').trim();
    const totalKnown = lines.every(line => products.find(p => p.slug === line.slug)?.price != null);
    const receipt = {
      reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      lines: lines.map(line => ({ ...line })),
      total: totalKnown ? lines.reduce((sum, line) => sum + (products.find(p => p.slug === line.slug)?.price || 0) * line.quantity, 0) : null,
      name: text('name'), email: text('email'),
      address: [text('address'), text('address2'), `${text('postcode')} ${text('city')}`, text('state'), 'Malaysia'].filter(Boolean),
      payment: text('payment'),
    };
    // This interval previews button feedback only; no network request, payment or order creation occurs.
    timer.current = setTimeout(() => { setDemoOrder(receipt); router.push('/order-confirmation'); }, reduce ? 0 : 650);
  };
  const renderField = ([name, label, auto, type]: string[]) => <label className={`field ${['address', 'address2', 'name'].includes(name) ? 'full-field' : ''}`} key={name}>{label}<input aria-label={label} type={type} name={name} autoComplete={auto} required={name !== 'address2'} maxLength={name === 'postcode' ? 5 : 200} inputMode={name === 'postcode' ? 'numeric' : undefined} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />{errors[name] && <span className="field-error" id={`${name}-error`}>{errors[name]}</span>}</label>;
  if (!loaded) return <p role="status">Loading your cart...</p>;
  if (!lines.length) return <div className="empty-state branded-empty"><h2>Your ASTAMALL ritual starts here.</h2><p>Add a product to explore the checkout experience.</p><Link href="/shop" className="button">Explore the Collection</Link></div>;
  return <><div className="demo-checkout-notice"><span className="demo-label">Demo</span><div><strong>Demo checkout. No real payment will be processed.</strong><p>Use sample contact and delivery details. They clear when you refresh.</p></div></div><div className="checkout-layout refined-checkout">
    <form onSubmit={submit} noValidate aria-busy={processing} onChange={event => { const target = event.target; if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return; const field = target.name; if (errors[field]) setErrors(previous => { const next = { ...previous }; delete next[field]; return next; }); }}>
      <fieldset disabled={processing} className="checkout-step"><legend><span>01</span>Contact</legend><div className="form-grid">{contactFields.map(renderField)}</div></fieldset>
      <fieldset disabled={processing} className="checkout-step"><legend><span>02</span>Delivery Details</legend><div className="form-grid">{deliveryFields.map(renderField)}<label className="field">State<select name="state" aria-label="State" required aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? 'state-error' : undefined}><option value="">Select state / territory</option>{states.map(state => <option key={state}>{state}</option>)}</select>{errors.state && <span className="field-error" id="state-error">{errors.state}</span>}</label><label className="field">Country<input name="country" value="Malaysia" readOnly autoComplete="country-name" /></label></div></fieldset>
      <fieldset disabled={processing} className="checkout-step payment-step"><legend><span>03</span>Payment</legend><div className="payment-cards" role="radiogroup" aria-label="Payment method" aria-describedby={errors.payment ? 'payment-error' : undefined} aria-invalid={Boolean(errors.payment)}>{['Visa', 'Mastercard', 'Bank Transfer'].map(value => <label key={value} className={method === value ? 'selected' : ''}><input name="payment" type="radio" value={value} checked={method === value} onChange={() => setMethod(value)} />{value === 'Bank Transfer' ? <Bank size={22} weight="light" /> : <CreditCard size={22} weight="light" />}<span>{value}</span>{method === value && <Check size={15} weight="bold" />}</label>)}</div>{errors.payment && <p className="field-error" id="payment-error">{errors.payment}</p>}<PaymentPanel method={method} /></fieldset>
      {Object.keys(errors).length > 0 && <p className="field-error checkout-error-summary" role="alert">Please check the highlighted fields before continuing.</p>}
      <button className="button place-order" type="submit" disabled={processing}><span>{processing ? 'Preparing confirmation...' : 'Pay Now'}</span>{!processing && <ArrowUpRight size={18} />}{processing && <span className="order-progress" aria-hidden="true" />}</button><p className="small-text checkout-reassurance" role="status">{processing ? 'Previewing the confirmation. No payment is being processed.' : 'Demo only. No charge will be made and no real order will be created.'}</p>
    </form>
    <aside className="order-summary checkout-order-summary"><h2>Order summary</h2>{lines.map(line => { const product = products.find(p => p.slug === line.slug)!; return <div className="checkout-summary-item" key={cartLineKey(line)}><ProductArt product={product} /><div><span>{product.name}</span><small>{line.variant || productOptions(product).options[0].label}</small><small>Quantity {line.quantity}</small><small>{money(product.price)}</small></div></div>; })}<div className="checkout-total"><strong>Preview total</strong><span>{money(null)}</span></div><p>Delivery charges are not included. Products awaiting Malaysian pricing cannot be added to the demo cart.</p><Link href="/cart" className="text-link">Edit Cart <ArrowUpRight size={16} /></Link></aside>
  </div></>;
}

export function OrderConfirmation() {
  const receipt = useSyncExternalStore(subscribeDemoOrder, getDemoOrder, getServerDemoOrder);
  const heading = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => { heading.current?.focus(); }, [receipt]);
  if (!receipt) return <div className="empty-state branded-empty"><p className="eyebrow">Demo confirmation</p><h1 ref={heading} tabIndex={-1}>Your preview stays private.</h1><p>No demo confirmation is available. Preview details clear when you refresh; no order has been created.</p><Link href="/checkout" className="button">Return to Checkout</Link><Link href="/shop" className="text-link">Continue Shopping</Link></div>;
  return <div className="confirmation"><motion.div className="confirmation-line" initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }} /><p className="eyebrow">Demo confirmation, no order placed</p><h1 ref={heading} tabIndex={-1}>Thank you. Your order is confirmed.</h1><p className="confirmation-intro">This is a demonstration of an order confirmation. No payment was processed, no order was created and no confirmation email was sent.</p><div className="demo-reference"><span>Demo order number</span><strong>{receipt.reference}</strong></div><div className="confirmation-details"><section><h2>Purchased items</h2>{receipt.lines.map(line => { const p = products.find(p => p.slug === line.slug)!; return <div className="confirmation-item" key={cartLineKey(line)}><ProductArt product={p} /><div><p>{p.name}</p><span>{line.variant || productOptions(p).options[0].label}</span><span>Quantity {line.quantity}, {money(p.price)}</span></div></div>; })}<div className="confirmation-total"><strong>Total</strong><span>{money(null)}</span></div></section><section className="confirmation-delivery"><h2>Order details</h2><h3>Delivery address</h3><address>{receipt.name}<br />{receipt.address.map(line => <span key={line}>{line}<br /></span>)}</address><h3>Payment method</h3><p>{receipt.payment}, not charged</p><h3>Contact email</h3><p>{receipt.email}</p></section></div><div className="button-row"><Link href="/shop" className="button">Continue Shopping <ArrowUpRight size={18} /></Link><Link href="/astaxanthin" className="text-link">Explore Astaxanthin</Link></div><p className="small-text">Your preview cart is still available. These details disappear when you refresh.</p></div>;
}
