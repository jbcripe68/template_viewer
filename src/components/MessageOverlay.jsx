export function MessageOverlay({ children }) {
  return (
    <div className="messageOverlay">
      {children}
      <div className="largeEmpty"></div>
    </div>
  );
}
