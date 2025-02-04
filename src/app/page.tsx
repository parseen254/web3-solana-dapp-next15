import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnectButton } from "@/components/wallet-connect-button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-semibold">Web3 + Solana Next App</h1>
        <p className="text-lg text-center sm:text-left">
          A web3-first Next.js app for Solana
        </p>
        <div className="flex w-full items-center justify-between">
          <ThemeToggle />
          <WalletConnectButton />
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="mx-auto"
          src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>%F0%9F%9A%80</text></svg>"
          alt="Rocket logo"
          width={200}
          height={200}
          itemType="image/svg+xml"
        />
        <p className="text-lg font-semibold">Technology Stack</p>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            📦 Core Framework:{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              Next.js 15.1.6
            </code>
          </li>
          <li className="mb-2">
            ⚛️ Runtime:{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              React 19.0.0
            </code>
          </li>
          <li className="mb-2">
            🎨 UI & Theming:
            <ul className="list-disc ml-10 mt-1">
              <li>📦 Radix UI Primitives 2.1.5</li>
              <li>✨ Lucide Icons 0.474</li>
              <li>🌓 Next Themes 0.4.4</li>
            </ul>
          </li>
          <li className="mb-2">
            🛠️ Dev Tools:
            <ul className="list-disc ml-10 mt-1">
              <li>🛠️ TypeScript 5.7.3</li>
              <li>🎨 Tailwind CSS 3.4.17</li>
              <li>✅ ESLint 9.19 (+ Next.js config)</li>
            </ul>
          </li>
        </ol>
      </main>
    </div>
  );
}
