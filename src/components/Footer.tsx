export default function Footer() {
  return (
    <footer className="text-center py-10 px-6 text-[var(--color-text-muted)] text-sm border-t border-[var(--color-border)] mt-16">
      <p className="font-medium text-[var(--color-text-secondary)]">O2 CyberSecurity Outpost</p>
      <p className="mt-1">Texas A&M University</p>
      <p className="mt-2 text-xs">
        Based on the survey{' '}
        <em>"Large Language Models in Software Security: A Survey of Vulnerability Detection Techniques and Insights"</em>
      </p>
      <p className="mt-3 text-xs">
        Contact:{' '}
        <a href="mailto:zesheng@tamu.edu" className="text-[var(--color-accent)] hover:underline no-underline">
          zesheng@tamu.edu
        </a>
      </p>
    </footer>
  )
}
