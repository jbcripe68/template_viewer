import { useState, useEffect } from "react";
import { MessageOverlay } from "./MessageOverlay";
import { Large } from "./Large";
import { Thumbnails } from "./Thumbnails";

export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetry, setIsRetry] = useState(false);
  const [errStr, setErrStr] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      setErrStr("");
      setData([]);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/template/get-page?objsPerPage=4&page=${page}`
        );
        if (!res.ok) {
          throw new Error("Something went wrong getting the data...");
        }
        const json = await res.json();
        if (json.status !== "success") {
          throw new Error(json.message);
        }

        // set state from new data
        setData(json.data);
        setTotalPages(json.numTotalPages);
        setSelected(0);
      } catch (error) {
        setErrStr(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    // to avoid fetching twice, reset the isRetry flag and return
    if (isRetry) {
      return setIsRetry(false);
    }
    fetchData();

    return () => controller.abort();
  }, [page, isRetry]);

  function handleThumbClick(index) {
    setSelected(index);
  }

  function handlePreviousClick() {
    setPage((page) => page - 1);
  }

  function handleNextClick() {
    setPage((page) => page + 1);
  }

  return (
    <div className="container">
      <header>Code Development Project</header>
      <main>
        {errStr !== "" && (
          <MessageOverlay>
            <p style={{ color: "red" }}>{errStr}</p>
            <button
              style={{
                fontWeight: "bold",
                padding: "5px",
                height: "30px",
                marginLeft: "10px",
              }}
              onClick={() => setIsRetry(true)}
            >
              Retry
            </button>
          </MessageOverlay>
        )}
        {errStr === "" && isLoading && (
          <MessageOverlay>
            <p>Loading...</p>
          </MessageOverlay>
        )}
        {errStr === "" && !isLoading && <Large template={data.at(selected)} />}
        <Thumbnails
          data={data}
          selected={selected}
          prevActive={page !== 0}
          nextActive={page < totalPages - 1}
          onThumbClick={handleThumbClick}
          onNextClick={handleNextClick}
          onPreviousClick={handlePreviousClick}
        />
      </main>
    </div>
  );
}
