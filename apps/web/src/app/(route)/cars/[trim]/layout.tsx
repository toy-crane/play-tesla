function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="content-grid bg-white sticky">
        <nav className="py-4 flex items-center">Logo</nav>
      </header>
      <div className="content-grid">{props.children}</div>
    </div>
  );
}

export default Layout;
