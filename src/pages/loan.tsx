import LegacyPage, { type LegacyPageProps } from '../lib/legacyPage';
import { loadLegacyPage } from '../lib/legacyPageData';

export function getStaticProps() {
  return { props: loadLegacyPage('loan.html') };
}

export default function Loan(props: LegacyPageProps) {
  return <LegacyPage {...props} />;
}
