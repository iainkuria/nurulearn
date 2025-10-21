interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => {
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (isYouTube) {
    return (
      <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={getYouTubeEmbedUrl(videoUrl)}
          title={title || "Video"}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      controls
      className="w-full rounded-lg shadow-lg"
      title={title}
    >
      Your browser does not support the video tag.
    </video>
  );
};
