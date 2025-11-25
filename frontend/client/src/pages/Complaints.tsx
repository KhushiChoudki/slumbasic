import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Complaint {
  id: string;
  name: string;
  email: string;
  complaint: string;
  date: string;
}

interface AreaInfo {
  id: string;
  name: string;
  description: string;
}

interface AreaStatistics {
  totalFeatures: number;
  featureTypes: {
    roads: number;
    points: number;
    buildings: number;
  };
  boundingBox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export default function Complaints() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [availableAreas, setAvailableAreas] = useState<AreaInfo[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [areaInfo, setAreaInfo] = useState<AreaInfo | null>(null);
  const [areaStats, setAreaStats] = useState<AreaStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    complaint: "",
  });

  // Fetch available areas on component mount
  useEffect(() => {
    fetchAvailableAreas();
  }, []);

  // Fetch area data when area is selected
  useEffect(() => {
    if (selectedArea) {
      fetchAreaData(selectedArea);
    }
  }, [selectedArea]);

  const fetchAvailableAreas = async () => {
    try {
      const response = await fetch("/api/complaints/areas");
      if (!response.ok) throw new Error("Failed to fetch areas");
      const data = await response.json();
      const areas = data.areas || [];
      setAvailableAreas(areas);
      // Auto-select first area if available
      if (areas.length > 0) {
        setSelectedArea(areas[0].id);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast({
        title: "Error",
        description: "Failed to load available areas",
        variant: "destructive",
      });
    }
  };

  const fetchAreaData = async (areaId: string) => {
    setLoading(true);
    try {
      // Fetch area info
      const infoResponse = await fetch(`/api/complaints/${areaId}/info`);
      if (!infoResponse.ok) throw new Error("Failed to fetch area info");
      const info = await infoResponse.json();
      setAreaInfo(info);

      // Fetch area statistics
      const statsResponse = await fetch(`/api/complaints/${areaId}/statistics`);
      if (!statsResponse.ok) throw new Error("Failed to fetch area statistics");
      const stats = await statsResponse.json();
      setAreaStats(stats);
    } catch (error) {
      console.error("Error fetching area data:", error);
      toast({
        title: "Error",
        description: "Failed to load area data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.complaint) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      complaint: formData.complaint,
      date: new Date().toLocaleDateString(),
    };

    setComplaints([newComplaint, ...complaints]);
    setFormData({ name: "", email: "", complaint: "" });
    
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been submitted successfully!",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Complaints
          </h1>
          <p className="text-gray-600 text-lg">
            Submit your complaint or view existing complaints
          </p>
        </div>

        {/* Area Selector */}
        <Card className="mb-8 shadow-lg border-purple-100">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">Select Area</CardTitle>
            <CardDescription>
              Choose an area to view complaints and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAreas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <p className="text-purple-600">Loading area data...</p>
                </div>
              )}

              {!loading && areaInfo && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">{areaInfo.name}</h3>
                  <p className="text-gray-700 mb-4">{areaInfo.description}</p>
                  
                  {areaStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Total Features</p>
                        <p className="text-2xl font-bold text-purple-600">{areaStats.totalFeatures}</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Roads</p>
                        <p className="text-2xl font-bold text-pink-600">{areaStats.featureTypes.roads}</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Points</p>
                        <p className="text-2xl font-bold text-purple-600">{areaStats.featureTypes.points}</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Buildings</p>
                        <p className="text-2xl font-bold text-pink-600">{areaStats.featureTypes.buildings}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Complaint Form */}
        <Card className="mb-12 shadow-lg border-purple-100">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">Submit a Complaint</CardTitle>
            <CardDescription>
              Please fill out the form below to submit your complaint for {areaInfo?.name || "selected area"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint">Complaint</Label>
                <Textarea
                  id="complaint"
                  name="complaint"
                  placeholder="Describe your complaint in detail..."
                  value={formData.complaint}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Submit Complaint
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-purple-600">
            All Complaints ({complaints.length})
          </h2>
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="shadow-md hover:shadow-lg transition-shadow border-purple-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-purple-700">{complaint.name}</CardTitle>
                      <CardDescription>{complaint.email}</CardDescription>
                    </div>
                    <span className="text-sm text-gray-500">{complaint.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{complaint.complaint}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
