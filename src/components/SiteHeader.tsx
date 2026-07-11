type SiteHeaderProps = {
  navItems: {
    label: string
    href: string
  }[]
}

export function SiteHeader({ navItems }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#home" aria-label="AU-STELLAR LIFE Academy home">
        {/* TODO: Replace this text mark with the final AU-STELLAR LIFE logo asset. */}
        <span>AU-STELLAR</span>
        <small>LIFE Academy</small>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
