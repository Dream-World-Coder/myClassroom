from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token
from werkzeug.security import generate_password_hash
from myClassroom import mongo
from myClassroom.models import User
from .utils import extract_playlist_videos
import datetime
import re
# abcde1XY
api_bp = Blueprint("api_bp", __name__)

@api_bp.route('/')
def __route_home():
    return "API Working", 200


# Authentication
# -----------------
def is_valid_password(password):
    """Check password strength"""
    return re.match(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$', password) is not None

@api_bp.route("/register", methods=['POST'])
def __route_register_user():
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
def __route_login_user():
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

@api_bp.route('/logout', methods=['POST'])
@jwt_required()
def __route_logout_user():
    print("logout-----")
    return jsonify({"message": "Logout successful"}), 200

@api_bp.route('/u', methods=["GET"])
@jwt_required()
def __route_get_user_data():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)
    return jsonify({
        "username": user.username,
        "email": user.email,
        "ipAddress": user.ipAddress,
        "deviceInfo": user.deviceInfo,
        "acctualName": user.acctualName,
        "schoolName": user.schoolName,
        "address": user.address,
        "currentClass": user.currentClass,
        "lastFiveLogin": user.lastFiveLogin,
        "courses": user.courses,
    }), 200



# Add / Update course
# -----------------
@api_bp.route("/extract-videos-and-save-in-db", methods=['POST'])
@jwt_required()
def __route_extract_videos_from_url():
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


# Error handler
# -----------------
@api_bp.errorhandler(Exception)
def handle_exception(e):
    print(f"\n\nError: {e}\n")
    return {"error": str(e)}, 500
