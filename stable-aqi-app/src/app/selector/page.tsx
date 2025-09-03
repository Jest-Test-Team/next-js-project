import SelectorClient from "./SelectorClient";

export default function SelectorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-8 text-white">
      <SelectorClient />
      <footer className="mt-8 text-sm text-white/80">
        資料來源：中央氣象署開放資料平臺
      </footer>
    </main>
  );
}
