import {
  ActionIcon,
  Group,
  InputWrapper,
  Stack,
  Text,
  Textarea,
} from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import { AddressType } from "../../types/AddressType"
import preventLeave from "../../utils/preventLeave"
import { BuildingCommunity, Copy, Edit, X } from "../../utils/TablerIcons"
import DetailsEnum from "./DetailsEnum"
import DetailsText from "./DetailsText"

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

interface DetailsAddressProps {
  label?: AddressType & { name: string }
  value?: AddressType
  initialValue?: AddressType
  onSubmit?: (value: AddressType | null) => void
  disabled?: boolean
  required?: boolean
  maxLength?: number
}

const DetailsAddress: FC<DetailsAddressProps> = ({
  label,
  value,
  initialValue,

  onSubmit,
  disabled,
  required,
  maxLength,
}) => {
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
  const [prevAddress, setPrevAddress] = useState(address)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const ref = useClickOutside(() => setActive(false))

  const setAddressField = (key: string, val: string) => {
    setAddress((old_value) => ({ ...old_value, [key]: val }))
  }

  useEffect(() => {
    if (active) {
      setPrevAddress(address)
    }
  }, [active])

  useEffect(() => {
    if (address !== prevAddress) {
      onSubmit && onSubmit(address)
    }
  }, [address])

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
    <InputWrapper
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
    >
      {active ? (
        <Stack
          style={{ position: "relative" }}
          sx={[SxBorder, SxRadius]}
          p="md"
        >
          <DetailsText
            label={label?.streetName ? label.streetName : undefined}
            value={value?.streetName ? value.streetName : ""}
            onSubmit={(value) => value && setAddressField("streetName", value)}
          />
          <Group grow={true}>
            <DetailsText
              label={label?.streetNumber ? label.streetNumber : undefined}
              value={value?.streetNumber ? value.streetNumber : ""}
              onSubmit={(value) =>
                value && setAddressField("streetNumber", value)
              }
              style={{ flexGrow: 1 }}
            />
            <DetailsText
              label={label?.apartmentNumber ? label.apartmentNumber : undefined}
              value={value?.apartmentNumber ? value.apartmentNumber : ""}
              onSubmit={(value) =>
                value && setAddressField("apartmentNumber", value)
              }
              style={{ flexGrow: 1 }}
            />
          </Group>
          <DetailsText
            label={label?.secondLine ? label.secondLine : undefined}
            value={value?.secondLine ? value.secondLine : ""}
            onSubmit={(value) => value && setAddressField("secondLine", value)}
          />
          <DetailsText
            label={label?.postCode ? label.postCode : undefined}
            value={value?.postCode ? value.postCode : ""}
            onSubmit={(value) => value && setAddressField("postCode", value)}
          />
          <DetailsText
            label={label?.city ? label.city : undefined}
            value={value?.city ? value.city : ""}
            onSubmit={(value) => value && setAddressField("city", value)}
          />
          <DetailsEnum
            label={label?.province ? label.province : undefined}
            value={value?.province ? value.province : ""}
            onSubmit={(value) => value && setAddressField("province", value)}
            enum_data={provinces}
          />
          {/* <ActionIcon
            radius="xl"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => setActive(false)}
            disabled={disabled}
            tabIndex={-1}
          >
            <X size={18} />
          </ActionIcon> */}
        </Stack>
      ) : (
        <div style={{ position: "relative" }}>
          <Text
            sx={[
              (theme) => ({
                width: "100%",

                fontSize: theme.fontSizes.sm,
                minHeight: 36,
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                padding: "10px 16px",
                paddingRight: 32,
                lineHeight: 1.55,
                paddingLeft: 36,
              }),
              SxBorder,
              SxRadius,
            ]}
          >
            <BuildingCommunity
              color="#adb5bd"
              size={18}
              style={{
                top: 13,
                left: 9,
                position: "absolute",
              }}
            />
            {toString()}
          </Text>
          <ActionIcon
            radius="xl"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => setActive(true)}
            disabled={disabled}
            tabIndex={-1}
          >
            <Edit size={18} />
          </ActionIcon>
        </div>
      )}
    </InputWrapper>
  )
}

export default DetailsAddress
