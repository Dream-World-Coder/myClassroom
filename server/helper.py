import yt_dlp
import time

def get_best_video_url(video_page_url):
    try:
        ydl_opts = {
            'quiet': True,
            # Request only video-only streams in MP4 format.
            'format': 'bestvideo[ext=mp4]',
            'extract_flat': False
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_page_url, download=False)
            formats = info.get('formats', [])
            # Filter for video-only formats (audio disabled)
            video_formats = [
                f for f in formats
                if f.get('vcodec', 'none') != 'none' and f.get('acodec') == 'none'
            ]

            if not video_formats:
                raise Exception("No video-only formats found.")

            # Sort by resolution (height) in descending order
            video_formats.sort(key=lambda f: f.get('height', 0) or 0, reverse=True)
            best_video = video_formats[0]
            stream_url = best_video.get("url")
            return stream_url
            if not stream_url:
                print("error, stream_url=None")
                return None

    except Exception as e:
        print(f"Error in get_best_video_url: {e}")
        return None

def get_audio_url(video_page_url):
    ydl_opts = {
        "format": "best[ext=mp4]/best",
        "quiet": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_page_url, download=False)
        stream_url = info.get("url")
        return stream_url
        if not stream_url:
            print("error, stream_url=None")
            return None


def get_media_urls(video_page_url):
    video_s_url = get_best_video_url(video_page_url)
    video_s_url = 'get_best_video_url(video_page_url)'
    # time.sleep(5)
    audio_s_url = get_audio_url(video_page_url)
    return (video_s_url, audio_s_url)


link="https://youtu.be/rjWqEI3HOD4?si=VS8ClnkfCPvze9Qu"

l1, l2 = get_media_urls(link)

print(f"\n{l1=}\n\n{l2=}\n\n")
