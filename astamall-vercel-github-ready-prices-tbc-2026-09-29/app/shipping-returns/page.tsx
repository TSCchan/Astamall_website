import LegalPage, { legalMetadata } from '@/components/legal/legal-page';
import { shippingReturns } from '@/lib/shipping-returns';

export const metadata = legalMetadata(shippingReturns, 'en');

export default function Page() {
  return <LegalPage docs={shippingReturns} locale="en" />;
}
