import PrivacyPolicyPage, { privacyMetadata } from '@/components/privacy/privacy-policy-page';

export const metadata = privacyMetadata('en');

export default function Page() {
  return <PrivacyPolicyPage locale="en" />;
}
