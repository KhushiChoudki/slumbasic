import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, User, MapPin } from "lucide-react";

interface UploadItem {
  id: number;
  title: string;
  uploadedBy: string;
  date: string;
  location: string;
  status: "pending" | "verified" | "processed";
  imageUrl: string;
}

const sampleUploads: UploadItem[] = [
  {
    id: 1,
    title: "Road Layout - Dharavi District",
    uploadedBy: "Rajesh Kumar",
    date: "2024-11-18",
    location: "Dharavi, Mumbai",
    status: "verified",
    imageUrl: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Road+Layout+1"
  },
  {
    id: 2,
    title: "Community Street View",
    uploadedBy: "Priya Sharma",
    date: "2024-11-19",
    location: "Andheri, Mumbai",
    status: "pending",
    imageUrl: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Street+View+2"
  },
  {
    id: 3,
    title: "Aerial Settlement Image",
    uploadedBy: "Amit Patel",
    date: "2024-11-19",
    location: "Bandra, Mumbai",
    status: "processed",
    imageUrl: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Aerial+View+3"
  },
  {
    id: 4,
    title: "Urban Development Area",
    uploadedBy: "Sunita Desai",
    date: "2024-11-20",
    location: "Borivali, Mumbai",
    status: "verified",
    imageUrl: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Urban+Area+4"
  },
  {
    id: 5,
    title: "Road Infrastructure Update",
    uploadedBy: "Vikram Singh",
    date: "2024-11-20",
    location: "Powai, Mumbai",
    status: "pending",
    imageUrl: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Infrastructure+5"
  },
  {
    id: 6,
    title: "Community Layout Plan",
    uploadedBy: "Anjali Mehta",
    date: "2024-11-20",
    location: "Goregaon, Mumbai",
    status: "processed",
    imageUrl: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Layout+Plan+6"
  }
];

export default function UploadsSection() {
  const [isVisible, setIsVisible] = useState(false);
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
      case "verified":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "processed":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <section
      id="uploads"
      ref={sectionRef}
      className={`py-24 px-4 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center gap-4 mb-12">
          <Upload className="h-12 w-12 text-primary" />
          <h2 
            className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            data-testid="text-uploads-title"
          >
            uploads»
          </h2>
        </div>

        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          View all uploaded images and satellite data from the community. These uploads help us create better road layouts and infrastructure plans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleUploads.map((upload) => (
            <Card 
              key={upload.id} 
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={upload.imageUrl}
                  alt={upload.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge 
                  className={`absolute top-3 right-3 ${getStatusColor(upload.status)}`}
                >
                  {upload.status}
                </Badge>
              </div>
              
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-1">{upload.title}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{upload.uploadedBy}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{upload.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(upload.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
