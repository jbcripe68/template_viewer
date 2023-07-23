export function Large({ template }) {
  // strip non-dollar amount from cost if it's 0
  const constSplit = template.cost.split(".");
  const dollars = constSplit[0];
  const cents = constSplit[1];
  const costString = `${dollars}${cents === "00" ? "" : "." + cents}`;
  return (
    <div className="large">
      <div className="group">
        <img
          src={`images/large/${template.image}`}
          alt="Large Image"
          width="430"
          height="360"
        />
        <div className="details">
          <p>
            <strong>Title</strong> {template.title}
          </p>
          <p>
            <strong>Description</strong> {template.description}
          </p>
          <p>
            <strong>Cost</strong> ${costString}
          </p>
          <p>
            <strong>ID #</strong> {template.id}
          </p>
          <p>
            <strong>Thumbnail File</strong> {template.thumbnail}
          </p>
          <p>
            <strong>Large Image File</strong> {template.image}
          </p>
        </div>
      </div>
    </div>
  );
}
