import { useLoaded } from "@/hooks/useLoaded";
import * as RadixDialog from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";
import { omit } from "lodash";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import ActionButton from "./ActionButton";

// RadixDialog.DialogProps {
//   children?: React.ReactNode;
//   open?: boolean;
//   defaultOpen?: boolean;
//   onOpenChange?(open: boolean): void;
//   modal?: boolean;
// }

interface ModalProps extends RadixDialog.DialogProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  trigger?: ReactNode;
  contentProps?: RadixDialog.DialogContentProps;
  onClose?: () => void;
  disableClose?: boolean;
}

function Modal(props: ModalProps) {
  const {
    title,
    children,
    description,
    trigger,
    defaultOpen,
    modal,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    onOpenChange,
    open,
    onClose,
    disableClose = false,
    contentProps,
  } = props;
  const isLoaded = useLoaded();

  return (
    <RadixDialog.Root
      defaultOpen={defaultOpen}
      modal={modal}
      onOpenChange={(open) => {
        !open && onClose?.();
        onOpenChange?.(open);
      }}
      open={isLoaded && open} // In order to mitigate hydration errors in radix-ui v1.0.3, we are preventing render on server.
    >
      {!!trigger && (
        <RadixDialog.Trigger asChild>{trigger}Radix</RadixDialog.Trigger>
      )}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed left-0 top-0 z-[9998] h-screen w-screen bg-black  bg-opacity-40" />
        <RadixDialog.Content
          className={twMerge(
            "fixed left-1/2 top-11  z-[9999] w-[48.75rem] -translate-x-1/2  rounded-xl bg-white p-3  shadow dark:bg-stone-800",
            contentProps?.className
          )}
          {...omit(contentProps, ["className"])}
        >
          {!!title && <RadixDialog.Title>{title}</RadixDialog.Title>}
          {!!description && (
            <RadixDialog.Description>{description}</RadixDialog.Description>
          )}
          {children}
          {!disableClose && (
            <RadixDialog.Close
              asChild
              className="absolute right-3 top-3 rounded-full p-1"
            >
              <ActionButton aria-label="Close">
                <IconX />
              </ActionButton>
            </RadixDialog.Close>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export default Modal;

// function Dialog({ title, children, ...props }: DialogProps) {
//   const ref = useRef(null);
//   const { dialogProps, titleProps } = useDialog(props, ref);

//   return (
//     <div {...dialogProps} ref={ref} className="p-8">
//       {title && (
//         <h3 {...titleProps} className="mt-0">
//           {title}
//         </h3>
//       )}
//       {children}
//     </div>
//   );
// }

// interface ModalProps {
//   open: boolean;
//   onClose: () => void;
//   title?: ReactNode;
//   children?: ReactNode;
// }

// function Modal({ open, onClose, title, children }: ModalProps) {
//   return (
//     <Portal>
//       {/* <Transition
//         show={open}
//         enter="transition duration-100 ease-out"
//         enterFrom="transform scale-95 opacity-0"
//         enterTo="transform scale-100 opacity-100"
//         leave="transition duration-75 ease-out"
//         leaveFrom="transform scale-100 opacity-100"
//         leaveTo="transform scale-95 opacity-0"
//         as={Fragment}
//       > */}
//         <Dialog
//           open={open}
//           onClose={onClose}
//           className="absolute left-0 top-0 h-screen w-screen"
//         >
//           <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

//           <Dialog.Panel className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform  rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-stone-800">
//             <div className="mb-2 flex items-center justify-between ">
//               {title}
//               <ActionButton
//                 onClick={() => onClose()}
//                 className=" h-8 w-8 rounded-md border-none border-transparent p-1 text-stone-800 dark:text-stone-200"
//               >
//                 <IconX />
//                 <span className="sr-only">Close</span>
//               </ActionButton>
//             </div>

//             {children}
//           </Dialog.Panel>
//         </Dialog>
//       {/* </Transition> */}
//     </Portal>
//   );
// }
