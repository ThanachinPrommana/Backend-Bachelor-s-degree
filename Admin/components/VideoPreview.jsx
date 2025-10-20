import React from "react";

const VideoPreview = (props) => {
  const { record } = props;
  const videos = record.populated?.Video || [];

  if (!videos.length) return <p>ไม่มีวิดีโอ</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
      {videos.map((vid, i) => (
        <video
          key={i}
          src={vid.params.secure_url}
          controls
          width="240"
          height="160"
          style={{ borderRadius: 8, border: "1px solid #ddd" }}
        />
      ))}
    </div>
  );
};

export default VideoPreview;
