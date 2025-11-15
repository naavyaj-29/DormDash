import { useState } from "react";
import PostMealForm from "./components/PostMealForm.jsx"; // import the form

function App() {
  const [showPostMealForm, setShowPostMealForm] = useState(false);

  const handleOpenForm = () => {
    setShowPostMealForm(true);
  };

  const handleCloseForm = () => {
    setShowPostMealForm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Campus Chef</h1>

      {/* + Post Meal button */}
      <button
        onClick={handleOpenForm}
        style={{
          padding: "10px 15px",
          marginTop: "15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        + Post Meal
      </button>

      {/* Conditional popup/modal */}
      {showPostMealForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "350px",
            }}
          >
            <h2>Create New Meal</h2>
            <PostMealForm />

            <button
              onClick={handleCloseForm}
              style={{
                marginTop: "10px",
                padding: "8px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
