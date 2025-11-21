import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import roadsData from "./fin_roads.json";  // your GeoJSON road file
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./ContractABI";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [similarity, setSimilarity] = useState(null);
  const [metadataCID, setMetadataCID] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState(null);
  const [chainData, setChainData] = useState({ chainId: null, name: "" });
  const [selectedRoad, setSelectedRoad] = useState("");

  useEffect(() => {
    async function initializeProvider() {
      if (!window.ethereum) {
        alert("Please install MetaMask to continue.");
        return;
      }
      const ethProvider = new BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      try {
        const network = await ethProvider.getNetwork();
        setChainData({
          chainId: network.chainId,
          name: network.name || "Unknown Network",
        });
      } catch {
        setStatus("⚠️ Failed to detect network.");
      }

      window.ethereum.on("chainChanged", async (chainId) => {
        const newProvider = new BrowserProvider(window.ethereum);
        setProvider(newProvider);
        try {
          const network = await newProvider.getNetwork();
          setChainData({
            chainId: network.chainId,
            name: network.name || "Unknown Network",
          });
          setStatus(`🔁 Network changed to chain ID: ${parseInt(chainId, 16)}`);
        } catch {
          setStatus("⚠️ Failed to detect new network.");
        }
      });

      window.ethereum.on("accountsChanged", () => {
        setStatus("🔄 MetaMask account changed. Reconnect if needed.");
      });
    }
    initializeProvider();
  }, []);

  const handleRoadClick = (event) => {
  // Leaflet event has target with feature
  const feature = event.target?.feature;
  if (!feature) {
    console.warn("Clicked layer has no GeoJSON feature");
    return;
  }
  const name = feature.properties.name || `OSM ID: ${feature.properties.osm_id}`;
  setSelectedRoad(name);
  setStatus(`🗺️ Selected road: ${name}`);
};


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !description || !selectedRoad) {
      alert("Please select an image, enter a description, and select a road on the map.");
      return;
    }

    setStatus("📤 Uploading and verifying with AI model...");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", selectedFile);
    formData.append("location", selectedRoad);

    try {
      const response = await fetch("http://127.0.0.1:5001/upload_and_verify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data) throw new Error("Empty response from backend.");

      setSimilarity(data.similarity);
      if (data.similarity >= 0.28) {
        setMetadataCID(data.metadataCID);
        setStatus("✅ Verification passed! Ready to submit to blockchain.");
      } else {
        setStatus("❌ Verification failed. Description doesn't match the image.");
      }
    } catch {
      setStatus("⚠️ Failed to connect to backend. Check if server is running.");
    }
  };

  const submitToBlockchain = async () => {
    try {
      setStatus("Requesting MetaMask account access...");
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setStatus(`🚀 Submitting verified report to blockchain on ${chainData.name}...`);

      const tx = await contract.submitReport("RoadIssue", description, selectedRoad, metadataCID);

      setStatus(`📡 Transaction sent – hash: ${tx.hash} (No ETH transferred; rewards tracked internally.)`);
      await tx.wait();
      setStatus("✅ Report recorded on blockchain successfully.");
    } catch (error) {
      if (error.message?.includes("user rejected")) {
        setStatus("⛔ Transaction rejected by user.");
      } else {
        setStatus("❌ Blockchain submission failed. See console for details.");
      }
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Slum Road Issue Reporter</h1>
      {chainData.chainId && (
        <p style={styles.networkInfo}>
          Connected to: {chainData.name} (Chain ID: {chainData.chainId})
        </p>
      )}

      <div style={{ height: "400px", width: "100%", marginBottom: "15px" }}>
        <MapContainer center={[19.076, 72.8777]} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <GeoJSON
            data={roadsData}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: handleRoadClick,
              });
            }}
            style={(feature) => ({
              color:
                selectedRoad === feature.properties.name || selectedRoad === `OSM ID: ${feature.properties.osm_id}`
                  ? "#007bff"
                  : "#333",
              weight: 4,
            })}
          />
        </MapContainer>
      </div>

      <p style={styles.text}>Selected road/location: {selectedRoad || "None selected"}</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Enter a short description of the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Upload & Verify</button>
      </form>

      {similarity !== null && <p style={styles.text}>CLIP Similarity Score: {similarity.toFixed(4)}</p>}

      {status && <p style={styles.text}>{status}</p>}

      {metadataCID && (
        <button onClick={submitToBlockchain} style={styles.submitButton}>
          Submit to Blockchain
        </button>
      )}
    </div>
  );
}

// Styles object unchanged
const styles = {
  container: { maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" },
  title: { textAlign: "center" },
  form: { marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  input: { border: "1px solid #ccc", padding: "10px" },
  textarea: { resize: "none", border: "1px solid #ccc", padding: "10px", height: "100px" },
  button: { backgroundColor: "#007bff", color: "#fff", border: "none", padding: "10px 15px", cursor: "pointer" },
  submitButton: { backgroundColor: "#28a745", color: "#fff", border: "none", padding: "10px 15px", cursor: "pointer", marginTop: "10px" },
  text: { textAlign: "center", marginTop: "10px", fontWeight: "bold" },
  networkInfo: { textAlign: "center", margin: "10px 0", color: "#494949", fontStyle: "italic" },
};

export default App;
