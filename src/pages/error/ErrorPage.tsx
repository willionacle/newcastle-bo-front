import { Layout, Result, ResultProps } from "antd";
import { ResultStatusType } from "antd/es/result";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { layoutStyle } from "./ErrorPageStyle";

const ErrorPage = () => {
  const error = useRouteError();
  const props: ResultProps = {};

  console.log(error);

  if (isRouteErrorResponse(error)) {
    props.status = `${error.status}` as ResultStatusType;
    props.title = `${error.status}`;
    props.subTitle = `${error.statusText}`;
  } else {
    props.status = "warning";
    (props.title = "Warning"), (props.subTitle = "Sorry, Something Wrong");
  }

  return (
    <Layout style={layoutStyle}>
      <Result {...props} />
    </Layout>
  );
};

export default ErrorPage;
