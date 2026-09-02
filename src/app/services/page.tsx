"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, AlertCircle, Loader2 } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  price: number;
  rating: number;
  provider: string;
  location: string;
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchServices = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1200));
      
      const mockData: ServiceItem[] = [
        { id: "web-development", title: "Full-Stack Web Development", price: 150, rating: 4.8, provider: "Alex Johnson", location: "Remote" },
        { id: "seo-optimization", title: "Advanced SEO Optimization", price: 80, rating: 4.5, provider: "Sarah Smith", location: "New York" },
        { id: "logo-design", title: "Custom Logo Design", price: 200, rating: 5.0, provider: "Creative Studio", location: "Remote" },
      ];
      setServices(mockData);
    } catch (err) {
      setError("Failed to load services.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter((s) => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Explore Services</h1>
          <p className="text-muted-foreground mt-1">Find the perfect professional for your next project.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[200px] rounded-xl border bg-muted/20 animate-pulse"></div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-destructive/5 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchServices}>Try Again</Button>
        </div>
      )}

      {!isLoading && !error && filteredServices.length === 0 && (
        <div className="text-center py-20 border rounded-lg bg-card">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2 text-foreground">No services found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find any services matching "{searchQuery}".</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      )}

      {!isLoading && !error && filteredServices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`} className="group block">
              <div className="h-full flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">by {service.provider}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {service.rating}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {service.location}</span>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg text-foreground">
                    ${service.price.toFixed(2)}
                  </span>
                  <Button variant="secondary" size="sm">View Details</Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}