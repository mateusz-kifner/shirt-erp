import {
  useClipboard,
  useDebouncedValue,
  useElementSize,
  useMediaQuery,
} from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useId, useRef, useState } from "react"
import dayjs from "dayjs"
import EditableInput from "../../types/EditableInput"
import { handleBlurForInnerElements } from "../../utils/handleBlurForInnerElements"
import { useTranslation } from "../../i18n"
import i18next from "i18next"
import { handleFocusForInnerElements } from "../../utils/handleFocusForInnerElements"
import Calendar from "react-calendar"
import { IconCopy } from "@tabler/icons-react"
import { useMantineTheme } from "@mantine/core"
import preventLeave from "../../utils/preventLeave"

interface EditableDateProps extends EditableInput<string> {}

const EditableDate = (props: EditableDateProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    leftSection,
    rightSection,
  } = props
  const uuid = useId()

  const [date, setDate] = useState<Date | null>(
    value ? new Date(value) : initialValue ? new Date(initialValue) : null
  )
  const [focus, setFocus] = useState<boolean>(false)
  const clipboard = useClipboard()
  const dateRef = useRef<HTMLInputElement>(null)
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )
  const { t } = useTranslation()
  const dateFormat = i18next.language === "pl" ? "DD.MM.YYYY" : "YYYY-MM-DD"
  const [opened, setOpened] = useState<boolean>(false)

  const [text, setText] = useState(date?.toString())

  const { ref: leftSectionRef, width: leftSectionWidth } = useElementSize()
  const { ref: rightSectionRef, width: rightSectionWidth } = useElementSize()
  const textAreaRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave)
      // dateRef.current &&(dateRef.current.selectionStart = dateRef.current.value.length)
      // dateRef.current && dateRef.current.focus()
    } else {
      const valueAsDate = value
        ? new Date(value)
        : initialValue
        ? new Date(initialValue)
        : null
      const dateAsString = dayjs(date).format("YYYY-MM-DD")
      if (
        date !== null &&
        dateAsString !== dayjs(valueAsDate).format("YYYY-MM-DD")
      ) {
        onSubmit?.(dateAsString)
      } else if (date == null) {
        onSubmit?.(null)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [focus])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    const new_value = value ? dayjs(value).toDate() : null
    setDate(new_value)
  }, [value])

  return (
    <div
      className="relative flex-grow"
      // onFocus={handleFocusForInnerElements(() => setOpened(true))}
      // onBlur={handleBlurForInnerElements(() => setOpened(false))}
    >
      {opened && (
        <Calendar
          className={"absolute top-full mt-2 left-0 z-[120] rounded"}
          onChange={(date: Date) => setText(dayjs(date).format("L").toString())}
          value={date}
        />
      )}
      {label && (
        <label
          htmlFor={"inputDate_" + uuid}
          className="text-sm dark:text-gray-400"
        >
          {label}
          {date && (
            <button
              className="btn btn-square p-[2px] mr-1"
              onClick={() => {
                const dateString = dayjs(date).format("L").toString()
                clipboard.copy(dateString)
                showNotification({
                  title: t("copy to clipboard"),
                  message: dateString,
                })
              }}
              tabIndex={-1}
            >
              <IconCopy size={16} />
            </button>
          )}
        </label>
      )}
      <div
        className="absolute top-1/2 left-1 -translate-y-1/2"
        ref={leftSectionRef}
      >
        {!!leftSection && leftSection}
      </div>
      <input
        id={"inputDate_" + uuid}
        ref={textAreaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={"w-full resize-none overflow-hidden display-cell"}
        readOnly={disabled}
        required={required}
        onClick={() => setOpened(true)}
      />
      <div
        className="absolute top-1/2 right-1 -translate-y-1/2"
        ref={rightSectionRef}
      >
        {!!rightSection && rightSection}
      </div>
    </div>
  )
}

// const EditableDate = (props: EditableDateProps) => {
//   const {
//     label,
//     value,
//     initialValue,
//     onSubmit,
//     disabled,
//     required,
//     rightSection,
//     leftSection,
//   } = props

//   const [date, setDate] = useState<Date | null>(
//     value ? new Date(value) : initialValue ? new Date(initialValue) : null
//   )
//   const [focus, setFocus] = useState<boolean>(false)
//   const clipboard = useClipboard()
//   const dateRef = useRef<HTMLInputElement>(null)
//   const theme = useMantineTheme()
//   const isMobile = useMediaQuery(
//     "only screen and (hover: none) and (pointer: coarse)"
//   )
//   const { hovered, ref } = useHover()

// useEffect(() => {
//   if (focus) {
//     window.addEventListener("beforeunload", preventLeave)
//     // dateRef.current &&(dateRef.current.selectionStart = dateRef.current.value.length)
//     // dateRef.current && dateRef.current.focus()
//   } else {
//     const valueAsDate = value
//       ? new Date(value)
//       : initialValue
//       ? new Date(initialValue)
//       : null
//     const dateAsString = dayjs(date).format("YYYY-MM-DD")
//     if (
//       date !== null &&
//       dateAsString !== dayjs(valueAsDate).format("YYYY-MM-DD")
//     ) {
//       onSubmit?.(dateAsString)
//     } else if (date == null) {
//       onSubmit?.(null)
//     }
//     window.removeEventListener("beforeunload", preventLeave)
//   }
//   // eslint-disable-next-line
// }, [focus])

// useEffect(() => {
//   return () => {
//     window.removeEventListener("beforeunload", preventLeave)
//   }
// }, [])

// useEffect(() => {
//   const new_value = value ? dayjs(value).toDate() : null
//   setDate(new_value)
// }, [value])

//   return (
//     <Input.Wrapper
//       label={
//         label && label.length > 0 ? (
//           <>
//             {label}
//             {date && (
//               <ActionIcon
//                 size="xs"
//                 style={{
//                   display: "inline-block",
//                   transform: "translate(4px, 4px)",
//                   marginRight: 4,
//                 }}
//                 onClick={() => {
//                   const dateString = dayjs(date).format("L").toString()
//                   clipboard.copy(dateString)
//                   showNotification({
//                     title: "Skopiowano do schowka",
//                     message: dateString,
//                   })
//                 }}
//                 tabIndex={-1}
//               >
//                 <IconCopy size={16} />
//               </ActionIcon>
//             )}
//           </>
//         ) : undefined
//       }
//       labelElement="div"
//       required={required}
//       style={{ position: "relative" }}
//       ref={ref}
//       // onClick={() => setFocus(true)}
//       // onFocus={() => setFocus(true)}
//       // onBlur={handleBlurForInnerElements(() => setFocus(false))}
//     >
//       <DatePicker
//         ref={dateRef}
//         onChange={setDate}
//         value={date}
//         styles={(theme) => ({
//           input: {
//             padding: "1px 16px",
//             lineHeight: 1.55,
//             height: 44,
//             backgroundColor: focus
//               ? theme.colorScheme === "dark"
//                 ? theme.colors.dark[6]
//                 : theme.colors.gray[0]
//               : "transparent",
//             border:
//               focus || hovered
//                 ? theme.colorScheme === "dark"
//                   ? "1px solid #2C2E33"
//                   : "1px solid #ced4da"
//                 : "1px solid transparent",
//             "&:focus": {
//               borderColor: focus
//                 ? undefined
//                 : theme.colorScheme === "dark"
//                 ? theme.colors.dark[5]
//                 : theme.colors.gray[4],
//             },
//           },
//           defaultVariant: {
//             backgroundColor: "initial",
//           },
//         })}
//         dayStyle={(date, modifiers) => ({
//           backgroundColor:
//             dayjs(date).isToday() && !modifiers.selected
//               ? theme.colors[theme.primaryColor][6] + "33"
//               : undefined,
//         })}
//         // allowFreeInput={!isMobile} // this is not working with custom locale
//         onDropdownOpen={() => !disabled && setFocus(true)}
//         onDropdownClose={() => setFocus(false)}
//         dateParser={(value) => {
//           return dayjs(value, "L").toDate()
//         }}
//         dropdownType={isMobile ? "modal" : "popover"}
//         withinPortal={false}
//         readOnly={!focus}
//         icon={leftSection}
//         rightSection={rightSection}
//       />
//     </Input.Wrapper>
//   )
// }

export default EditableDate
