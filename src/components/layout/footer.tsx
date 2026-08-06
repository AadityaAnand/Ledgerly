export function Footer() {
  return (
    <footer className="border-border-subtle mt-auto border-t px-8 py-5">
      <div className="container-page text-foreground-tertiary flex items-center justify-between text-xs">
        <p>© {new Date().getFullYear()} Ledgerly. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {/* These pages don't exist yet, so they're intentionally non-interactive rather than dead links. */}
          <span>Privacy</span>
          <span>Terms</span>
          <span>Status</span>
        </div>
      </div>
    </footer>
  )
}
