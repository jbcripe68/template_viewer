import { Thumbnail } from "./Thumbnail";

export function Thumbnails({
  data,
  selected,
  prevActive,
  nextActive,
  onThumbClick,
  onNextClick,
  onPreviousClick,
}) {
  return (
    <div className="thumbnails">
      <div className="group">
        {data.length === 0 ? (
          <div className="thumbnailHeight" />
        ) : (
          data.map((template, index) => {
            return (
              <Thumbnail
                key={template.id}
                index={index}
                selected={selected}
                onThumbClick={onThumbClick}
                template={template}
              />
            );
          })
        )}
        <span
          className={`previous ${prevActive ? "" : "disabled"}`}
          title="Previous"
          onClick={onPreviousClick}
        >
          Previous
        </span>
        <span
          className={`next ${nextActive ? "" : "disabled"}`}
          title="Next"
          onClick={onNextClick}
        >
          Next
        </span>
      </div>
    </div>
  );
}
