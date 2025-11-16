// generateHistory
import React, { useState } from "react";
import axios from "axios";

export default function GenerateHistory({ mealData, setMealData }) {
const [loading, setLoading] = useState(false);
const [text, setText] = useState("");
const [audioUrl, setAudioUrl] = useState("");

const handleGenerate = async () => {
setLoading(true);
try {
const res = await axios.post("http://localhost:4000/api/generate/history", {
title: mealData.title,
description: mealData.description,
tags: mealData.tags,
culturalNote: mealData.culturalNote,
});

setText(res.data.text);
setAudioUrl(res.data.audioUrl);
} catch (err) {
console.error("Failed to generate history:", err.response?.data || err.message);
alert("Failed to generate history. See console for details.");
}
setLoading(false);
};

return (
<div style={{ marginTop: "20px" }}>
<button onClick={handleGenerate}>
{loading ? "Generating..." : "Generate Dish History"}
</button>

{text && (
<>
<textarea
rows={6}
style={{ width: "100%", marginTop: "10px" }}
value={text}
onChange={(e) => setText(e.target.value)}
/>

{audioUrl && (
<audio controls style={{ marginTop: "10px" }}>
<source src={`http://localhost:4000${audioUrl}`} type="audio/mp3" />
</audio>
)}

<button
style={{ marginTop: "10px" }}
onClick={() =>
setMealData({ ...mealData, generatedHistory: { text, audioUrl } })
}
>
Use This History
</button>
</>
)}
</div>
);
}
