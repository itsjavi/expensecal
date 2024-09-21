import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>
              &copy; {year} ExpenseCal by{' '}
              <a
                href="https://itsjavi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Javier Aguilar
              </a>
              . <span className="block md:inline">All rights reserved.</span>
            </p>
          </div>
          <nav className="flex space-x-4 text-sm">
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary">
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
