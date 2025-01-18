import Navbar from '@/components/navbar'
import { ClerkProvider} from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
      <Navbar />
      <main className='md:pl-20 pt-16 h-full'>
      {children}
      </main>
    </div>
  )
}