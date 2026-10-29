import LegalPage, { legalMetadata } from '@/components/legal/legal-page';
import { privacyPolicy } from '@/lib/privacy-policy';

export const metadata = legalMetadata(privacyPolicy, 'en');

export default function Page() {
  return <LegalPage docs={privacyPolicy} locale="en" />;
}
