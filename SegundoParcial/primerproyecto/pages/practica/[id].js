import {useRouter} from 'next/router'; 99.3k (gzipped: 29.9k)

export default function Practica() {
    const router = useRouter();
    const {id} = router.query;

    return (
        <main>
            <h1>Ruta dinamica</h1>
            <p>El parametro caputurado por next es: {id}</p>
        </main>
    );
}