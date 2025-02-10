from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token
from werkzeug.security import generate_password_hash
from myClassroom import mongo
from myClassroom.models import User
from .utils import extract_playlist_videos, get_media_urls_async
import datetime
import yt_dlp
import re

# Andrew NG

api_bp = Blueprint("api_bp", __name__)


@api_bp.route('/')
def api_home():
    return "API Working", 200


# Authentication
# -----------------
def is_valid_password(password):
    return re.match(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$', password) is not None

@api_bp.route("/register", methods=['POST'])
def register_user():
    data = request.json or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    deviceInfo = data.get("deviceInfo") or None
    ipAddress = request.remote_addr
    loginTime = datetime.datetime.utcnow()

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are mandatory."}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered."}), 400
    if mongo.db.users.find_one({"username": username}):
        return jsonify({"error": "Username already taken."}), 400

    if not is_valid_password(password):
        return jsonify({"error": "Password must be 8-16 characters, include at least 1 uppercase letter and 1 number."}), 400

    # Create new user
    new_user = User(
        username=username,
        email=email,
        password=generate_password_hash(password),
        ipAddress=ipAddress,
        deviceInfo=deviceInfo,
        lastFiveLogin=[loginTime.isoformat()]
    )
    new_user.save()

    access_token = create_access_token(identity=email)
    return jsonify({"token":access_token}), 200
    # return jsonify({"message": "Registration successful", "user_id": new_user.id}), 201

@api_bp.route("/login", methods=['POST'])
def login_user():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are mandatory."}), 400

    user_data = mongo.db.users.find_one({"email": email})
    if not user_data:
        return jsonify({"error": "User not found. Check provided data again or SignUp if new."}), 401

    user_data["_id"] = str(user_data["_id"])
    user = User(**user_data)

    if not user.check_password(password):
        return jsonify({"error": "Invalid password."}), 401

    # Update login history
    user.update_last_login()

    access_token = create_access_token(identity=email)
    return jsonify({"token":access_token}), 200
    # return jsonify({"message": "Login successful", "user_id": user.id}), 200

@api_bp.route('/u', methods=["GET"])
@jwt_required()
def get_user_data():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)

    if not user:
        return jsonify({'error':'user not found'}), 404

    return jsonify({
        "username": user.username,
        "email": user.email,
        "profileImg": user.profileImg or '',
        "actualName": user.actualName,
        "schoolName": user.schoolName,
        "address": user.address,
        "currentClass": user.currentClass,
        "lastFiveLogin": user.lastFiveLogin,
        "courses": user.courses,
        "continuingCourse":user.continuingCourse or ''
    }), 200

@api_bp.route('/u/update', methods=["POST"])
@jwt_required()
def update_user_data():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)

    if not user:
        return jsonify({'error':'user not found'}), 404

    data = request.json or {}
    print(data)

    try:
        actualName = data.get('actualName')
        schoolName =  data.get('schoolName')
        address = data.get('address')
        currentClass = data.get('currentClass')

        user.update_additional_details(actualName, schoolName, address, currentClass)

        return jsonify({"message": "user details updated"}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


# Add / Update course
# -----------------
@api_bp.route("/extract-videos-and-save-in-db", methods=['POST'])
@jwt_required()
def extract_videos_from_url():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)
    data = request.json or {}

    course_name = data.get("courseName")
    course_organiser = data.get("courseOrganiser")
    course_duration = data.get("courseDuration")
    course_url = data.get("courseUrl")
    course_materials = data.get("studyMaterials")

    if not course_name or not course_url:
        return jsonify({"error": "Course name and URL are mandatory."}), 400

    if not course_url.startswith("https://www.youtube.com/playlist?list="):
        return jsonify({"error": "Provide a valid YouTube playlist URL."}), 400

    try:
        playListData = extract_playlist_videos(playlist_url=course_url)

        if not playListData:
            return jsonify({"error": "Error extracting videos from playlist URL"}), 400

        if user:
            user.update_course(
                courseName=course_name,
                courseUrl=course_url,
                videos=playListData,
                courseOrganiser=course_organiser,
                courseDuration=course_duration,
                courseMaterials=course_materials
            )
            return jsonify({"message": "Course saved/updated successfully!", "playListData": playListData}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"\n\nError: {e}\n")
        return jsonify({"error": "Internal Server Error"}), 500


# all courses
# -----------------
@api_bp.route("/courses", methods=['GET'])
@jwt_required()
def get_courses():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)

    try:
        if user:
            allCoursesData = user.get_courses()
            if not allCoursesData:
                return jsonify({"error": "Error extracting courses"}), 400

            return jsonify({"message": "Success", "courses": allCoursesData}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"\n\nError: {e}\n")
        return jsonify({"error": "Internal Server Error"}), 500

# specific course
# -----------------
@api_bp.route("/courses/<course_id>", methods=['GET'])
@jwt_required()
def send_course_data(course_id):
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)

    if not course_id:
        return jsonify({"error":"could not get course id"}), 400

    if not user:
        return jsonify({"error": "User Not Found"}), 404

    try:
        if user:
            # validate course_id --> later
            courseData = user.get_course_data(course_id=course_id)

            if not courseData:
                return jsonify({"error": "Error extracting course data"}), 400

            return jsonify({"message": "Success", "courseData": courseData}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"\n\nError: {e}\n")
        return jsonify({"error": "Internal Server Error"}), 500


# get direct video url
# ----------------
@api_bp.route("/stream/low", methods=["POST"])
@jwt_required()
def get_stream_url_decent():
    print("\n\n\nI am called \n\n")
    # current_user_email = get_jwt_identity()
    # user = User.find_by_email(current_user_email)
    # if not user:
    #     return jsonify({"error": "User Not Found"}), 404

    data = request.json or {}
    video_url = data.get("videoUrl")
    if not video_url:
        return jsonify({"error": "Video URL not found"}), 400

    ydl_opts = {
        "format": "best[ext=mp4]/best",
        "quiet": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)
        stream_url = info.get("url")
        return jsonify({"streamUrl": stream_url})

        if not stream_url:
            print("No valid stream URL found!")
            return jsonify({"error": "No valid video stream"}), 500


@api_bp.route("/stream/high", methods=["POST"])
@jwt_required()
async def get_stream_url_high():
    data = request.json or {}
    video_url = data.get("videoUrl")
    if not video_url:
        return jsonify({"error": "Video URL not found"}), 400

    try:
        direct_video_link, direct_audio_link = await get_media_urls_async(video_url)
        if not direct_video_link or not direct_audio_link:
            return jsonify({"error": "Failed to retrieve media URLs"}), 500

        directLinks = {
            "videoLink": direct_video_link,
            "audioLink": direct_audio_link
        }
        return jsonify({"directLinks": directLinks}), 200
    except Exception as e:
        print(f"Error in get_stream_url_high: {e}")
        return jsonify({"error": f"Error: {e}"}), 500





# video watched
# ---------------------
@api_bp.route("/video-watch-status", methods=['POST', 'GET'])
@jwt_required()
def set_video_state():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)

    if not user:
        return jsonify({"error": "User Not Found"}), 404

    if request.method == "GET":
        videoId = request.args.get('videoId')
        if not videoId:
            return jsonify({"error": "Missing videoUrl parameter"}), 400

        video_url = f'https://www.youtube.com/watch?v={videoId}'
        video = user.find_video_by_url(video_url)
        if not video:
            return jsonify({"error": "Video not found"}), 404

        return jsonify({"watchStatus": str(video.get('watched', False))}), 200

    if request.method == "POST":
        data = request.json or {}
        videoId = data.get('videoId')
        new_status = data.get('newStatus')
        # true = True js-python auto fixes it [python fixes automatically, js not]

        if not videoId or new_status is None:
            return jsonify({"error": "Missing videoUrl or newStatus in request"}), 400

        video_url = f'https://www.youtube.com/watch?v={videoId}'
        video = user.find_video_by_url(video_url)
        if not video:
            return jsonify({"error": "Video not found"}), 404

        user.update_video(video_url, new_status) # update all video with same url, no matter the course

        user.update_course_progress() # course progress
        return jsonify({"message": "Watch status updated", "watchStatus": new_status}), 200

    else:
        return jsonify({'error': 'Method not allowed'}), 405



# Error handler
# -----------------
@api_bp.errorhandler(Exception)
def handle_exception(e):
    print(f"\n\nError: {e}\n")
    return {"error": str(e)}, 500
