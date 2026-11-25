import Link from 'next/link'; 38k (gzipped: 11.5k)

export default function Home() {
    const router = useRouter();
    const { id } = router.query;
    return (
        <main>
            <h1>Esto es un ejemplo de Pagina Principal con Next</h1>
            <p>
                <Link href="/">Ir a la Practica 1</Link>
            </p>
        </main>
    );
}