import yt_dlp
from datetime import timedelta
import asyncio
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=4)

def extract_playlist_videos(playlist_url):
    ydl_opts = {'extract_flat': True}
    video_data_list = []

    def seconds_to_hms_alt(seconds):
        return str(timedelta(seconds=seconds))

    def extract_video_details(video_url, index):
        """
        Extracts information about a single video.
        """
        ydl_opts = {}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False) or {}
            return {
                "index": index,
                "watched": False,
                "videoUrl": video_url,
                "videoTitle": info.get('title', 'Title not available'),
                "videoThumbnailUrl": info.get('thumbnail', 'Thumbnail not available'),
                "videoDuration": seconds_to_hms_alt(float(info['duration'])) or 'Duration not available'
            }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        playlist_info = ydl.extract_info(playlist_url, download=False) or {}

        index:int = 0
        for entry in playlist_info.get('entries', []):
            video_details = extract_video_details(entry['url'], index)
            video_data_list.append(video_details)
            index += 1

    return video_data_list

def get_best_video_url(video_page_url):
    try:
        ydl_opts = {
            'quiet': True,
            'format': 'bestvideo[ext=mp4]',
            'extract_flat': False
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_page_url, download=False)
            formats = info.get('formats', [])
            # Filter for video-only streams (i.e. with video codec but no audio codec)
            video_formats = [
                f for f in formats
                if f.get('vcodec', 'none') != 'none' and f.get('acodec') == 'none'
            ]
            if not video_formats:
                raise Exception("No video-only formats found.")

            # Sort by resolution (height) in descending order and pick the best one.
            video_formats.sort(key=lambda f: f.get('height', 0) or 0, reverse=True)
            best_video = video_formats[0]
            stream_url = best_video.get("url")
            return stream_url
    except Exception as e:
        print(f"Error in get_best_video_url: {e}")
        return None

def get_audio_url(video_page_url):
    try:
        ydl_opts = {
            "format": "best[ext=mp4]/best",
            "quiet": True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_page_url, download=False)
            stream_url = info.get("url")
            return stream_url
    except Exception as e:
        print(f"Error in get_audio_url: {e}")
        return None

# --- Asynchronous wrappers ---

async def get_best_video_url_async(video_page_url):
    loop = asyncio.get_running_loop()
    # Run the blocking function in a thread.
    return await loop.run_in_executor(executor, get_best_video_url, video_page_url)

async def get_audio_url_async(video_page_url):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor, get_audio_url, video_page_url)

async def get_media_urls_async(video_page_url):
    # Run both tasks concurrently.
    video_task = asyncio.create_task(get_best_video_url_async(video_page_url))
    audio_task = asyncio.create_task(get_audio_url_async(video_page_url))
    video_url, audio_url = await asyncio.gather(video_task, audio_task)
    return video_url, audio_url
