import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle as="h1" className="text-3xl font-bold">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to ExpenseCal. This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our expense tracking service.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, input expense data,
            or contact us for support. This may include:
          </p>
          <ul>
            <li>Personal information (e.g., name, email address)</li>
            <li>Financial information (e.g., expense amounts, categories)</li>
            <li>Usage data (e.g., how you interact with our service)</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns to improve user experience</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal
            information. However, please note that no method of transmission over the Internet or electronic storage is
            100% secure.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            We may use third-party services, such as hosting providers or analytics tools, which may have access to your
            information. These services have their own privacy policies addressing how they use such information.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You may also have the right to
            restrict or object to certain processing of your data.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            Javi Aguilar
            <br />
            Website:{' '}
            <a href="https://itsjavi.com" target="_blank" rel="noopener noreferrer">
              itsjavi.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
