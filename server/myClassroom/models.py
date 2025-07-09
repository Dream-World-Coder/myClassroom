from bson import ObjectId
from myClassroom import mongo
from werkzeug.security import check_password_hash
from datetime import datetime
from random import randint
import re

course_thumbnails:list = [
    "/images/courseThumbnails/1.jpg",
    "/images/courseThumbnails/2.jpg",
    "/images/courseThumbnails/3.jpg",
    "/images/courseThumbnails/4.jpg",
    "/images/courseThumbnails/5.jpg",
    "/images/courseThumbnails/6.jpg",
];
profile_images:list = [
    "/images/profilePics/cat.svg",
    "/images/profilePics/fox.svg",
    "/images/profilePics/beetle.svg",
    "/images/profilePics/chick.svg",
    "/images/profilePics/blossom.svg",
    "/images/profilePics/beaver.svg",
];

class User():
    def __init__(self, username, email, password, ipAddress, deviceInfo, _id=None, actualName=None, schoolName=None,
                 address=None, currentClass=None, lastFiveLogin=None, courses=None, profileImg=None, continuingCourse=None):
        self.id = str(_id) if _id else None
        self.username = username
        self.email = email
        self.password = password
        self.ipAddress = ipAddress
        self.deviceInfo = deviceInfo
        self.actualName = actualName
        self.schoolName = schoolName
        self.address = address
        self.currentClass = currentClass
        self.lastFiveLogin = lastFiveLogin if lastFiveLogin else []
        self.courses = courses if courses else []
        self.profileImg = profile_images[randint(0, len(course_thumbnails)-1)] if not profileImg else profileImg
        self.continuingCourse = continuingCourse

    def save(self):
        """Save user to MongoDB"""
        user_data = {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "ipAddress": self.ipAddress,
            "deviceInfo": self.deviceInfo,
            "actualName": self.actualName,
            "schoolName": self.schoolName,
            "address": self.address,
            "currentClass": self.currentClass,
            "lastFiveLogin": self.lastFiveLogin,
            "courses": self.courses,
            "profileImg":self.profileImg,
            "continuingCourse":self.continuingCourse
        }

        if self.id:
            mongo.db.users.update_one({"_id": ObjectId(self.id)}, {"$set": user_data})
        else:
            inserted_id = mongo.db.users.insert_one(user_data).inserted_id
            self.id = str(inserted_id)

    def get_courses(self):
        try:
            user_dictionary = mongo.db.users.find_one({'username': self.username})
            return user_dictionary['courses']
        except Exception as e:
            print(e)
            return None

    def update_course_progress(self):
        user_dictionary = mongo.db.users.find_one({'username': self.username})
        courses = user_dictionary['courses']

        try:
            for (index, course) in enumerate(courses):
                total_lectures = int(course['noOfLectures'])
                watched_lectures = 0

                for video in course['videos']:
                    if video['watched'] is True:
                        watched_lectures+=1

                progress = int((watched_lectures / total_lectures) * 100)
                # print(f"\n{total_lectures=}\n{watched_lectures=}\n{progress=}")
                mongo.db.users.update_one(
                    {
                        "username": self.username,
                        f"courses.{index}": {"$exists": True}
                    },
                    {
                        "$set": {f"courses.{index}.progress": f'{progress}%'}
                    },
                )
            return True
        except Exception:
            print(Exception)
            return False


    def get_course_data(self, course_id):
        course_id = int(course_id) - 1
        try:
            # uncomment if error needed for ui testings
            # if course_id not in range(0, len(mongo.db.users.find_one({'username': self.username}).courses)):
            user_dictionary = mongo.db.users.find_one({'username': self.username})
            if course_id not in range(0, len(user_dictionary['courses'])):
                print("not in range")
                return None
            return user_dictionary['courses'][course_id]
        except Exception as e:
            print(e)
            return None

    def find_video_by_url(self, video_url):
        try:
            pipeline = [
                    {"$match": {"username": self.username}},
                    {"$unwind": "$courses"},
                    {"$unwind": "$courses.videos"},
                    {"$match": {"courses.videos.videoUrl": video_url}},
                    {"$project": {"_id": 0, "courses.videos": 1}},
                ]
            result =  list(mongo.db.users.aggregate(pipeline))
            return result[0].get('courses').get('videos')

        except Exception as e:
            print(f"Error: {e}");
            return None

    def update_video(self, video_url, new_status):
        try:
            mongo.db.users.update_many(
                {
                    "username": self.username,
                    "courses.videos.videoUrl": video_url
                },
                {
                    "$set": {"courses.$[].videos.$[vid].watched": new_status}
                },
                array_filters=[{"vid.videoUrl": video_url}]
            )
            return True  # success
        except Exception as e:
            print(f"Error updating video: {e}")
            return False  # fail

    @staticmethod
    def find_by_email(email):
        user = mongo.db.users.find_one({"email": email})
        return User(**user) if user else None

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def update_last_login(self):
        """Add the current timestamp to lastFiveLogin and maintain only the last 5 logins"""
        self.lastFiveLogin.append(datetime.utcnow().isoformat())
        if len(self.lastFiveLogin) > 5:
            self.lastFiveLogin.pop(0)
        self.save()

    def update_additional_details(self, actualName, schoolName,address,currentClass):
        self.actualName = actualName
        self.schoolName = schoolName
        self.address = address
        self.currentClass = currentClass
        self.save()

    def add_course(self, courseName, courseUrl, videos, courseOrganiser=None, courseDuration=None, course_materials=None):
        """Add a new course to the user"""
        new_course = {
            "courseName": courseName,
            "courseUrl": courseUrl,
            "progress": "0%",
            "videos": videos,
            "noOfLectures": len(videos),
            "courseOrganiser": courseOrganiser,
            "courseDuration": courseDuration,
            "courseMaterials": course_materials,
            "courseThumbnail": course_thumbnails[randint(0, len(course_thumbnails)-1)]
        }
        self.courses.append(new_course)
        self.save()

    def update_course(self, courseName, courseUrl, videos, courseOrganiser=None, courseDuration=None, courseMaterials=None, progress=0):
        """Update course if exists, else add a new one"""
        for course in self.courses:
            if course["courseUrl"] == courseUrl:
                # update existing course
                course.update({
                    "courseName": courseName,
                    "videos": videos,
                    "noOfLectures": len(videos),
                    "progress": progress,
                    "courseOrganiser": courseOrganiser,
                    "courseDuration": courseDuration,
                    "courseMaterials": courseMaterials
                })
                self.save()
                return

        # if course not found, add a new one
        self.add_course(courseName, courseUrl, videos, courseOrganiser, courseDuration, courseMaterials)

    @staticmethod
    def is_valid_email(email):
        """Validate email format"""
        return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None
