import dynamic from "next/dynamic"

const Markdown = dynamic(() => import("./MarkdownSSR"), {
  ssr: false,
})

export default Markdown
