import {
  Avatar,
  Box,
  Group,
  InputWrapper,
  UnstyledButton,
  useMantineTheme,
  Text,
  Button,
  Modal,
} from "@mantine/core"
import { useUuid } from "@mantine/hooks"
import React, {
  ComponentClass,
  FC,
  FunctionComponent,
  useEffect,
  useState,
} from "react"
import { ProductType } from "../../types/ProductType"
import { StrapiEntryType } from "../../types/StrapiEntryType"
import ApiIconSVG from "./ApiIconSVG"
import ApiList from "./ApiList"

const ProductListItem: FC<{
  onChange?: (product?: StrapiEntryType<Partial<ProductType>>) => void
  value?: StrapiEntryType<Partial<ProductType>>
}> = ({ value, onChange }) => {
  const theme = useMantineTheme()
  if (!value)
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
        onClick={() => onChange && onChange(undefined)}
      >
        Brak
      </UnstyledButton>
    )
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
        <Avatar color="blue" radius="sm">
          <ApiIconSVG
            entryName="productCategories"
            id={value.attributes.iconId}
          />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {value.attributes.name}
          </Text>
          <Text color="dimmed" size="xs">
            {value.attributes.codeName}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  )
}

const mapping: { [key: string]: React.ReactNode } = {
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
  const [entry, setEntry] = useState<StrapiEntryType<any> | undefined>(
    props?.value
  )
  const [opened, setOpened] = useState<boolean>(false)
  const uuid = useUuid()

  useEffect(() => {
    entry && props.onChange && props.onChange(entry)
  }, [entry])

  return (
    <InputWrapper label={props.label}>
      <Modal opened={opened} onClose={() => setOpened(false)} title="">
        {props.entryName && mapping[props.entryName] ? (
          <ApiList
            entryName={props.entryName ? props.entryName : ""}
            ListItem={mapping[props.entryName] as React.ElementType<any>}
            label={props.label}
            onChange={setEntry}
          />
        ) : (
          <Text color="red">
            Entry Name not valid or element was not defined in mapping
          </Text>
        )}
      </Modal>
      {props.entryName && mapping[props.entryName] ? (
        <div key={uuid}>
          {React.createElement(
            mapping[props.entryName] as
              | FunctionComponent<any>
              | ComponentClass<any, any>,
            {
              onChange: () => {
                setOpened(true)
              },
              value: entry,
            }
          )}
        </div>
      ) : (
        <Text color="red">
          Entry Name not valid or element was not defined in mapping
        </Text>
      )}
    </InputWrapper>
  )
}

export default InputApiEntry
