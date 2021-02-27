import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider } from "@material-ui/styles";
import type { AppProps } from "next/app";
import { useEffect } from "react";

const MyApp = (props: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <props.Component {...props.pageProps} />
    </StylesProvider>
  );
};

export default MyApp;
