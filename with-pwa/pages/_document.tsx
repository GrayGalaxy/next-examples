import type { DocumentContext } from 'next/document'
import Document, { Head, Html, Main, NextScript } from 'next/document'

const MyDocument = () => {
	return (
		<Html lang='en'>
			<Head>
				<link rel='manifest' href='/manifest.json' />
				<meta name='theme-color' content='#fff' />
				<link rel='icon' href='/favicon/favicon.ico' type='image/png' />
				<link rel='apple-touch-icon' href='/favicon/apple-icon.png' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}

export const getInitialProps = async (ctx: DocumentContext) => {
	const initial = await Document.getInitialProps(ctx)
	return { ...initial }
}

export default MyDocument
