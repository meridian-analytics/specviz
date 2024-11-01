import type * as Preset from "@docusaurus/preset-classic"
import type { Config } from "@docusaurus/types"
import { themes as prismThemes } from "prism-react-renderer"

// https://docusaurus.io/docs/api/docusaurus-config

const preset: Preset.Options = {
  docs: {
    sidebarPath: "./sidebars.ts",
  },
  blog: {
    showReadingTime: true,
    feedOptions: {
      type: ["rss", "atom"],
      xslt: true,
    },
    onInlineTags: "warn",
    onInlineAuthors: "warn",
    onUntruncatedBlogPosts: "warn",
  },
  theme: {
    customCss: "static/website.css",
  },
}

const themeConfig: Preset.ThemeConfig = {
  image: "logo.png",
  navbar: {
    title: "Specviz",
    logo: {
      alt: "Specviz Logo",
      src: "logo.svg",
    },
    items: [
      { to: "docs/category/guides", label: "Guides", position: "left" },
      { to: "docs/category/api", label: "API", position: "left" },
      { to: "docs/category/examples", label: "Examples", position: "left" },
      {
        href: "https://github.com/meridian-analytics/specviz",
        label: "GitHub",
        position: "right",
      },
    ],
  },
  footer: {
    style: "dark",
    links: [
      {
        title: "API",
        items: [
          { label: "Specviz", to: "docs/api/specviz" },
          { label: "Action", to: "docs/api/action" },
          { label: "Audio", to: "docs/api/audio" },
          { label: "Axis", to: "docs/api/axis" },
          { label: "Input", to: "docs/api/input" },
          { label: "Note", to: "docs/api/note" },
          { label: "Plane", to: "docs/api/plane" },
          { label: "Viewport", to: "docs/api/viewport" },
        ],
      },
      {
        title: "Examples",
        items: [
          {
            label: "Basic Spectrogram",
            to: "docs/examples/basic-spectrogram",
          },
          { label: "Basic Audio", to: "docs/examples/basic-audio" },
          {
            label: "Basic Annotation",
            to: "docs/examples/basic-annotation",
          },
          {
            label: "Interactive Spectrogram",
            to: "docs/examples/interactive-spectrogram",
          },
          {
            label: "Advanced Annotation",
            to: "docs/examples/advanced-annotation",
          },
        ],
      },
      {
        title: "More",
        items: [
          {
            label: "GitHub",
            href: "https://github.com/meridian-analytics/specviz",
          },
        ],
      },
    ],
    copyright: "💚",
  },
  prism: {
    theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
  },
}

const config: Config = {
  baseUrl: "/specviz/",
  favicon: "favicon.ico",
  i18n: { defaultLocale: "en", locales: ["en"] },
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  organizationName: "meridian-analytics",
  presets: [["classic", preset]],
  projectName: "specviz",
  staticDirectories: ["static"],
  tagline: "Visualize and annotate pre-computed spectrograms and waveforms",
  themeConfig,
  title: "Specviz",
  url: "https://meridian-analytics.github.io",
}

export default config
