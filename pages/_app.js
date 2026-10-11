// pages/_app.js
import '../styles/globals.css';
import '@reall3d/reall3dviewer/dist/style.css';
import '../public/assets/css/carInfo.css';
import '../public/assets/css/BodyButton.css';
import '../public/assets/css/footer.css';

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
