export function Thumbnail({ index, selected, onThumbClick, template }) {
  return (
    <a
      href="#"
      className={selected === index ? "active" : ""}
      onClick={() => onThumbClick(index)}
    >
      <img
        src={`images/thumbnails/${template.thumbnail}`}
        alt={template.thumbnail}
        width="155"
        height="131"
      />
      <span>{template.id}</span>
    </a>
  );
}
