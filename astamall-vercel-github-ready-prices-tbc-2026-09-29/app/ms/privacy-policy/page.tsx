import LegalPage, { legalMetadata } from '@/components/legal/legal-page';
import { privacyPolicy } from '@/lib/privacy-policy';

export const metadata = legalMetadata(privacyPolicy, 'ms');

export default function Page() {
  return <LegalPage docs={privacyPolicy} locale="ms" />;
}
