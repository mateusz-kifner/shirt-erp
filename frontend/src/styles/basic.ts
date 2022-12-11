import { MantineTheme } from "@mantine/core"

const SxBorder = (theme: MantineTheme) => ({
  border:
    theme.colorScheme === "dark" ? "1px solid #2C2E33" : "1px solid #ced4da",
})

const SxRadius = (theme: MantineTheme) => ({
  borderRadius: theme.radius.sm,
})

const SxBackground = (theme: MantineTheme) => ({
  backgroundColor:
    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
})

const SxColor = (theme: MantineTheme) => ({
  color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
})
export { SxBorder, SxRadius, SxBackground, SxColor }
