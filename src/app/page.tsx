import FlightSearch from '@/components/FlightSearch';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Funcode Flight <span className={styles.highlight}>Tracker</span>
      </h1>
      <p className={styles.description}>
        Real-time flight status and information
      </p>
      <FlightSearch />
    </main>
  );
}
