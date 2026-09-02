"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Calendar, Star, MapPin } from "lucide-react";

// Mock interface for Service data
interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  location: string;
  provider: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceSlug = params.service as string;

  const [service, setService] = React.useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isBooking, setIsBooking] = React.useState<boolean>(false);

  React.useEffect(() => {
    let isMounted = true;

    const fetchServiceDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Mock "Not Found" state logic for specific slugs
        if (serviceSlug === "unknown-service") {
          if (isMounted) setService(null);
          return;
        }

        // Mock successful data fetch
        if (isMounted) {
          setService({
            id: serviceSlug,
            title: serviceSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            description: "This is a detailed description of the service. It outlines the deliverables, expectations, and why you should book this provider. We pride ourselves on delivering high-quality results tailored to your specific needs.",
            price: 150.00,
            rating: 4.8,
            location: "Remote",
            provider: "Alex Johnson",
          });
        }
      } catch (err) {
        if (isMounted) setError("Failed to load service details.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (serviceSlug) {
      fetchServiceDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [serviceSlug]);

  const handleBookNow = async () => {
    setIsBooking(true);
    // Simulate booking action
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBooking(false);
    alert("Booking successful! (Mock action)");
  };

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6 -ml-2 text-muted-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Services
      </Button>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">Loading service details...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-8 text-center border border-destructive/20 bg-destructive/5 rounded-lg">
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      )}

      {/* Not Found State */}
      {!isLoading && !error && !service && (
        <div className="text-center py-16 border rounded-lg bg-card">
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The service you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => router.push("/services")}>Browse All Services</Button>
        </div>
      )}

      {/* Success / Populated State */}
      {!isLoading && !error && service && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {service.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  {service.rating} (124 reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {service.location}
                </span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-2 text-foreground">About this service</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-8 rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">Starting at</p>
                <p className="text-3xl font-bold text-foreground">${service.price.toFixed(2)}</p>
              </div>
              
              <div className="space-y-4 mb-6 text-sm text-muted-foreground">
                <div className="flex justify-between border-b pb-2">
                  <span>Provider</span>
                  <span className="font-medium text-foreground">{service.provider}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Delivery Time</span>
                  <span className="font-medium text-foreground">3 Days</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                disabled={isBooking}
                onClick={handleBookNow}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}