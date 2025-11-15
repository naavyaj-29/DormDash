import React, { useState, useRef } from "react";
import { Upload, Heart, MessageCircle, Share2, Send } from "lucide-react";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },

  composer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    marginBottom: "24px",
  },

  composerHeader: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "12px",
  },

  composerAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#f3f4f6,#e9d5ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#4b5563",
  },

  textArea: {
    width: "100%",
    minHeight: "80px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    resize: "vertical",
    marginBottom: "12px",
  },

  uploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f3f4f6",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
  },

  submitButton: {
    background: "linear-gradient(45deg, #8b5cf6 0%, #ec4899 100%)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  postCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    marginBottom: "24px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
  },

  username: {
    fontWeight: "600",
    fontSize: "15px",
    margin: 0,
  },

  timestamp: {
    fontSize: "12px",
    color: "#6b7280",
  },

  text: {
    marginTop: "12px",
    marginBottom: "12px",
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.5",
  },

  image: {
    width: "100%",
    borderRadius: "8px",
    marginTop: "12px",
  },

  video: {
    width: "100%",
    borderRadius: "8px",
    marginTop: "12px",
  },

  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
  },

  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #e6e6e6",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
  },

  likeCount: {
    fontSize: "13px",
    color: "#6b7280",
    marginLeft: "auto",
  },

  commentSection: {
    marginTop: "12px",
    borderTop: "1px solid #f3f4f6",
    paddingTop: "12px",
  },

  commentItem: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
    marginBottom: "8px",
  },

  commentAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    color: "#4f46e5",
  },

  commentBubble: {
    background: "#f8fafc",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#374151",
  },

  commentComposer: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },

  commentInput: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
  },
};

export default function CommunityPage({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const fileRef = useRef();

  // ---------------------------
  // CREATE NEW POST
  // ---------------------------
  const submitPost = () => {
    if (!text.trim() && !media) return;

    const postId = Date.now().toString();

    const finalize = ({ imageSrc = null, videoSrc = null }) => {
      const post = {
        id: postId,
        user: currentUser?.name || "Anonymous",
        text,
        timestamp: "Just now",
        image: imageSrc,
        video: videoSrc,
        likes: 0,
        liked: false,
        comments: [],
      };

      setPosts((prev) => [post, ...prev]);
      setText("");
      setMedia(null);
    };

    if (!media) return finalize({});

    const type = media.type || "";
    const isImage = type.startsWith("image/");
    const isVideo = type.startsWith("video/");

    const url = URL.createObjectURL(media);

    if (isImage) finalize({ imageSrc: url });
    else if (isVideo) finalize({ videoSrc: url });
    else finalize({});
  };

  // LIKE HANDLER
  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p
      )
    );
  };

  // ADD COMMENT
  const addComment = (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: Date.now().toString(),
                  user: currentUser?.name || "You",
                  text,
                },
              ],
            }
          : p
      )
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div style={styles.container}>
      {/* COMPOSER */}
      <div style={styles.composer}>
        <div style={styles.composerHeader}>
          <div style={styles.composerAvatar}>
            {(currentUser?.name || "A")[0]}
          </div>

          <div style={{ flex: 1 }}>
            <textarea
              style={styles.textArea}
              placeholder="Share something with the community..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={styles.uploadButton}
                onClick={() => fileRef.current.click()}
              >
                <Upload size={16} /> Add Image / Video
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={(e) => setMedia(e.target.files[0])}
              />

              <button style={styles.submitButton} onClick={submitPost}>
                Post
              </button>
            </div>

            {media && (
              <p style={{ fontSize: "13px", marginTop: 6 }}>
                Selected: {media.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* POSTS */}
      {posts.map((p) => (
        <div key={p.id} style={styles.postCard}>
          <div style={styles.header}>
            <div style={styles.avatar}>{p.user[0]}</div>

            <div>
              <p style={styles.username}>{p.user}</p>
              <p style={styles.timestamp}>{p.timestamp}</p>
            </div>
          </div>

          {p.text && <p style={styles.text}>{p.text}</p>}
          {p.image && <img src={p.image} style={styles.image} />}
          {p.video && (
            <video controls style={styles.video}>
              <source src={p.video} />
            </video>
          )}

          <div style={styles.actionRow}>
            <button
              style={{
                ...styles.actionButton,
                background: p.liked
                  ? "linear-gradient(90deg,#ff7ab6,#8b5cf6)"
                  : "transparent",
                color: p.liked ? "white" : undefined,
              }}
              onClick={() => toggleLike(p.id)}
            >
              <Heart size={16} /> {p.liked ? "Liked" : "Like"}
            </button>

            <button
              style={styles.actionButton}
              onClick={() =>
                document
                  .getElementById(`comment-input-${p.id}`)
                  ?.focus()
              }
            >
              <MessageCircle size={16} /> Comment
            </button>

            <button
              style={styles.actionButton}
              onClick={() => alert("Share link copied!")}
            >
              <Share2 size={16} /> Share
            </button>

            <div style={styles.likeCount}>
              {p.likes} {p.likes === 1 ? "like" : "likes"}
            </div>
          </div>

          <div style={styles.commentSection}>
            {p.comments.map((c) => (
              <div key={c.id} style={styles.commentItem}>
                <div style={styles.commentAvatar}>{c.user[0]}</div>

                <div style={styles.commentBubble}>
                  <strong>{c.user}</strong>
                  <div>{c.text}</div>
                </div>
              </div>
            ))}

            <div style={styles.commentComposer}>
              <input
                id={`comment-input-${p.id}`}
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={commentInputs[p.id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [p.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") addComment(p.id);
                }}
              />

              <button
                style={styles.actionButton}
                onClick={() => addComment(p.id)}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
