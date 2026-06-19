"use client";

export function Badge({ children, kind }: { children: React.ReactNode; kind: string }) {
  return <span className={`badge ${kind.toLowerCase().replaceAll(" ", "-")}`}>{children}</span>;
}

export function Modal({ title, children, onClose, wide = false }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className={`modal ${wide ? "modal-wide" : ""}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">x</button>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

export function Toast({ text }: { text: string }) {
  return text ? <div className="toast">{text}</div> : null;
}
