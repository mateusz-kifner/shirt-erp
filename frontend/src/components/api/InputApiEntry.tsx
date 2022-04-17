import {
  Avatar,
  Box,
  Group,
  InputWrapper,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core"
import React, { FC } from "react"
import { ProductType } from "../../types/ProductType"
import { StrapiEntryType } from "../../types/StrapiEntryType"
import ApiList from "./ApiList"

const ProductListItem: FC<{
  onChange?: (product: StrapiEntryType<Partial<ProductType>>) => void
  value: StrapiEntryType<Partial<ProductType>>
}> = ({ value, onChange }) => {
  const theme = useMantineTheme()

  return (
    <UnstyledButton
      sx={{
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      }}
      onClick={() => onChange && onChange(value)}
    >
      <Group>
        <Avatar
          src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
          radius="xl"
        />
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {value.attributes.name}
          </Text>
          <Text color="dimmed" size="xs">
            {value.attributes.codeName}
          </Text>
        </Box>

        {/* {theme.dir === "ltr" ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )} */}
      </Group>
    </UnstyledButton>
  )
}

const mapping: { [key: string]: React.ElementType } = {
  products: ProductListItem,
  clients: ProductListItem,
}

interface InputApiEntryProps {
  label?: string
  placeholder?: string
  value?: StrapiEntryType<any>
  entryName?: string
  onChange?: (val: StrapiEntryType<any>) => void
  disabled?: boolean
  required?: boolean
}

const InputApiEntry: FC<InputApiEntryProps> = (props) => {
  return (
    <InputWrapper label={props.label}>
      {props.entryName && mapping[props.entryName] ? (
        <ApiList
          entryName={props.entryName ? props.entryName : ""}
          ListItem={mapping[props.entryName]}
          label={props.label}
          onChange={props.onChange}
        />
      ) : (
        <Text>Entry Name not valid or element was not defined in mapping</Text>
      )}
    </InputWrapper>
  )
}

export default InputApiEntry
