import { withRouter } from "storybook-addon-react-router-v6"

export const decorators = [withRouter]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  reactRouter: {
    routePath: "/users/:id",
    routeParams: { id: "42" },
    searchParams: { tab: "window" },
  },
}
