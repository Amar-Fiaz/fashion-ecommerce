// Minimal base layout shell for Phase 1.
// The header and footer are intentionally empty placeholders here -
// Phase 3 (Header, Navigation & Global UI) builds the real global
// chrome into these slots without needing to restructure this file.
function BaseLayout({ children }) {
  return (
    <div>
      <header>{/* Global header/navigation - built in Phase 3 */}</header>
      <main>{children}</main>
      <footer>{/* Global footer - built in Phase 3 */}</footer>
    </div>
  );
}

export default BaseLayout;