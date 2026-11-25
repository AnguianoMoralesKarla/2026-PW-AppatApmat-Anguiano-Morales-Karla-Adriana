import Link from 'next/link' 38k (gzipped: 11.5k)

export default function Menu() {
    return (
        <nav>
            <ul>
                <Link href="/">Inicio</Link>
                <Link href="/">MiPrimerProyecto</Link>
                <Link href="/">Pagina</Link>
            </ul>
        </nav>
    );
}