import React from 'react';

export default function ImageGallery({ record }) {
  const images = record.populated?.Image || [];
  if (!images.length) return <p>ไม่มีรูปภาพ</p>;
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {images.map((img, i) => (
        <img key={i} src={img.params.secure_url} alt="Property" style={{ width: 120, height: 90, objectFit: 'cover' }} />
      ))}
    </div>
  );
}
