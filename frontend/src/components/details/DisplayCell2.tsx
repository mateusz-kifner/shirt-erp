import {
  Box,
  createStyles,
  InputVariant,
  MantineNumberSize,
  MantineSize,
  Sx,
  useMantineTheme,
} from "@mantine/core"

import React, { CSSProperties, FC, ReactNode } from "react"

const sizes = {
  xs: 30,
  sm: 36,
  md: 42,
  lg: 50,
  xl: 60,
}

const useStyles = createStyles(
  (
    theme,
    {
      size,
      radius,
      variant,
      rightSectionWidth,
      withRightSection,
      iconWidth,
    }: {
      radius: MantineNumberSize
      size: MantineSize
      variant: InputVariant
      rightSectionWidth: number
      withRightSection: boolean
      iconWidth: number
    }
  ) => {
    const invalidColor = theme.colors.red[theme.colorScheme === "dark" ? 6 : 7]
    const sizeStyles =
      variant === "default" || variant === "filled"
        ? {
            minHeight: theme.fn.size({ size, sizes }),
            paddingLeft: theme.fn.size({ size, sizes }) / 3,
            paddingRight: withRightSection
              ? rightSectionWidth
              : theme.fn.size({ size, sizes }) / 3,
            borderRadius: theme.fn.radius(radius),
          }
        : null

    return {
      wrapper: {
        position: "relative",
      },

      input:
        variant === "headless"
          ? {}
          : {
              ...theme.fn.fontStyles(),
              height:
                variant === "unstyled"
                  ? undefined
                  : theme.fn.size({ size, sizes }),
              WebkitTapHighlightColor: "transparent",
              lineHeight: `${theme.fn.size({ size, sizes }) - 2}px`,
              appearance: "none",
              resize: "none",
              boxSizing: "border-box",
              fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
              width: "100%",
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
              display: "block",
              textAlign: "left",
              ...sizeStyles,

              "&:disabled": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[1],
                color: theme.colors.dark[2],
                opacity: 0.6,
                cursor: "not-allowed",

                "&::placeholder": {
                  color: theme.colors.dark[2],
                },
              },

              "&::placeholder": {
                opacity: 1,
                userSelect: "none",
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[3]
                    : theme.colors.gray[5],
              },

              "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button, &::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration":
                {
                  appearance: "none",
                },

              "&[type=number]": {
                MozAppearance: "textfield",
              },
            },

      defaultVariant: {
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[4]
        }`,
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        transition: "border-color 100ms ease",

        "&:focus, &:focus-within": {
          outline: "none",
          borderColor:
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 8 : 5
            ],
        },
      },

      filledVariant: {
        border: "1px solid transparent",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[1],

        "&:focus, &:focus-within": {
          outline: "none",
          borderColor: `${
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 8 : 5
            ]
          } !important`,
        },
      },

      unstyledVariant: {
        borderWidth: 0,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: "transparent",
        minHeight: 28,
        outline: 0,

        "&:focus, &:focus-within": {
          outline: "none",
          borderColor: "transparent",
        },

        "&:disabled": {
          backgroundColor: "transparent",

          "&:focus, &:focus-within": {
            outline: "none",
            borderColor: "transparent",
          },
        },
      },

      withIcon: {
        paddingLeft:
          typeof iconWidth === "number"
            ? iconWidth
            : theme.fn.size({ size, sizes }),
      },

      invalid: {
        color: invalidColor,
        borderColor: invalidColor,

        "&::placeholder": {
          opacity: 1,
          color: invalidColor,
        },
      },

      disabled: {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[1],
        color: theme.colors.dark[2],
        opacity: 0.6,
        cursor: "not-allowed",

        "&::placeholder": {
          color: theme.colors.dark[2],
        },
      },

      icon: {
        pointerEvents: "none",
        position: "absolute",
        zIndex: 1,
        left: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width:
          typeof iconWidth === "number"
            ? iconWidth
            : theme.fn.size({ size, sizes }),
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[2]
            : theme.colors.gray[5],
      },

      rightSection: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: rightSectionWidth,
      },
    }
  }
)

interface DisplayCellProps {
  iconWidth?: number
  icon?: ReactNode
  rightSection?: ReactNode
  rightSectionWidth?: number
  rightSectionProps?: React.ComponentPropsWithoutRef<"div">
  radius?: MantineNumberSize
  variant?: InputVariant
  size?: MantineSize
  className?: string
  sx?: Sx
  style?: CSSProperties
  wrapperProps?: { [key: string]: any }

  children: React.ReactNode
}

const DisplayCell: FC<DisplayCellProps> = (props) => {
  const {
    iconWidth,
    icon,
    rightSection,
    rightSectionWidth,
    rightSectionProps,
    radius,
    variant,
    size,
    className,
    sx,
    style,
    wrapperProps,
    children,
  } = props
  const theme = useMantineTheme()
  const _variant = variant || "default"
  const { classes, cx } = useStyles({
    radius: radius ? radius : "md",
    size: size ? size : "md",
    variant: _variant,
    rightSectionWidth: rightSectionWidth ? rightSectionWidth : 36,
    iconWidth: iconWidth ? iconWidth : 36,
    withRightSection: !!rightSection,
  })
  return (
    <Box
      className={cx(classes.wrapper, className)}
      sx={sx}
      style={style}
      {...wrapperProps}
    >
      {icon && <div className={classes.icon}>{icon}</div>}

      <Box
        // @ts-ignore
        className={cx(classes[`${_variant}Variant`], classes.input, {
          [classes.withIcon]: icon,
        })}
      >
        {children}
      </Box>
      {rightSection && (
        <div {...rightSectionProps} className={classes.rightSection}>
          {rightSection}
        </div>
      )}
    </Box>
  )
}

export default DisplayCell
