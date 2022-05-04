const navigation = [
  {
    text: "Installation",
    link: "/Installation",
    // children: [
    //   { text: "", link: "/" },
    //   { text: "Getting Started", link: "/guide/getting-started" },
    //   { text: "Configuration", link: "/guide/configuration" },
    //   { text: "Asset Handling", link: "/guide/assets" },
    //   { text: "Markdown Extensions", link: "/guide/markdown" },
    //   { text: "Using Vue in Markdown", link: "/guide/using-vue" },
    //   { text: "Deploying", link: "/guide/deploy" },
    // ],
  },
  {
    text: "Models",
    children: [{ text: "Products", link: "/models/Products" }],
  },
  {
    text: "Pages",
    children: [{ text: "Settings", link: "/pages/settings" }],
  },
]

module.exports = {
  title: "ShirtDipERP Docs",
  description: "ShirtDipERP system documentation",
  themeConfig: {
    nav: [
      { text: "GitHub", link: "https://github.com/kifner-mateusz/ShirtDipERP" },
    ],
    sidebar: { "/": navigation },
  },
}
