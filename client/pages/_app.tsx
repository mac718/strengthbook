import { AppProps } from 'next/app';
import '@fortawesome/fontawesome-free/css/all.css';
import * as d3 from 'd3';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
