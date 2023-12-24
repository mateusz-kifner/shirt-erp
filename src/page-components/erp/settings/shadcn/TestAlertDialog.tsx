import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { buttonVariants } from "@/components/ui/Button";
import { IconAlertCircle } from "@tabler/icons-react";

function TestAlertDialog() {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className={buttonVariants({})}>
          Test Alert Dialog
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="flex  gap-2">
            <IconAlertCircle size={28} />

            <AlertDialogHeader>
              <AlertDialogTitle>AlertDialog</AlertDialogTitle>
              <AlertDialogDescription>
                AlertDialog description
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({
            variant: "destructive",
          })}
        >
          Test Alert Dialog
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="flex gap-2">
            <IconAlertCircle size={28} />
            <AlertDialogHeader>
              <AlertDialogTitle>AlertDialog</AlertDialogTitle>
              <AlertDialogDescription>
                AlertDialog description
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TestAlertDialog;
