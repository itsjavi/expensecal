export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
        <p>
          &copy; {year} ExpenseCal. All rights reserved. Created by{' '}
          <a href="https://itsjavi.com" target="_blank" rel="noopener noreferrer">
            Javier Aguilar
          </a>
        </p>
      </div>
    </footer>
  )
}
