import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    School,
    MapPin,
    GraduationCap,
    Pencil,
    Check,
    X,
    BookOpen,
    Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "../../components/Headers/Header";
import LogoutButton from "./components";

const ProfilePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    const [activeLink, setActiveLink] = useState("Profile");
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        profileImg: "",
        username: "johndoe123",
        email: "john.doe@example.com",
        phone: null,
        age: null,
        actualName: null,
        schoolName: null,
        address: null,
        currentClass: null,
        courses: [],
        lastFiveLogin: [],
    });

    const [editedProfile, setEditedProfile] = useState(profile);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile(profile);
    };

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
        async function updateUserData() {
            try {
                if (!token) {
                    console.error("\n\nAuthorisation token is NULL.");
                    return;
                }
                const response = await fetch(
                    `http://127.0.0.1:5050/api/v1/u/update`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            actualName: profile.actualName,
                            schoolName: profile.schoolName,
                            address: profile.address,
                            currentClass: profile.currentClass,
                        }),
                    },
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || "Failed to fetch course data",
                    );
                }
                const data = await response.json();
                console.log(data.message);
            } catch (err) {
                console.error("Error fetching course data:", err);
            }
        }
        updateUserData();
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile(profile);
    };

    const handleInputChange = (fieldId, value) => {
        setEditedProfile((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const dd = date.getDate().toString().padStart(2, "0");
        const mm = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 because months are 0-indexed
        const yy = date.getFullYear().toString().slice(-2);
        const hrs = date.getHours().toString().padStart(2, "0");
        const mins = date.getMinutes().toString().padStart(2, "0");

        return `${dd}-${mm}-${yy} ${hrs}:${mins}`;
    };

    useEffect(() => {
        // fetch user data and set setProfile
        async function fetchUserData() {
            try {
                if (!token) {
                    console.error("\n\nAuthorisation token is NULL.");
                    return;
                }
                const response = await fetch(`http://127.0.0.1:5050/api/v1/u`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || "Failed to fetch course data",
                    );
                }
                const data = await response.json();
                await setProfile(data);
            } catch (err) {
                console.error("Error fetching course data:", err);
            }
        }
        fetchUserData();
    }, [token]);

    const profileFields = [
        // handle seperately cuz email is gonna be fixed -> no change
        // and for username and password change you hvae to re enter the password,
        // localhost:5050/api/v1/u/change-password, /api/v1/u/change-username
        // {
        //     id: "username",
        //     label: "Username",
        //     icon: User,
        //     placeholder: "Enter username",
        // },
        // {
        //     id: "email",
        //     label: "Email",
        //     icon: Mail,
        //     placeholder: "Enter email address",
        // },
        {
            id: "phone",
            label: "Phone",
            icon: Phone,
            placeholder: `${profile.phoneNumber || "your phone number"}`,
        },
        {
            id: "actualName",
            label: "Full Name",
            icon: User,
            placeholder: `${profile.actualName || "your full name"}`,
        },
        {
            id: "schoolName",
            label: "School Name",
            icon: School,
            placeholder: `${profile.schoolName || "your school name"}`,
        },
        {
            id: "currentClass",
            label: "Current Class",
            icon: BookOpen,
            placeholder: `${profile.currentClass || "your current class of studying"}`,
        },
        {
            id: "address",
            label: "Address",
            icon: MapPin,
            placeholder: `${profile.address || "your address"}`,
        },
        {
            id: "age",
            label: "Age",
            icon: GraduationCap,
            placeholder: `${profile.age || "Enter your age"}`,
        },
    ];

    const ProfileField = ({ field }) => (
        <div>
            <label
                className={`text-sm font-medium block mb-1.5 ${
                    isDarkMode ? "text-stone-300" : "text-stone-600"
                }`}
            >
                {field.label}
            </label>
            <div className="flex items-center gap-2">
                <field.icon className="w-4 h-4 text-stone-400" />
                <Input
                    value={editedProfile[field.id] || ""}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                    }
                    disabled={!isEditing}
                    className={
                        isDarkMode
                            ? "bg-[#111] border-zinc-700"
                            : "border-slate-300"
                    }
                />
            </div>
        </div>
    );

    return (
        <>
            <Header
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
            />
            <div
                className={`min-h-screen p-6 ${isDarkMode ? "bg-[#111] text-white" : "bg-gray-50 text-black"}`}
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header Card */}
                    <Card
                        className={
                            isDarkMode
                                ? "bg-[#111] border-[#222]"
                                : "bg-white border-gray-200"
                        }
                    >
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage
                                        src={
                                            profile.profileImg ||
                                            "https://picsum.photos/200"
                                        }
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {profile.username
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h1
                                                className={`text-2xl font-semibold mb-2 ${
                                                    isDarkMode
                                                        ? "text-stone-100"
                                                        : "text-stone-900"
                                                }`}
                                            >
                                                {profile.username}
                                            </h1>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        isDarkMode
                                                            ? "border-stone-600"
                                                            : ""
                                                    }
                                                >
                                                    {/* {profile.age} */}
                                                    Student
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        isDarkMode
                                                            ? "border-stone-600"
                                                            : ""
                                                    }
                                                >
                                                    {profile.courses.length}{" "}
                                                    Courses Enrolled
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-6">
                                            <div
                                                className={`flex gap-2 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
                                            >
                                                {isEditing ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={handleSave}
                                                            className="gap-1"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            Save
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={
                                                                handleCancel
                                                            }
                                                            className="gap-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleEdit}
                                                        className="gap-1"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        Edit Profile
                                                    </Button>
                                                )}
                                            </div>
                                            <LogoutButton
                                                isDarkMode={isDarkMode}
                                                handleLogout={handleLogout}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div
                                            className={`flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-stone-300"
                                                    : "text-stone-600"
                                            }`}
                                        >
                                            <Mail className="w-4 h-4" />
                                            {profile.email}
                                        </div>
                                        <div
                                            className={`flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-stone-300"
                                                    : "text-stone-600"
                                            }`}
                                        >
                                            <Clock className="w-4 h-4" />
                                            Last login{" "}
                                            {formatDate(
                                                profile.lastFiveLogin[4],
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details Card */}
                    <Card
                        className={
                            isDarkMode
                                ? "bg-[#111] border-[#222]"
                                : "bg-white border-gray-200"
                        }
                    >
                        <CardHeader>
                            <CardTitle
                                className={isDarkMode ? "text-stone-100" : ""}
                            >
                                Profile Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {profileFields.map((field, index) => (
                                    <ProfileField
                                        key={field.id}
                                        field={field}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
