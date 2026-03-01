import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-xl font-bold neon-text mb-3">SPIKE AI</div>
            <p className="text-sm text-text-secondary">
              Enterprise AI platform powered by Google Vertex AI and Gemini.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Documentation', 'API Reference'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} SPIKE AI. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Powered by{' '}
            <span className="text-neon-blue">Google Vertex AI</span> &{' '}
            <span className="text-neon-purple">Gemini</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
