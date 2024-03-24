import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import useTranslation from "@/hooks/useTranslation";
import CalendarView from "../../../page-components/erp/dashboard/calendar";
import { createRedirectByRole } from "@/utils/redirectByRole";

function DashboardPage() {
  const t = useTranslation();
  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-4 p-3">
      <Card className="flex flex-grow flex-col">
        <CardHeader>
          <CardTitle>{t.calendar}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col">
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  );
}

export const getServerSideProps = createRedirectByRole("employee");

export default DashboardPage;
