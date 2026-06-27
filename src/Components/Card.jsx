// Card.jsx

import './Card.css';

import { useState } from 'react';

function Card({ title }) {
  const [hasLiked, setHasLiked] = useState(false);

  return (
    <div className="card">
      <h2>{title}</h2>

      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? 'Liked ❤️' : 'Like 👍'}
      </button>
    </div>
  );
}

export default Card;