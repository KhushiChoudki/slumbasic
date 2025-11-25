import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User, Pencil } from "lucide-react";

interface RoadIssue {
  id: number;
  title: string;
  description: string;
  reportedBy: string;
  date: string;
  location: string;
  status: "pending" | "surveyed" | "drawn" | "completed";
  priority: "low" | "medium" | "high";
}

const sampleRoadIssues: RoadIssue[] = [
  {
    id: 1,
    title: "New Road Connection Needed",
    description: "Area needs better road connectivity to main thoroughfare",
    reportedBy: "Rajesh Kumar",
    date: "2024-11-18",
    location: "Main Road, Dharavi",
    status: "surveyed",
    priority: "high"
  },
  {
    id: 2,
    title: "Missing Internal Lane",
    description: "Residential area lacks proper internal lane access",
    reportedBy: "Priya Sharma",
    date: "2024-11-19",
    location: "Station Road, Andheri",
    status: "pending",
    priority: "medium"
  },
  {
    id: 3,
    title: "Alternative Route Required",
    description: "Traffic congestion needs new bypass road",
    reportedBy: "Amit Patel",
    date: "2024-11-19",
    location: "School Street, Bandra",
    status: "completed",
    priority: "high"
  },
  {
    id: 4,
    title: "Service Road Extension",
    description: "Extend service road to connect two neighborhoods",
    reportedBy: "Sunita Desai",
    date: "2024-11-20",
    location: "Park Avenue, Borivali",
    status: "drawn",
    priority: "medium"
  },
  {
    id: 5,
    title: "Pedestrian Pathway",
    description: "Need dedicated pedestrian pathway for safety",
    reportedBy: "Vikram Singh",
    date: "2024-11-20",
    location: "Lake Road, Powai",
    status: "pending",
    priority: "low"
  },
  {
    id: 6,
    title: "Cross-Connection Road",
    description: "Create connecting road between parallel streets",
    reportedBy: "Anjali Mehta",
    date: "2024-11-20",
    location: "Junction Road, Goregaon",
    status: "surveyed",
    priority: "medium"
  },
  {
    id: 7,
    title: "Market Access Road",
    description: "Improve access road to local market area",
    reportedBy: "Mohammed Ali",
    date: "2024-11-19",
    location: "Market Street, Kurla",
    status: "completed",
    priority: "high"
  },
  {
    id: 8,
    title: "Residential Lane Planning",
    description: "Plan new lane for upcoming residential development",
    reportedBy: "Kavita Nair",
    date: "2024-11-18",
    location: "Temple Road, Dadar",
    status: "pending",
    priority: "low"
  }
];

export default function RoadsSection() {
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
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "drawn":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "surveyed":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "pending":
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

  const displayedRoadIssues = showAll ? sampleRoadIssues : sampleRoadIssues.slice(0, 3);

  return (
    <section
      id="roads"
      ref={sectionRef}
      className={`py-24 px-4 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center gap-4 mb-12">
          <Pencil className="h-12 w-12 text-primary" />
          <h2 
            className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            data-testid="text-roads-title"
          >
            roads to be drawn»
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <p className="text-xl text-muted-foreground max-w-3xl">
            Community-reported road requirements help us plan better infrastructure. All requests are surveyed and mapped for future development.
          </p>
          
          {!showAll && (
            <Button
              variant="default"
              size="lg"
              className="shadow-xl"
              onClick={() => window.location.href = '/roads-to-be-drawn'}
              data-testid="button-view-all-roads"
            >
              View all road plans →
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRoadIssues.map((issue) => (
            <Card 
              key={issue.id} 
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg line-clamp-2 flex-1">{issue.title}</h3>
                  <Badge className={getPriorityColor(issue.priority)}>
                    {issue.priority}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {issue.description}
                </p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{issue.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="truncate">{issue.reportedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(issue.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge className={getStatusColor(issue.status)}>
                    {issue.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
