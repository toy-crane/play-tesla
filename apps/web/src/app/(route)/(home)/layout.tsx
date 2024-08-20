import Link from "next/link";
import Image from "next/image";

function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="content-grid bg-white sticky top-0">
        <nav className="pt-4 pb-2 flex items-center justify-between">
          <Link href="/cars/model3-longrange">
            <Image
              alt="play-tesla-logo"
              title="테슬라 정보를 한 곳에서"
              height="36"
              src="/logo/horizontal_logo.svg"
              width="144"
            />
          </Link>
        </nav>
      </header>
      <main className="content-grid flex-1">{props.children}</main>
      <footer className="py-6 md:px-8 md:py-0 content-grid">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://www.toycrane.xyz"
              rel="noreferrer"
              target="_blank"
            >
              toy-crane
            </a>
            . The source code is available on{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://github.com/toy-crane/play-tesla"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
