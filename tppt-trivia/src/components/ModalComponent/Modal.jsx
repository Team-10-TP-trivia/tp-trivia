import { useState } from 'react';
import PropTypes from 'prop-types';
import TrendingGiphys from '../TrendingGiphys/TrendingGiphys';
import './Modal.css'; 

export default function Modal({ onSelectGif }) {
    const [modal, setModal] = useState(false);
    const [activeTab, setActiveTab] = useState('Images');

    const toggleModal = () => {
        setModal(!modal);
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='main-modal-component'>
            <button onClick={toggleModal} className="btn-modal">
                Settings
            </button>

            {modal && (
                <div className="modal">
                    <div className="overlay" onClick={toggleModal}></div>
                    <div className="modal-content">
                        <div className="sidebar-modal">
                            <button 
                                onClick={() => changeTab('Images')}
                                className={`tab-button ${activeTab === 'Images' ? 'active' : ''}`}>
                                Images
                            </button>
                            <button 
                                onClick={() => changeTab('GIFs')}
                                className={`tab-button ${activeTab === 'GIFs' ? 'active' : ''}`}>
                                GIFs
                            </button>
                            <button 
                                onClick={() => changeTab('Videos')}
                                className={`tab-button ${activeTab === 'Videos' ? 'active' : ''}`}>
                                Videos
                            </button>
                        </div>
                        <div className="main-content-modal">
                            {activeTab === 'Images' && (
                                <div>Unsplash content here</div>
                            )}
                            {activeTab === 'GIFs' && (
                                <TrendingGiphys onSelectMedia={onSelectGif} setModal={setModal}/>
                            )}
                            {activeTab === 'Videos' && (
                                <div>Youtube????</div>
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
};
