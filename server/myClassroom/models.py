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

class User():
    def __init__(self, username, email, password, ipAddress, deviceInfo, _id=None, acctualName=None, schoolName=None,
                 address=None, currentClass=None, lastFiveLogin=None, courses=None):
        self.id = str(_id) if _id else None
        self.username = username
        self.email = email
        self.password = password
        self.ipAddress = ipAddress
        self.deviceInfo = deviceInfo
        self.acctualName = acctualName
        self.schoolName = schoolName
        self.address = address
        self.currentClass = currentClass
        self.lastFiveLogin = lastFiveLogin if lastFiveLogin else []
        self.courses = courses if courses else []

    def save(self):
        """Save user to MongoDB"""
        user_data = {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "ipAddress": self.ipAddress,
            "deviceInfo": self.deviceInfo,
            "acctualName": self.acctualName,
            "schoolName": self.schoolName,
            "address": self.address,
            "currentClass": self.currentClass,
            "lastFiveLogin": self.lastFiveLogin,
            "courses": self.courses
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

    def get_course_data(self, course_id):
        course_id = int(course_id) - 1
        try:
            # un comment if error needed for ui testingss
            # if course_id not in range(0, len(mongo.db.users.find_one({'username': self.username}).courses)):
            user_dictionary = mongo.db.users.find_one({'username': self.username})
            if course_id not in range(0, len(user_dictionary['courses'])):
                print("not in range")
                return None
            return user_dictionary['courses'][course_id]
        except Exception as e:
            print(e)
            return None

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
                # Update existing course
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

        # If course not found, add a new one
        self.add_course(courseName, courseUrl, videos, courseOrganiser, courseDuration, courseMaterials)

    @staticmethod
    def is_valid_email(email):
        """Validate email format"""
        return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None
