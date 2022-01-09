import axios from "axios";
import React, { useState } from "react";
import { SERVER_ENDPOINTS } from "../config";
import Loader from "../assets/loader.svg";
import Copy from "../assets/copy.svg";
import Tick from "../assets/tick.svg";

function URLShortenerForm() {
  const [destination, setDestination] = useState();
  const [shortUrl, setShortUrl] = useState<{
    shortId: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!disable) {
      setLoading(true);

      setShortUrl(null);

      console.log("SERVER_ENDPOINTS: " + JSON.stringify(SERVER_ENDPOINTS));

      const result = await axios
        .post(`${SERVER_ENDPOINTS}/api/url`, {
          destination,
        })
        .then((resp) => resp.data)
        .catch((e) => {
          console.log("Error:" + JSON.stringify(e));
        });

      setShortUrl(result);
      setLoading(false);
    }
  }

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [disable, setDisable] = useState("disabled");

  const handleKeyDown = (event: any) => {
    validURL(event.target.value);
    setInput(event.target.value);
    setDestination(event.target.value);
  };

  const validURL = (url: string) => {
    //eslint-disable-next-line
    const pattern = new RegExp(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm
    );
    let isValidURL = !!pattern.test(url);
    if (isValidURL !== true) {
      setDisable("disabled");
    } else {
      setDisable("");
    }
  };

  return (
    <div>
      <div>
        {copied ? (
          <div className="px-5 py-3 flex bg-pink items-center text-green-600 absolute w-full top-0 left-0 right-0 z-10">
            <img src={Tick} className="h-5 w-5 mr-2" alt="tick icon" />
            Awesome! Your link has been copied.
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="min-h-screen flex items-center justify-center bg-background-img bg-fixed bg-center bg-cover bg-no-repeat py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8">
          <div>
            <h3 className="text-left text-3xl font-extrabold text-white">
              Short URL Generator
            </h3>
            <p className="text-white">Most link shorteners do too much.</p>
            <p className="text-white">
              This one only makes your links shorter.
            </p>
          </div>
          <form action="#" method="POST" onSubmit={(e) => handleSubmit(e)}>
            <div className="rounded-md shadow-sm -space-y-px flex-row  ">
              <div className="bg-white rounded-md shadow-sm justify-between flex">
                <input
                  id="link-text"
                  name="text"
                  type="text"
                  autoComplete="text"
                  required
                  value={input}
                  onChange={handleKeyDown}
                  className="appearance-none relative flex-1 px-3 py-3 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 text-base"
                  placeholder="Paste your long link here..."
                />
                <button
                  type="submit"
                  className={
                    disable
                      ? "cursor-not-allowed bg-pink group disabled justify-center py-3 px-5 border border-transparent text-lg font-medium rounded-md text-white bg-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      : "cursor-pointer bg-pink group justify-center py-3 px-5 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  }
                >
                  {loading ? (
                    <img
                      src={Loader}
                      className="animate-spin h-6 w-6 mx-auto"
                      alt="loading ..."
                    />
                  ) : (
                    <span className="text-fadeBlack">Short it!</span>
                  )}
                </button>
              </div>
            </div>
          </form>
          <div>
            {shortUrl ? (
              <>
                <button
                  type="button"
                  className="w-full bg-pink text-gray-400 hover:text-gray-900 font-mono leading-6 py-3 sm:px-6 border border-gray-200 rounded-md flex items-center justify-center space-x-2 sm:space-x-4 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 focus:outline-none transition-colors duration-200 hover:bg-green-50 hover:border-green-300"
                  onClick={() => {
                    if (shortUrl !== undefined) {
                      navigator.clipboard.writeText(
                        SERVER_ENDPOINTS + "/" + shortUrl?.shortId
                      );
                    }
                    setCopied(true);
                    setInterval(() => {
                      setCopied(false);
                    }, 5000);
                  }}
                >
                  <span className="text-gray-900">
                    <span
                      className="hidden sm:inline text-gray-500"
                      aria-hidden="true"
                    ></span>
                    {`${SERVER_ENDPOINTS}/${shortUrl?.shortId}`}
                  </span>
                  <span className="sr-only">(click to copy to clipboard)</span>
                  <img src={Copy} className="h-5 w-5" alt="copy link" />
                </button>
              </>
            ) : (
              <>
                <div className="w-full leading-6 py-3 flex items-center justify-center space-x-2 sm:space-x-4">
                  <div className="my-3"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default URLShortenerForm;
