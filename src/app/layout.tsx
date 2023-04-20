 import './styles/globals.css'

export const metadata = {
  title: 'TicTacDead',
  description: 'A game by Otto, Franz and Lucas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
