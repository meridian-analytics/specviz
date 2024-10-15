import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Heading from "@theme/Heading"
import Layout from "@theme/Layout"
import clsx from "clsx"
import type * as React from "react"
import styles from "./index.module.css"

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Header />
      <main>
        <Features />
      </main>
    </Layout>
  )
}

function Header() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className="hero__subtitle">zero dependencies, 66 kB</p>
        <pre className={clsx("hero__subtitle", styles.heroInstall)}>
          npm install @meridian_cfi/specviz
        </pre>
      </div>
    </header>
  )
}

type FeatureProps = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<"svg">>
  description: JSX.Element
}

const features: FeatureProps[] = [
  {
    title: "Visualize & Listen",
    Svg: require("@site/static/undraw/fish-bowl.svg").default,
    description: (
      <>
        Load pre-computed spectrograms and waveforms and visualize them using
        synchronized zoom, pan, and audio playback.
      </>
    ),
  },
  {
    title: "Annotate & Analyze",
    Svg: require("@site/static/undraw/engineers.svg").default,
    description: (
      <>
        Designed for the annotation of audio and spectrogram data, with support
        for custom data types.
      </>
    ),
  },
  {
    title: "Modular Design",
    Svg: require("@site/static/undraw/design-components.svg").default,
    description: (
      <>
        Pick only the features you need. Customize the appearance and behavior
        of your app or tool.
      </>
    ),
  },
  {
    title: "Build Collaborative Apps",
    Svg: require("@site/static/undraw/collaboration.svg").default,
    description: (
      <>
        Create rich, interactive user experiences tailored to your
        domain-specific needs.
      </>
    ),
  },
  {
    title: "Powered by React",
    Svg: require("@site/static/undraw/react.svg").default,
    description: (
      <>
        Modern React components and hooks make it easy to build simple and
        complex applications alike.
      </>
    ),
  },
  {
    title: "Peace of Mind",
    Svg: require("@site/static/undraw/meditation.svg").default,
    description: (
      <>
        Specviz is written in TypeScript, improving developer experience and
        safety for your codebase.
      </>
    ),
  },
  {
    title: "Free & Open Source",
    Svg: require("@site/static/undraw/connected-world.svg").default,
    description: (
      <>
        Specviz is open source and comes with a LGPL license. Contribute to the
        project on GitHub.
      </>
    ),
  },
  {
    title: "Starter Applications",
    Svg: require("@site/static/undraw/questions.svg").default,
    description: (
      <>
        Get started quickly with a set of example apps that showcase the
        capabilities of Specviz.
      </>
    ),
  },
]

function Feature(props: FeatureProps) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <props.Svg width={200} height={200} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{props.title}</Heading>
        <p>{props.description}</p>
      </div>
    </div>
  )
}

function Features() {
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        padding: "2rem 0",
        width: "100%",
      }}
    >
      <div className="container">
        <div className="row">
          {features.map(props => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
