export default function Modal({
  id,
  title,
  children,
  isOpen,
  onClose,
  classname,
}) {
  return (
    <div id={id} className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className={`modal-box ${classname}`}>
        <h3 className="text-2xl font-bold text-center mb-4">{title}</h3>
        {children}
        <div className="modal-backdrop " onClick={onClose} />
      </div>
    </div>
  );
}
