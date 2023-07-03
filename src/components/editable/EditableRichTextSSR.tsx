import { ReactNode, useEffect, useId, useState } from "react";

import { useClickOutside } from "@mantine/hooks";
import { EditorContent, useEditor } from "@tiptap/react";
import DOMPurify from "dompurify";
import TurndownService from "turndown";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import preventLeave from "@/utils/preventLeave";

import type EditableInput from "@/types/EditableInput";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconClearFormatting,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconHighlight,
  IconItalic,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconUnderline,
} from "@tabler/icons-react";
import InputLabel from "../input/InputLabel";
import DisplayCellExpanding from "../ui/DisplayCellExpanding";

const controls: (
  | {
      label: string;
      icon: ReactNode;
      isActive?: { name: string; [key: string]: any };
      operation: { name: string; [key: string]: any };
    }
  | {
      label: string;
      icon: ReactNode;
      isActive?: { name: string; [key: string]: any };
      operation: { name: string; [key: string]: any };
    }[]
)[] = [
  {
    label: "clearFormattingControlLabel",
    icon: <IconClearFormatting stroke={1.5} size={18} />,
    operation: { name: "unsetAllMarks" },
  },
  [
    {
      label: "boldControlLabel",
      icon: <IconBold stroke={1.5} size={18} />,
      isActive: { name: "bold" },
      operation: { name: "toggleBold" },
    },
    {
      label: "italicControlLabel",
      icon: <IconItalic stroke={1.5} size={18} />,
      isActive: { name: "italic" },
      operation: { name: "toggleItalic" },
    },
    {
      label: "underlineControlLabel",
      icon: <IconUnderline stroke={1.5} size={18} />,
      isActive: { name: "underline" },
      operation: { name: "toggleUnderline" },
    },
    {
      label: "strikeControlLabel",
      icon: <IconStrikethrough stroke={1.5} size={18} />,
      isActive: { name: "strike" },
      operation: { name: "toggleStrike" },
    },
    {
      label: "subscriptControlLabel",
      icon: <IconSubscript stroke={1.5} size={18} />,
      isActive: { name: "subscript" },
      operation: { name: "toggleSubscript" },
    },
    {
      label: "superscriptControlLabel",
      icon: <IconSuperscript stroke={1.5} size={18} />,
      isActive: { name: "superscript" },
      operation: { name: "toggleSuperscript" },
    },
    {
      label: "highlightControlLabel",
      icon: <IconHighlight stroke={1.5} size={18} />,
      isActive: { name: "highlight" },
      operation: { name: "toggleHighlight" },
    },
  ],
  [
    {
      label: "alignLeftControlLabel",
      icon: <IconAlignLeft stroke={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "left" },
    },
    {
      label: "alignCenterControlLabel",
      icon: <IconAlignCenter stroke={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "center" },
    },
    {
      label: "alignRightControlLabel",
      icon: <IconAlignRight stroke={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "right" },
    },
    {
      label: "alignJustifyControlLabel",
      icon: <IconAlignJustified stroke={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "justify" },
    },
  ],
  // {
  //   label: "unlinkControlLabel",
  //   icon: <IconUnlink stroke={1.5} size={18} />,
  //   operation: { name: "unsetLink" },
  // },
  [
    {
      label: "bulletListControlLabel",
      icon: <IconList stroke={1.5} size={18} />,
      isActive: { name: "bulletList" },
      operation: { name: "toggleBulletList" },
    },
    {
      label: "orderedListControlLabel",
      icon: <IconListNumbers stroke={1.5} size={18} />,
      isActive: { name: "orderedList" },
      operation: { name: "toggleOrderedList" },
    },
  ],
  [
    {
      label: "h1ControlLabel",
      icon: <IconH1 stroke={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 1 } },
      operation: { name: "toggleHeading", attributes: { level: 1 } },
    },
    {
      label: "h2ControlLabel",
      icon: <IconH2 stroke={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 2 } },
      operation: { name: "toggleHeading", attributes: { level: 2 } },
    },
    {
      label: "h3ControlLabel",
      icon: <IconH3 stroke={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 3 } },
      operation: { name: "toggleHeading", attributes: { level: 3 } },
    },
    {
      label: "h4ControlLabel",
      icon: <IconH4 stroke={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 4 } },
      operation: { name: "toggleHeading", attributes: { level: 4 } },
    },
    {
      label: "h5ControlLabel",
      icon: <IconH5 stroke={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 5 } },
      operation: { name: "toggleHeading", attributes: { level: 5 } },
    },
    {
      label: "h6ControlLabel",
      icon: <IconH6 stroke={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 6 } },
      operation: { name: "toggleHeading", attributes: { level: 6 } },
    },
  ],
  // {
  //   label: "blockquoteControlLabel",
  //   icon: <IconBlockquote stroke={1.5} size={18} />,
  //   isActive: { name: "blockquote" },
  //   operation: { name: "toggleBlockquote" },
  // },
  // {
  //   label: "codeControlLabel",
  //   icon: <IconCode stroke={1.5} size={18} />,
  //   isActive: { name: "code" },
  //   operation: { name: "toggleCode" },
  // },
  // {
  //   label: "codeBlockControlLabel",
  //   icon: <IconCode stroke={1.5} size={18} />,
  //   isActive: { name: "codeBlock" },
  //   operation: { name: "toggleCodeBlock" },
  // },

  // {
  //   label: "hrControlLabel",
  //   icon: <IconLineDashed stroke={1.5} size={18} />,
  //   operation: { name: "setHorizontalRule" },
  // },
  // {
  //   label: "unsetColorControlLabel",
  //   icon: <IconCircleOff stroke={1.5} size={18} />,
  //   operation: { name: "unsetColor" },
  // },
];

const turndownService = new TurndownService();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EditableRichTextProps extends EditableInput<string> {}

const EditableRichText = ({
  label,
  value,
  initialValue,
  onSubmit,
  disabled,
  required,
  leftSection,
  rightSection,
}: EditableRichTextProps) => {
  const uuid = useId();
  const [text, setText] = useState<string>(
    value
      ? DOMPurify.sanitize(value)
      : initialValue
      ? DOMPurify.sanitize(initialValue)
      : ""
  );

  const [focus, setFocus] = useState<boolean>(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-2 focus:outline-none editor",
      },
    },
    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getHTML());
    },
  });
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() =>
    setFocus(false)
  );

  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave);
    } else {
      //prevent excessive updates
      if (text != value && text != "") {
        onSubmit?.(text);
      }
      window.removeEventListener("beforeunload", preventLeave);
    }
    // eslint-disable-next-line
  }, [focus]);

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave);
    };
  }, []);

  useEffect(() => {
    if (value) {
      const cleanValue = DOMPurify.sanitize(value);
      setText(cleanValue);
    }
  }, [value]);

  const plainText = unescape(
    turndownService.turndown(
      text
        .replace(/h[0-9]>/g, "div>")
        .replace(/<\/*(s|em|strong|a|b|i|mark|del|small|ins|sub|sup)>/g, "")
    )
  );

  return (
    <div
      ref={clickOutsideRef}
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      // onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      <InputLabel
        label={label}
        copyValue={plainText.length > 0 ? plainText : ""}
        required={required}
      />
      <DisplayCellExpanding
        leftSection={!focus && leftSection}
        rightSection={!focus && rightSection}
        className="py-2.5"
      >
        {focus ? (
          <div className="flex flex-grow flex-col">
            <RadixToolbar.Root
              className="-mx-2 flex flex-wrap gap-2 border-b border-solid border-b-stone-400 p-2 dark:border-stone-600 "
              aria-label="Formatting options"
            >
              {controls.map((value, index) => {
                if (Array.isArray(value)) {
                  return (
                    <div
                      className="action-button-group"
                      key={`${uuid}${index}:group`}
                    >
                      {value.map((value, index2) => (
                        <RadixToolbar.Button
                          key={`${uuid}${index}:${index2}:group`}
                          className={`action-button  ${
                            //@ts-ignore
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                            (
                              value.isActive?.name
                                ? editor?.isActive(
                                    value.isActive.name,
                                    value.isActive.attributes
                                  )
                                : false
                            )
                              ? "bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20"
                              : ""
                          }`}
                          onClick={() =>
                            //@ts-ignore
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                            editor
                              ?.chain()
                              .focus()
                              [value.operation.name](value.operation.attributes)
                              .run()
                          }
                          title={value.label}
                        >
                          {value.icon}
                        </RadixToolbar.Button>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <RadixToolbar.Button
                      key={`${uuid}${index}:item`}
                      className={`action-button border border-solid border-stone-400 dark:border-stone-600 ${
                        //@ts-ignore
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                        (
                          value.isActive?.name
                            ? editor?.isActive(
                                value.isActive.name,
                                value.isActive.attributes
                              )
                            : false
                        )
                          ? "bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20"
                          : ""
                      }`}
                      onClick={() =>
                        //@ts-ignore
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                        editor
                          ?.chain()
                          .focus()
                          [value.operation.name](value.operation.attributes)
                          .run()
                      }
                      title={value.label}
                    >
                      {value.icon}
                    </RadixToolbar.Button>
                  );
                }
              })}
            </RadixToolbar.Root>

            <EditorContent editor={editor} />
          </div>
        ) : (
          <div
            className={`plain-html editor w-full ${
              text.length === 0 ||
              text === "<p></p>" ||
              text === "<p></p><p></p>"
                ? "text-gray-400 dark:text-stone-600"
                : ""
            }`}
            dangerouslySetInnerHTML={{
              __html:
                text.length === 0 ||
                text === "<p></p>" ||
                text === "<p></p><p></p>"
                  ? "⸺"
                  : text,
            }}
          ></div>
        )}
      </DisplayCellExpanding>
    </div>
  );
};

export default EditableRichText;
