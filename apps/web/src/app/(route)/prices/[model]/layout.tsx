import Image from "next/image";
import Link from "next/link";
import ShareButton from "./_components/share-button";

function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="content-grid bg-white sticky">
        <nav className="pt-4 pb-2 flex items-center justify-between">
          <Link href="/">
            <Image
              title="테슬라 정보를 한 곳에서"
              alt="logo"
              height="36"
              src="/logo/horizontal_logo.svg"
              width="144"
            />
          </Link>
          <div className="flex justify-end">
            <ShareButton />
          </div>
        </nav>
      </header>
      <div className="content-grid pb-36">{props.children}</div>
    </div>
  );
}

export default Layout;
