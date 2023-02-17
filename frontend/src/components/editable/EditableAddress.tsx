import { ActionIcon, Group, Input, Stack } from "@mantine/core"
import { useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import { AddressType } from "../../types/AddressType"
import { Copy } from "tabler-icons-react"
import DisplayCell from "../details/DisplayCell"
import EditableEnum from "./EditableEnum"
import EditableText from "./EditableText"
import { isEqual } from "lodash"
import EditableInput from "../../types/EditableInput"
import { handleBlurForInnerElements } from "../../utils/handleBlurForInnerElements"

const provinces = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
]

interface EditableAddressProps
  extends Omit<EditableInput<AddressType>, "label"> {
  label?: AddressType & { name: string }
  maxLength?: number
}

const EditableAddress = (props: EditableAddressProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    maxLength,
    leftSection,
    rightSection,
  } = props
  const [address, setAddress] = useState<AddressType>(
    value
      ? value
      : initialValue
      ? initialValue
      : {
          streetName: "",
          streetNumber: "",
          apartmentNumber: "",
          secondLine: "",
          city: "",
          province: "",
          postCode: "",
        }
  )
  const [focus, setFocus] = useState<boolean>(false)
  const clipboard = useClipboard()
  const { hovered, ref } = useHover()

  const setAddressField = (key: string, val: string) => {
    const new_address = { ...address, [key]: val }
    const prevAddress = value
      ? value
      : initialValue
      ? initialValue
      : {
          streetName: "",
          streetNumber: "",
          apartmentNumber: "",
          secondLine: "",
          city: "",
          province: "",
          postCode: "",
        }
    if (!isEqual(prevAddress, new_address)) {
      onSubmit?.(new_address)
      setAddress(new_address)
    }
  }

  useEffect(() => {
    if (focus) {
      // setPrevAddress({ ...address })
    }
    // eslint-disable-next-line
  }, [focus])

  useEffect(() => {
    if (value && !isEqual(address, value)) {
      setAddress({ ...value })
    }
    //eslint-disable-next-line
  }, [
    value?.streetName,
    value?.streetNumber,
    value?.apartmentNumber,
    value?.secondLine,
    value?.postCode,
    value?.city,
    value?.province,
  ])

  const toString = () => {
    return (
      (address?.streetName ? "ul. " + address?.streetName : "") +
      " " +
      (address.streetNumber || "") +
      (address.apartmentNumber ? " / " + address.apartmentNumber : "") +
      "\n" +
      (address.secondLine ? address.secondLine + "\n" : "") +
      (address.postCode ? address.postCode + " " : "") +
      (address.city || "") +
      (address.postCode || address.city ? "\n" : "") +
      (address.province || address.province)
    )
  }

  return (
    <Input.Wrapper
      ref={ref}
      label={
        <>
          {label?.name}
          {
            <ActionIcon
              size="xs"
              style={{
                display: "inline-block",
                transform: "translate(4px, 4px)",
                marginRight: 4,
              }}
              onClick={() => {
                const address_text = toString()
                clipboard.copy(address_text)
                showNotification({
                  title: "Skopiowano do schowka",
                  message: address_text,
                })
              }}
              tabIndex={-1}
            >
              <Copy size={16} />
            </ActionIcon>
          }
        </>
      }
      labelElement="div"
      required={required}
      onClick={() => setFocus(true)}
      onFocus={() => setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      {focus ? (
        <Stack
          style={{ position: "relative" }}
          sx={[SxBorder, SxRadius]}
          p="md"
          tabIndex={999999999} // ensure that focus can be captured on element
        >
          <EditableText
            label={label?.streetName ?? undefined}
            value={value?.streetName ?? ""}
            onSubmit={(value) =>
              value !== null && setAddressField("streetName", value)
            }
          />
          <Group grow={true}>
            <EditableText
              label={label?.streetNumber ?? undefined}
              value={value?.streetNumber ?? ""}
              onSubmit={(value) =>
                value !== null && setAddressField("streetNumber", value)
              }
              style={{ flexGrow: 1 }}
            />
            <EditableText
              label={label?.apartmentNumber ?? undefined}
              value={value?.apartmentNumber ?? ""}
              onSubmit={(value) =>
                value !== null && setAddressField("apartmentNumber", value)
              }
              style={{ flexGrow: 1 }}
            />
          </Group>
          <EditableText
            label={label?.secondLine ?? undefined}
            value={value?.secondLine ?? ""}
            onSubmit={(value) =>
              value !== null && setAddressField("secondLine", value)
            }
          />
          <EditableText
            label={label?.postCode ?? undefined}
            value={value?.postCode ?? ""}
            onSubmit={(value) =>
              value !== null && setAddressField("postCode", value)
            }
          />
          <EditableText
            label={label?.city ?? undefined}
            value={value?.city ?? ""}
            onSubmit={(value) =>
              value !== null && setAddressField("city", value)
            }
          />
          <EditableEnum
            label={label?.province ?? undefined}
            value={value?.province ?? ""}
            onSubmit={(value) =>
              value !== null && setAddressField("province", value)
            }
            enum_data={provinces}
          />
        </Stack>
      ) : (
        <DisplayCell
          icon={leftSection}
          disabled={disabled}
          hovered={hovered}
          rightSection={rightSection}
        >
          {" "}
          {toString()}
        </DisplayCell>
      )}
    </Input.Wrapper>
  )
}

export default EditableAddress
