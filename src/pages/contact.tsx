import LegacyPage, { type LegacyPageProps } from '../lib/legacyPage';
import { loadLegacyPage } from '../lib/legacyPageData';

export function getStaticProps() {
  return { props: loadLegacyPage('contact.html') };
}

export default function Contact(props: LegacyPageProps) {
  return <LegacyPage {...props} />;
}
