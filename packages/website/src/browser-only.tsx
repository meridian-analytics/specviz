import BrowserOnly from "@docusaurus/BrowserOnly"
import type { DocusaurusConfig } from "@docusaurus/types"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

type Props = {
  children: (
    urlFn: (url: string) => string,
    siteConfig: DocusaurusConfig,
  ) => JSX.Element
}

export default function (props: Props) {
  const { siteConfig } = useDocusaurusContext()
  return (
    <BrowserOnly
      children={() =>
        props.children((url: string) => siteConfig.baseUrl + url, siteConfig)
      }
      fallback={<div>Loading...</div>}
    />
  )
}
