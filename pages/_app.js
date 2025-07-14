// pages/_app.js
import '../styles/globals.css';
import '@reall3d/reall3dviewer/dist/style.css';
import '@STYLES/carInfo.css';

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
