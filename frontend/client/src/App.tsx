import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import NewProject from "@/pages/NewProject";
import ProjectDetails from "@/pages/ProjectDetails";
import RoadsToBeDrawn from "@/pages/RoadsToBeDrawn";
import AreaDetail from "@/pages/AreaDetail";
import Uploads from "@/pages/Uploads";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/new" component={NewProject} />
      <Route path="/projects/:id" component={ProjectDetails} />
      <Route path="/roads-to-be-drawn" component={RoadsToBeDrawn} />
      <Route path="/roads-to-be-drawn/:areaId" component={AreaDetail} />
      <Route path="/uploads" component={Uploads} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-16">
            <Router />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
