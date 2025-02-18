import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import styles from "./index.module.scss";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Decentralized Serverless Platform"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
            {siteConfig.tagline}
          </p>
          <Link className={styles.button} to="/docs/build/overview">
            Get started
          </Link>
        </div>
      </header>
    </Layout>
  );
}
