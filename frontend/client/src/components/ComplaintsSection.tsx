import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, User, MapPin, MessageSquare } from "lucide-react";

interface Complaint {
  id: number;
  title: string;
  description: string;
  reportedBy: string;
  date: string;
  location: string;
  status: "open" | "in-progress" | "resolved" | "verified";
  priority: "low" | "medium" | "high";
}

const sampleComplaints: Complaint[] = [
  {
    id: 1,
    title: "Large Pothole on Main Road",
    description: "Dangerous pothole near the market area causing accidents",
    reportedBy: "Rajesh Kumar",
    date: "2024-11-18",
    location: "Main Road, Dharavi",
    status: "in-progress",
    priority: "high"
  },
  {
    id: 2,
    title: "Broken Street Light",
    description: "Street light not working for the past week, area is dark at night",
    reportedBy: "Priya Sharma",
    date: "2024-11-19",
    location: "Station Road, Andheri",
    status: "open",
    priority: "medium"
  },
  {
    id: 3,
    title: "Road Crack Near School",
    description: "Growing crack in the road surface poses safety risk for children",
    reportedBy: "Amit Patel",
    date: "2024-11-19",
    location: "School Street, Bandra",
    status: "verified",
    priority: "high"
  },
  {
    id: 4,
    title: "Drainage Issue",
    description: "Water accumulation during rain, needs better drainage system",
    reportedBy: "Sunita Desai",
    date: "2024-11-20",
    location: "Park Avenue, Borivali",
    status: "resolved",
    priority: "medium"
  },
  {
    id: 5,
    title: "Uneven Road Surface",
    description: "Road surface is uneven causing vehicle damage",
    reportedBy: "Vikram Singh",
    date: "2024-11-20",
    location: "Lake Road, Powai",
    status: "open",
    priority: "low"
  },
  {
    id: 6,
    title: "Missing Road Signs",
    description: "Important traffic signs are missing at intersection",
    reportedBy: "Anjali Mehta",
    date: "2024-11-20",
    location: "Junction Road, Goregaon",
    status: "in-progress",
    priority: "medium"
  },
  {
    id: 7,
    title: "Damaged Footpath",
    description: "Footpath tiles are broken and loose, hazardous for pedestrians",
    reportedBy: "Mohammed Ali",
    date: "2024-11-19",
    location: "Market Street, Kurla",
    status: "verified",
    priority: "high"
  },
  {
    id: 8,
    title: "Narrow Road Section",
    description: "Road section too narrow causing traffic congestion",
    reportedBy: "Kavita Nair",
    date: "2024-11-18",
    location: "Temple Road, Dadar",
    status: "open",
    priority: "low"
  }
];

export default function ComplaintsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "verified":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "open":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      case "medium":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  const displayedComplaints = showAll ? sampleComplaints : sampleComplaints.slice(0, 3);

  return (
    <section
      id="complaints"
      ref={sectionRef}
      className={`py-24 px-4 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center gap-4 mb-12">
          <AlertCircle className="h-12 w-12 text-primary" />
          <h2 
            className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            data-testid="text-complaints-title"
          >
            complaints»
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <p className="text-xl text-muted-foreground max-w-3xl">
            Community-reported issues help us improve infrastructure. All complaints are verified and used to update road plans.
          </p>
          
          {!showAll && (
            <Button
              variant="default"
              size="lg"
              className="shadow-xl"
              onClick={() => window.location.href = '/complaints'}
              data-testid="button-view-all-complaints"
            >
              View all complaints →
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedComplaints.map((complaint) => (
            <Card 
              key={complaint.id} 
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg line-clamp-2 flex-1">{complaint.title}</h3>
                  <Badge className={getPriorityColor(complaint.priority)}>
                    {complaint.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {complaint.description}
                </p>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{complaint.reportedBy}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{complaint.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(complaint.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Badge className={getStatusColor(complaint.status)}>
                    {complaint.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {showAll && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(false)}
              data-testid="button-show-less-complaints"
            >
              Show less
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
