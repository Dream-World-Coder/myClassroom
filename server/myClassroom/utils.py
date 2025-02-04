import yt_dlp
from datetime import timedelta

def extract_playlist_videos(playlist_url):
    """
    Extracts all videos from a YouTube playlist and returns details in JSON format.
    """
    ydl_opts = {'extract_flat': True}
    video_data_list = []

    def seconds_to_hms_alt(seconds):
        return str(timedelta(seconds=seconds))

    def extract_video_details(video_url):
        """
        Extracts information about a single video.
        """
        ydl_opts = {}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False) or {}
            return {
                "videoUrl": video_url,
                "videoTitle": info.get('title', 'Title not available'),
                "videoThumbnailUrl": info.get('thumbnail', 'Thumbnail not available'),
                "videoDuration": seconds_to_hms_alt(float(info['duration'])) or 'Duration not available'
            }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        playlist_info = ydl.extract_info(playlist_url, download=False) or {}

        for entry in playlist_info.get('entries', []):
            video_details = extract_video_details(entry['url'])
            video_data_list.append(video_details)

    return video_data_list


if __name__ == "__main__":
    playlist_url = "https://youtube.com/playlist?list=PLIDpKxpqzb0EIpV2oWskXF65U0uWbS4ts&si=KHYHjhn0D1a5iqvd"
    playlist_json = extract_playlist_videos(playlist_url)

    print(playlist_json)
