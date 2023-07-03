import { toHTTPErrorName } from "@/utils/HTTPError";

function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div className="mt-20 w-full text-center text-xl">
      {statusCode
        ? `${statusCode} | ${toHTTPErrorName(statusCode)}`
        : "An error occurred on client"}
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
