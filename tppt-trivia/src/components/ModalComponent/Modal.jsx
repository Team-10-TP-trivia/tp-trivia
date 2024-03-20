import { useState } from "react";
import PropTypes from "prop-types";
import TrendingGiphys from "../TrendingGiphys/TrendingGiphys";
import TrendingUnsplash from "../TrendingUnsplash/TendingUsplash";
import { useSearchParams } from "react-router-dom";
import "./Modal.css";

export default function Modal({ onSelectGif, onSelectUnsplash }) {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Images");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="main-modal-component">
      <button onClick={toggleModal} className="btn-modal">
        Media Selection
      </button>

      {modal && (
        <div className="modal">
          <div className="overlay" onClick={toggleModal}></div>
          <div className="modal-content">
            <div className="sidebar-modal">
              <button
                onClick={() => changeTab("Images")}
                className={`tab-button ${
                  activeTab === "Images" ? "active" : ""
                }`}
              >
                Images
              </button>
              <button
                onClick={() => changeTab("GIFs")}
                className={`tab-button ${activeTab === "GIFs" ? "active" : ""}`}
              >
                GIFs
              </button>
              <input
                type="text"
                label="Search images"
                id="school"
                name="school"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="main-content-modal">
              {activeTab === "Images" && (
                <TrendingUnsplash
                  onSelectMedia={onSelectUnsplash}
                  setModal={setModal}
                  searchParams={search}
                />
              )}
              {activeTab === "GIFs" && (
                <TrendingGiphys
                  onSelectMedia={onSelectGif}
                  setModal={setModal}
                  searchParams={search}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Modal.propTypes = {
  onSelectGif: PropTypes.func.isRequired,
  onSelectUnsplash: PropTypes.func.isRequired,
};
