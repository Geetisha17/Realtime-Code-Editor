import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    console.log("Rendering client avatar for:", username);
  return (
    <div className="client">
      <Avatar name={username} size="40" round={true} textSizeRatio={2} />
      <span className="username">{username}</span>
    </div>
  );
};

export default Client;
