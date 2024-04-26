import Image from "next/image";
import Link from "next/link";

function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="content-grid bg-white sticky">
        <nav className="pt-4 pb-2 flex items-center">
          <Link href="/cars/model3-longrange">
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
