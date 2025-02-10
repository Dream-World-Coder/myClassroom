import yt_dlp

def get_audio_url(video_url):
    ydl_opts = {
        'format': 'bestaudio/best',  # Prefer audio-only formats
        'extract_flat': True,
        'quiet': False,
        # Additional options to ensure we get audio
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            # Get the audio format URL
            formats = info.get('formats', [])
            # Filter for audio-only formats
            audio_formats = [f for f in formats if f.get('acodec') != 'none' and f.get('vcodec') == 'none']

            if audio_formats:
                # Get the best quality audio format
                best_audio = audio_formats[-1]
                audio_url = best_audio.get('url')
                if audio_url:
                    print(f"Direct Audio Stream URL: {audio_url}")
                    return audio_url

            print("No audio-only stream found, falling back to best available format")
            # Fallback to best available format if no audio-only stream is found
            stream_url = info.get('url')
            if stream_url:
                print(f"Direct Stream URL: {stream_url}")
                return stream_url

            raise Exception("No valid audio stream found")

    except Exception as e:
        print(f"Error extracting audio URL: {str(e)}")
        return None

def get_video_url(video_url):
    print(f"Streaming video from: {video_url}")

    ydl_opts = {
        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",

        # donot Show progress
        "quiet": True,
        "verbose": False,
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

def get_direct_url(video_url="https://youtu.be/aXRTczANuIs?si=ko62xKGGp-ACtB6c"):
    direct_vid_url = get_video_url(video_url)
    direct_audio_url = get_audio_url(video_url)

    return (direct_vid_url, direct_audio_url)


if __name__ == "__main__":
    result = get_direct_url()
    print("\nResult:", result)
