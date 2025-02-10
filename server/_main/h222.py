import yt_dlp
import os

def get_audio_url(video_url, output_folder="downloads"):
    try:
        # Ensure the output folder exists
        os.makedirs(output_folder, exist_ok=True)

        audio_opts = {
            'quiet': True,
            'format': 'bestaudio/best',
            'outtmpl': f'{output_folder}/%(title)s.%(ext)s',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }

        with yt_dlp.YoutubeDL(audio_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            filename = ydl.prepare_filename(info).replace('.webm', '.mp3').replace('.m4a', '.mp3')

        return {"filePath": filename, "title": info.get("title", "unknown")}

    except Exception as e:
        print(f"Error downloading audio: {str(e)}")
        return {"error": str(e)}


def get_video_url(video_url):
    try:
        video_opts = {
            'quiet': True,
            'extract_flat': False,
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
        }

        with yt_dlp.YoutubeDL(video_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            formats = info.get('formats', [])

            video_formats = [
                f for f in formats
                if f.get('vcodec', 'none') != 'none' and (f.get('height', 0) or 0) > 0
            ]
            video_formats.sort(key=lambda x: (x.get('height', 0) or 0), reverse=True)

            video_url = None
            for format in video_formats:
                if url := format.get('url'):
                    video_url = {
                        "streamUrl": url,
                        "resolution": f"{format.get('height')}p",
                        "format": format.get('format_id'),
                        "ext": format.get('ext')
                    }
                    break

            if not video_url:
                video_url = {"streamUrl": info.get('url'), "resolution": "unknown"}

            return video_url

    except Exception as e:
        print(f"Error extracting video URL: {str(e)}")
        return {"error": str(e)}

def get_media_urls(video_url):
    video_data = get_video_url(video_url)
    audio_data = get_audio_url(video_url)

    return {
        "video": video_data,
        "audio": audio_data
    }

# Test the function
if __name__ == "__main__":
    video_url = "https://youtu.be/W5P8GlaEOSI?si=_bO56QUa65W9PFkI"
    print(get_media_urls(video_url))
