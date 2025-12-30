// src/pages/Uploads.tsx (or wherever this component lives)
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2, CheckCircle, MapPin } from "lucide-react";
import { uploadAndVerifyImage, getIPFSUrl } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import { BrowserProvider, Contract } from "ethers";
import "leaflet/dist/leaflet.css";
import roadsData from "@/data/fin_roads.json";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/config/contract";

// --------- hard relax window typing to kill ethereum errors ---------
declare const window: any;

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  preview?: string;
  description?: string;
  location?: string;
  cid?: string;
  metadataCID?: string;
  similarity?: number;
  ipfsUrl?: string;
  blockchainTxHash?: string;
}

interface ChainData {
  chainId: bigint | null;
  name: string;
}

export default function Uploads() {
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedRoad, setSelectedRoad] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [metadataCID, setMetadataCID] = useState("");
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [chainData, setChainData] = useState<ChainData>({
    chainId: null,
    name: "",
  });
  const [blockchainStatus, setBlockchainStatus] = useState("");

  // ------------ Web3 init ------------
  useEffect(() => {
    async function initializeProvider() {
      if (typeof window === "undefined" || !window.ethereum) return;

      try {
        const ethProvider = new BrowserProvider(window.ethereum);
        setProvider(ethProvider);

        const network = await ethProvider.getNetwork();
        setChainData({
          chainId: network.chainId,
          name: network.name || "Unknown Network",
        });

        window.ethereum.on("chainChanged", async () => {
          const newProvider = new BrowserProvider(window.ethereum);
          setProvider(newProvider);
          try {
            const net = await newProvider.getNetwork();
            setChainData({
              chainId: net.chainId,
              name: net.name || "Unknown Network",
            });
          } catch (err) {
            console.error("Failed to detect network:", err);
          }
        });

        window.ethereum.on("accountsChanged", () => {
          toast({
            title: "Account Changed",
            description: "MetaMask account changed. Reconnect if needed.",
          });
        });
      } catch (err) {
        console.error("Failed to initialize provider:", err);
      }
    }

    initializeProvider();
  }, [toast]);

  // ------------ helpers ------------
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  const handleRoadClick = (event: LeafletMouseEvent) => {
    const feature = (event.target as any)?.feature;
    if (!feature) {
      console.warn("Clicked layer has no GeoJSON feature");
      return;
    }
    const name =
      feature.properties?.name || `OSM ID: ${feature.properties?.osm_id}`;
    setSelectedRoad(name);
    setLocation(name);
    toast({
      title: "Road Selected",
      description: `Selected: ${name}`,
    });
  };

  // ------------ upload + verify ------------
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (jpg, png, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description of the issue",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRoad && !location.trim()) {
      toast({
        title: "Location required",
        description: "Please select a road on the map or provide a location",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const locationToUse = selectedRoad || location;

      const result = await uploadAndVerifyImage(
        selectedFile,
        description,
        locationToUse
      );

      setSimilarity(result.similarity);
      setMetadataCID(result.metadataCID);

      const preview = URL.createObjectURL(selectedFile);
      const ipfsUrl = getIPFSUrl(result.cid);

      const newUpload: UploadedFile = {
        id: Date.now().toString(),
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        type: selectedFile.type,
        date: new Date().toLocaleDateString(),
        preview,
        description,
        location: locationToUse,
        cid: result.cid,
        metadataCID: result.metadataCID,
        similarity: result.similarity,
        ipfsUrl,
      };

      setUploads((prev) => [newUpload, ...prev]);

      toast({
        title: "Verification Passed!",
        description: `Image verified with ${(result.similarity * 100).toFixed(
          1
        )}% similarity. Ready to submit to blockchain.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ------------ blockchain submit ------------
  const submitToBlockchain = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask extension to submit to blockchain",
        variant: "destructive",
      });
      return;
    }

    if (!metadataCID) {
      toast({
        title: "Cannot Submit",
        description: "Please verify an image first",
        variant: "destructive",
      });
      return;
    }

    try {
      let ethProvider = provider;
      if (!ethProvider) {
        ethProvider = new BrowserProvider(window.ethereum);
        setProvider(ethProvider);
      }

      setBlockchainStatus("Requesting MetaMask access...");
      await ethProvider.send("eth_requestAccounts", []);
      const signer = await ethProvider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setBlockchainStatus(`Submitting to blockchain on ${chainData.name}...`);

      const tx = await contract.submitReport(
        "RoadIssue",
        description,
        selectedRoad || location,
        metadataCID
      );

      setBlockchainStatus(`Transaction sent: ${tx.hash}`);

      toast({
        title: "Transaction Sent",
        description: `Tx: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
      });

      await tx.wait();

      setBlockchainStatus("Report recorded on blockchain successfully!");

      toast({
        title: "Success!",
        description: "Report recorded on blockchain",
      });

      setSelectedFile(null);
      setDescription("");
      setLocation("");
      setSelectedRoad("");
      setSimilarity(null);
      setMetadataCID("");

      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      if (error.message?.includes("user rejected")) {
        setBlockchainStatus("Transaction rejected by user.");
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction",
          variant: "destructive",
        });
      } else {
        setBlockchainStatus("Blockchain submission failed.");
        toast({
          title: "Submission Failed",
          description: error.message || "Failed to submit to blockchain",
          variant: "destructive",
        });
      }
      console.error("Blockchain error:", error);
    }
  };

  const handleDelete = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("sheet") || type.includes("excel")) return "📊";
    if (type.includes("presentation") || type.includes("powerpoint"))
      return "📽️";
    return "📎";
  };

  // ------------ JSX ------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Road Issue Reporter
          </h1>
          <p className="text-gray-600 text-lg">
            Select a road on the map, upload an image, and AI will verify your
            description matches the image.
          </p>
          {chainData.chainId !== null && (
  <p className="text-sm text-purple-600 mt-2">
    Connected to: {chainData.name} (Chain ID:{" "}
    {chainData.chainId.toString()}
    )
  </p>
)}

        </div>

        {/* Map */}
        <Card className="mb-8 shadow-lg border-purple-100">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Select Road Location
            </CardTitle>
            <CardDescription>
              Click on a road segment to select it for your report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-purple-200">
              <MapContainer
                center={[19.076, 72.8777]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON
                  data={roadsData as any}
                  onEachFeature={(feature: any, layer: any) => {
                    layer.on({
                      click: handleRoadClick,
                    });
                  }}
                  style={(feature: any) => ({
                    color:
                      selectedRoad === feature?.properties?.name ||
                      selectedRoad ===
                        `OSM ID: ${feature?.properties?.osm_id}`
                        ? "#9333ea"
                        : "#ec4899",
                    weight:
                      selectedRoad === feature?.properties?.name ||
                      selectedRoad ===
                        `OSM ID: ${feature?.properties?.osm_id}`
                        ? 5
                        : 3,
                  })}
                />
              </MapContainer>
            </div>
            {selectedRoad && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-700">
                  Selected Road:{" "}
                  <span className="text-purple-900">{selectedRoad}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload form */}
        <Card className="mb-12 shadow-lg border-purple-100">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600 flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Upload an Image
            </CardTitle>
            <CardDescription>
              Upload an image with description and location. AI will verify your
              description matches the image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-input">Choose Image</Label>
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="border-purple-200 focus:border-purple-400 cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedFile.name} (
                    {formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what's in the image..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  className="border-purple-200 focus:border-purple-400 min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  AI will verify this description matches your image
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter location (e.g., New York, USA)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isUploading}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !description || !location || isUploading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading & Verifying...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Verify
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Submission */}
        {metadataCID && similarity !== null && similarity >= 0.28 && (
          <Card className="mb-12 shadow-lg border-green-100 bg-gradient-to-br from-green-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                AI Verification Passed!
              </CardTitle>
              <CardDescription>
                Your image has been verified with {(similarity * 100).toFixed(
                  1
                )}
                % similarity. You can now submit to blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">
                        Description:
                      </p>
                      <p className="text-gray-600">{description}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">
                        Location:
                      </p>
                      <p className="text-gray-600">{location}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">
                        Similarity Score:
                      </p>
                      <p className="text-green-600 font-medium">
                        {(similarity * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">
                        Metadata CID:
                      </p>
                      <p className="text-purple-600 break-all">
                        {metadataCID.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={submitToBlockchain}
                  className="w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit to Blockchain (MetaMask)
                </Button>

                {blockchainStatus && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700">
                      {blockchainStatus}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploads List */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-purple-600">
            Uploaded Images ({uploads.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map((upload) => (
              <Card
                key={upload.id}
                className="shadow-md hover:shadow-lg transition-shadow border-purple-100 relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 z-10"
                  onClick={() => handleDelete(upload.id)}
                >
                  <X className="w-4 h-4" />
                </Button>

                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {upload.preview && (
                      <img
                        src={upload.preview}
                        alt={upload.name}
                        className="w-full h-48 rounded object-cover mb-3"
                      />
                    )}
                  </div>
                  <CardTitle className="text-base text-purple-700 truncate">
                    {upload.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {upload.size} • {upload.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upload.description && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Description:
                      </p>
                      <p className="text-sm text-gray-600">
                        {upload.description}
                      </p>
                    </div>
                  )}

                  {upload.location && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Location:
                      </p>
                      <p className="text-sm text-gray-600">
                        {upload.location}
                      </p>
                    </div>
                  )}

                  {upload.similarity !== undefined && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        Verified: {(upload.similarity * 100).toFixed(1)}% match
                      </span>
                    </div>
                  )}

                  {upload.cid && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        IPFS CID:
                      </p>
                      <a
                        href={upload.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:text-purple-800 break-all underline"
                      >
                        {upload.cid.substring(0, 20)}...
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {uploads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No uploads yet</p>
              <p className="text-sm">
                Upload your first image above to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
