/** Re-mounts on every navigation, giving pages a calm entrance (CSS-only). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
