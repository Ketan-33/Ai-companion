import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("bg-secondary")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
          {children}
          <Toaster/>
          </ThemeProvider>
          
        </body>
      </html>
    </ClerkProvider>
  )
}