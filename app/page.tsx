import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProcessGrid from "@/components/ProcessGrid/ProcessGrid";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <ProcessGrid />
      </main>
      <Footer />
    </div>
  );
}
