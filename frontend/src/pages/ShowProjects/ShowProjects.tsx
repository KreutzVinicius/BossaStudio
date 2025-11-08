import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@assets/components/ui/carousel";

import {
  Card,
  CardContent,
} from "@assets/components/ui/card";

import { fetchFiles, fetchImageBlobUrl } from "../../services/driveApi";

type ProjectImage = {
  id: string;
  name: string;
  url: string;
};

const ROOT_FOLDER_ID = import.meta.env.VITE_DEFAULT_DRIVE_FOLDER;

const ShowProjects = () => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const objectUrls: string[] = [];

    async function loadImages() {
      if (isMounted) {
        setImages([]);
      }
      setLoading(true);
      setError(null);

      try {
        const files = await fetchFiles(ROOT_FOLDER_ID);
        const imageFiles = files.filter((file) => file.mimeType?.startsWith("image/"));

        if (isMounted) {
          setImages(
            imageFiles.map((file) => ({
              id: file.id,
              name: file.name,
              url: "",
            })),
          );
          setLoading(false);
        }

        await Promise.all(
          imageFiles.map(async (file) => {
            try {
              const url = await fetchImageBlobUrl(file.id);
              if (!isMounted) {
                URL.revokeObjectURL(url);
                return;
              }
              objectUrls.push(url);

              if (isMounted) {
                setImages((prev) =>
                  prev.map((image) =>
                    image.id === file.id ? { ...image, url } : image,
                  ),
                );
              }
            } catch (imageError) {
              console.error("Failed to fetch image blob:", imageError);
            }
          }),
        );
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load images.";
          setError(message);
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div>
      <Carousel
        opts={{ align: "start" }}
        className="w-full max-w-3xl mx-auto"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={`image-${index}`}
              className="md:basis-1/2 lg:basis-1/3 px-2"
            >
              <div className="p-2 h-full">
                <Card className="h-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full max-h-48 object-contain rounded-md shadow mb-4"
                      />
                    ) : (
                      <div className="w-full max-h-48 h-48 bg-muted animate-pulse rounded-md shadow mb-4" />
                    )}
                    <span className="text-4xl font-bold text-blue-700">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
        <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
      </Carousel>
      {loading && <p className="text-center mt-4 text-sm text-muted-foreground">Loading images...</p>}
      {error && <p className="text-center mt-4 text-sm text-destructive">{error}</p>}
      {!loading && !error && images.length === 0 && (
        <p className="text-center mt-4 text-sm text-muted-foreground">No images available.</p>
      )}
    </div>
  );
};

export default ShowProjects;
