// app/layout.js
import './globals.css'

export const metadata = {
  title: 'Dashboard with Google Sheets Integration',
  description: 'A dashboard that integrates with Google Sheets',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}