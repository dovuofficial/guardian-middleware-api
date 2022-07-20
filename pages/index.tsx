import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Guardian Middleware API</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Image
					src="/decentralized-on-HH_black.jpg"
					alt="Vercel Logo"
					className={styles.supportIcon}
					width={400}
					height={128}
				/>

				<h1 className={styles.title}>Guardian Middleware API</h1>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{' '}
					<Image
						src="/vercel.svg"
						alt="Vercel Logo"
						className={styles.logo}
						width={50}
						height={50}
					/>
				</a>
			</footer>
		</div>
	)
}

export default Home
