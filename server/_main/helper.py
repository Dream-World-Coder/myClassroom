import yt_dlp

def get_direct_url(video_url="https://youtu.be/aXRTczANuIs?si=ko62xKGGp-ACtB6c"):
    print(f"Streaming video from: {video_url}")

    ydl_opts = {
        # Simplified format selection to avoid None comparison issues
        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",

        # Show progress
        "quiet": False,
        "verbose": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)

            # Get available formats
            formats = info.get('formats', [])

            # Filter and sort formats
            video_formats = []
            for f in formats:
                # Check if it's a video format
                if f.get('vcodec', 'none') != 'none':
                    # Get height, defaulting to 0 if None
                    height = f.get('height', 0) or 0

                    # Only include formats with height > 0
                    if height > 0:
                        video_formats.append(f)

            # Sort by resolution (highest first)
            video_formats.sort(key=lambda x: (x.get('height', 0) or 0), reverse=True)

            print("\nAvailable video formats:")
            for f in video_formats:
                height = f.get('height', 'N/A')
                fps = f.get('fps', 'N/A')
                ext = f.get('ext', 'N/A')
                vcodec = f.get('vcodec', 'N/A')
                format_id = f.get('format_id', 'N/A')
                filesize = f.get('filesize', 'N/A')

                print(f"Format: {format_id} - "
                      f"Resolution: {height}p - "
                      f"Extension: {ext} - "
                      f"FPS: {fps} - "
                      f"Codec: {vcodec}")

            # Try to get the best format URL
            for format in video_formats:
                url = format.get('url')
                if url:
                    print(f"\nSelected format: {format.get('format_id')} - "
                          f"Resolution: {format.get('height')}p - "
                          f"Extension: {format.get('ext')}")
                    return {"streamUrl": url}

            # If no URL found in formats, try the main URL
            stream_url = info.get('url')
            if stream_url:
                return {"streamUrl": stream_url}

            print("No valid stream URL found!")
            return {"error": "No valid video stream"}, 500

    except Exception as e:
        print(f"Error extracting video info: {str(e)}")
        return {"error": str(e)}, 500

if __name__ == "__main__":
    result = get_direct_url()
    print("\nResult:", result)
