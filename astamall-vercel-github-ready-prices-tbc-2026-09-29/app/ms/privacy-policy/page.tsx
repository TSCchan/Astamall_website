import PrivacyPolicyPage, { privacyMetadata } from '@/components/privacy/privacy-policy-page';

export const metadata = privacyMetadata('ms');

export default function Page() {
  return <PrivacyPolicyPage locale="ms" />;
}
