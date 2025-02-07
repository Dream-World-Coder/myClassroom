import { useState } from "react";
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
    Building,
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

const ProfilePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => JSON.parse(localStorage.getItem("isDarkModeOn")) || false,
    );
    const [activeLink, setActiveLink] = useState("Profile");
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        username: "johndoe123",
        email: "john.doe@example.com",
        phone: "+1 234 567 8900",
        role: "Student",
        actualName: null,
        schoolName: null,
        address: null,
        currentClass: null,
        joinDate: "January 2024",
        lastActive: "2 hours ago",
        enrolledCourses: 5,
    });

    const [editedProfile, setEditedProfile] = useState(profile);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile(profile);
    };

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
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

    const profileFields = [
        {
            id: "username",
            label: "Username",
            icon: User,
            placeholder: "Enter username",
        },
        {
            id: "email",
            label: "Email",
            icon: Mail,
            placeholder: "Enter email address",
        },
        {
            id: "phone",
            label: "Phone",
            icon: Phone,
            placeholder: "Enter phone number",
        },
        {
            id: "actualName",
            label: "Full Name",
            icon: User,
            placeholder: "Enter your full name",
        },
        {
            id: "schoolName",
            label: "School Name",
            icon: School,
            placeholder: "Enter your school name",
        },
        {
            id: "currentClass",
            label: "Current Class",
            icon: BookOpen,
            placeholder: "Enter your current class",
        },
        {
            id: "address",
            label: "Address",
            icon: MapPin,
            placeholder: "Enter your address",
        },
        {
            id: "role",
            label: "Role",
            icon: GraduationCap,
            placeholder: "Enter your role",
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
                            ? "bg-stone-700 border-stone-600"
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
                className={`min-h-screen p-6 ${isDarkMode ? "bg-stone-900 text-white" : "bg-gray-50 text-black"}`}
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header Card */}
                    <Card
                        className={
                            isDarkMode
                                ? "bg-stone-800 border-stone-700"
                                : "bg-white border-gray-200"
                        }
                    >
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src="https://picsum.photos/200" />
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
                                                {profile.actualName ||
                                                    profile.username}
                                            </h1>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <Badge variant="secondary">
                                                    {profile.role}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        isDarkMode
                                                            ? "border-stone-600"
                                                            : ""
                                                    }
                                                >
                                                    {profile.enrolledCourses}{" "}
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
                                            <Button
                                                size="sm"
                                                onClick={handleLogout}
                                                className={`border
                                                    ${
                                                        isDarkMode
                                                            ? "text-red-400 border-red-400 bg-red-400/10"
                                                            : "text-red-600 border-red-600 bg-red-600/10"
                                                    }`}
                                            >
                                                Logout
                                            </Button>
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
                                            <User className="w-4 h-4" />
                                            Member since {profile.joinDate}
                                        </div>
                                        <div
                                            className={`flex items-center gap-2 ${
                                                isDarkMode
                                                    ? "text-stone-300"
                                                    : "text-stone-600"
                                            }`}
                                        >
                                            <Clock className="w-4 h-4" />
                                            Last active {profile.lastActive}
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
                                ? "bg-stone-800 border-stone-700"
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
