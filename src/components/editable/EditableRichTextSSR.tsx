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

import InputLabel from "@/components/input/InputLabel";
import type EditableInput from "@/types/EditableInput";
import * as RadixToolbar from "@radix-ui/react-toolbar";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  HighlighterIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
} from "lucide-react";
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
    icon: <RemoveFormattingIcon strokeWidth={1.5} size={18} />,
    operation: { name: "unsetAllMarks" },
  },
  [
    {
      label: "boldControlLabel",
      icon: <BoldIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "bold" },
      operation: { name: "toggleBold" },
    },
    {
      label: "italicControlLabel",
      icon: <ItalicIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "italic" },
      operation: { name: "toggleItalic" },
    },
    {
      label: "underlineControlLabel",
      icon: <UnderlineIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "underline" },
      operation: { name: "toggleUnderline" },
    },
    {
      label: "strikeControlLabel",
      icon: <StrikethroughIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "strike" },
      operation: { name: "toggleStrike" },
    },
    {
      label: "subscriptControlLabel",
      icon: <SubscriptIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "subscript" },
      operation: { name: "toggleSubscript" },
    },
    {
      label: "superscriptControlLabel",
      icon: <SuperscriptIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "superscript" },
      operation: { name: "toggleSuperscript" },
    },
    {
      label: "highlightControlLabel",
      icon: <HighlighterIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "highlight" },
      operation: { name: "toggleHighlight" },
    },
  ],
  [
    {
      label: "alignLeftControlLabel",
      icon: <AlignLeftIcon strokeWidth={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "left" },
    },
    {
      label: "alignCenterControlLabel",
      icon: <AlignCenterIcon strokeWidth={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "center" },
    },
    {
      label: "alignRightControlLabel",
      icon: <AlignRightIcon strokeWidth={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "right" },
    },
    {
      label: "alignJustifyControlLabel",
      icon: <AlignJustifyIcon strokeWidth={1.5} size={18} />,
      operation: { name: "setTextAlign", attributes: "justify" },
    },
  ],
  // {
  //   label: "unlinkControlLabel",
  //   icon: <UnlinkIcon strokeWidth={1.5} size={18} />,
  //   operation: { name: "unsetLink" },
  // },
  [
    {
      label: "bulletListControlLabel",
      icon: <ListIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "bulletList" },
      operation: { name: "toggleBulletList" },
    },
    {
      label: "orderedListControlLabel",
      icon: <ListOrderedIcon strokeWidth={1.5} size={18} />,
      isActive: { name: "orderedList" },
      operation: { name: "toggleOrderedList" },
    },
  ],
  [
    {
      label: "h1ControlLabel",
      icon: <Heading1Icon strokeWidth={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 1 } },
      operation: { name: "toggleHeading", attributes: { level: 1 } },
    },
    {
      label: "h2ControlLabel",
      icon: <Heading2Icon strokeWidth={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 2 } },
      operation: { name: "toggleHeading", attributes: { level: 2 } },
    },
    {
      label: "h3ControlLabel",
      icon: <Heading3Icon strokeWidth={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 3 } },
      operation: { name: "toggleHeading", attributes: { level: 3 } },
    },
    {
      label: "h4ControlLabel",
      icon: <Heading4Icon strokeWidth={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 4 } },
      operation: { name: "toggleHeading", attributes: { level: 4 } },
    },
    {
      label: "h5ControlLabel",
      icon: <Heading5Icon strokeWidth={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 5 } },
      operation: { name: "toggleHeading", attributes: { level: 5 } },
    },
    {
      label: "h6ControlLabel",
      icon: <Heading6Icon strokeWidth={1.5} size={18} />,
      isActive: { name: "heading", attributes: { level: 6 } },
      operation: { name: "toggleHeading", attributes: { level: 6 } },
    },
  ],
  // {
  //   label: "blockquoteControlLabel",
  //   icon: <BlockquoteIcon strokeWidth={1.5} size={18} />,
  //   isActive: { name: "blockquote" },
  //   operation: { name: "toggleBlockquote" },
  // },
  // {
  //   label: "codeControlLabel",
  //   icon: <CodeIcon strokeWidth={1.5} size={18} />,
  //   isActive: { name: "code" },
  //   operation: { name: "toggleCode" },
  // },
  // {
  //   label: "codeBlockControlLabel",
  //   icon: <CodeIcon strokeWidth={1.5} size={18} />,
  //   isActive: { name: "codeBlock" },
  //   operation: { name: "toggleCodeBlock" },
  // },

  // {
  //   label: "hrControlLabel",
  //   icon: <LineDashedIcon strokeWidth={1.5} size={18} />,
  //   operation: { name: "setHorizontalRule" },
  // },
  // {
  //   label: "unsetColorControlLabel",
  //   icon: <CircleOffIcon strokeWidth={1.5} size={18} />,
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
