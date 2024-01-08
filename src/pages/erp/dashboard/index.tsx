import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import useTranslation from "@/hooks/useTranslation";
import CalendarView from "../../../page-components/erp/dashboard/calendar";

function DashboardPage() {
  const t = useTranslation();
  return (
    <div className="flex gap-4 p-3">
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>{t.calendar}</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
