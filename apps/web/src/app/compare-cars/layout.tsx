function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="bg-primary-foreground min-h-screen">{props.children}</div>
  );
}

export default Layout;
