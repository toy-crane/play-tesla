import Link from "next/link";
import Image from "next/image";

function Layout(props: { children: React.ReactNode }) {
  return (
    <div>
      <header className="content-grid bg-white sticky">
        <nav className="pt-4 pb-2 flex items-center justify-between">
          <Link href="/">
            <Image
              alt="logo"
              height="36"
              src="/logo/horizontal_logo.svg"
              width="144"
            />
          </Link>
        </nav>
      </header>
      <div className="content-grid">{props.children}</div>
    </div>
  );
}

export default Layout;
