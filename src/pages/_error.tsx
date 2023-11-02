import { toHTTPErrorName } from "@/utils/HTTPError";
import Link from "next/link";

function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div className="mt-20 w-full text-center text-xl">
      {statusCode
        ? `${statusCode} | ${toHTTPErrorName(statusCode)}`
        : "An error occurred on client"}
      <br />
      <Link href="/" className="bold text-lg">
        Go back
      </Link>
    </div>
  );
}

ErrorPage.getInitialProps = ({
  res,
  err,
}: {
  res: { statusCode?: string };
  err: { statusCode?: string };
}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
