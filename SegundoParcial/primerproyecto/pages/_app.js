import Menu from '../componentes/Menu'
import '../estilos/styles.css';

export default function App({ Component, pageProps }) {
    return (
        <>
        <Menu />
        <Component {...pageProps} />
        </>
    );
}    