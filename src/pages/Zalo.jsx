import React from 'react';
import './Zalo.css';

const Zalo = () => {
    const zaloLink = "https://zalo.me/84856357069";

    return (
        <a
            href={zaloLink}
            target="_blank"//mở tab mới nhưng k mất trang
            rel="noopener noreferrer"
            className="zalo-float shadow"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                alt="Zalo Chat"
            />
        </a>
    );
};

export default Zalo;