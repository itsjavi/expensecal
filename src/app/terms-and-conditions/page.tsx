import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle as="h1" className="text-3xl font-bold">
            Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the ExpenseCal service, you agree to be bound by these Terms and Conditions.</p>

          <h2>2. Description of Service</h2>
          <p>ExpenseCal is an online platform that allows users to track and manage their expenses.</p>

          <h2>3. User Accounts</h2>
          <p>
            You must create an account to use our service. You are responsible for maintaining the confidentiality of
            your account information and for all activities that occur under your account.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>
            You agree to use the service only for lawful purposes and in accordance with these Terms. You are
            responsible for all content you input into the service.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by ExpenseCal and are protected
            by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary
            rights laws.
          </p>

          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior notice or
            liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall ExpenseCal, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the service.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
            provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Berlin/Germany, without regard to
            its conflict of law provisions.
          </p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
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
