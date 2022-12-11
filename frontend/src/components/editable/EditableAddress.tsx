import { ActionIcon, Group, Input, Stack, Text, Textarea } from "@mantine/core"
import {
  useClickOutside,
  useClipboard,
  useHover,
  useMergedRef,
} from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import { AddressType } from "../../types/AddressType"
import { BuildingCommunity, Copy, Edit, X } from "tabler-icons-react"
import DisplayCell from "../details/DisplayCell"
import EditableEnum from "./EditableEnum"
import EditableText from "./EditableText"
import { isEqual } from "lodash"
import EditableInput from "../../types/EditableInput"

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

const EditableAddress = ({
  label,
  value,
  initialValue,

  onSubmit,
  disabled,
  required,
  maxLength,
}: EditableAddressProps) => {
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
  const { hovered, ref: refHover } = useHover()
  const mergedRef = useMergedRef(refHover, ref)

  const setAddressField = (key: string, val: string) => {
    const new_address = { ...address, [key]: val }
    if (!isEqual(prevAddress, new_address)) {
      onSubmit && onSubmit(new_address)
      setAddress(new_address)
      setPrevAddress({ ...new_address })
    }
  }

  useEffect(() => {
    if (active) {
      setPrevAddress({ ...address })
    }
    // eslint-disable-next-line
  }, [active])

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
      ref={mergedRef}
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
            <ArrowBackUp size={18} />
          </ActionIcon> */}
        </Stack>
      ) : (
        <div style={{ position: "relative" }}>
          <DisplayCell
            icon={<BuildingCommunity />}
            disabled={disabled}
            hovered={hovered}
          >
            {" "}
            {toString()}
          </DisplayCell>
          {hovered && (
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
          )}
        </div>
      )}
    </Input.Wrapper>
  )
}

export default EditableAddress
