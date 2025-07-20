import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  School,
  MapPin,
  Pencil,
  Check,
  X,
  BookOpen,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import Header from "../../components/Headers/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "@/contexts/ThemeContext";
import { ProfileField, LogoutButton } from "./components";
import type { User as Profile } from "@/components/types";

import { formatDate } from "@/services/formatDate";

const ProfilePage = () => {
  const { isDarkMode } = useDarkMode();
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    profileImg: "",
    username: "johndoe123",
    email: "john.doe@example.com",
    actualName: null,
    schoolName: null,
    address: null,
    currentClass: null,
    courses: [],
    lastFiveLogin: [],
  });

  const [originalProfile, setOriginalProfile] = useState<Profile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalProfile(profile); // Store the original state for cancel
  };

  const handleSave = async () => {
    setIsEditing(false);
    if (profile.actualName == null) {
      toast.error("Some error occurred, Please Try again");
      return;
    }
    async function updateUserData() {
      try {
        if (!token) {
          console.error("\n\nAuthorisation token is NULL.");
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/u/update`,
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
          throw new Error(errorData.error || "Failed to fetch course data");
        }
        const data = await response.json();
        console.log(data.message);
        toast.success(data.message);
      } catch (err) {
        console.error("Error fetching course data:", err);
        toast.error(err);
      }
    }
    await updateUserData();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfile(originalProfile); // Restore the original state
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    // fetch user data and set setProfile
    async function fetchUserData() {
      try {
        if (!token) {
          console.error("\n\nAuthorisation token is NULL.");
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/u`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch course data");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    }
    fetchUserData();
  }, [token]);

  const profileFields = [
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
      label: "Current Education",
      icon: BookOpen,
      placeholder: `${profile.currentClass || "your current class of studying"}`,
    },
    {
      id: "address",
      label: "Address",
      icon: MapPin,
      placeholder: `${profile.address || "your address"}`,
    },
  ];

  return (
    <>
      <Header />
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
                <Avatar
                  className={`size-24 border p-4 ${isDarkMode ? "border-neutral-800" : ""}`}
                >
                  <AvatarImage src={profile.profileImg} />
                  <AvatarFallback className="text-2xl">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1
                        className={`text-2xl font-semibold mb-2 ${
                          isDarkMode ? "text-stone-100" : "text-stone-900"
                        }`}
                      >
                        {profile.username}
                      </h1>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge
                          variant="outline"
                          className={
                            isDarkMode
                              ? "border-stone-600 text-neutral-200"
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
                              ? "border-stone-600 text-neutral-200"
                              : ""
                          }
                        >
                          {profile.courses.length} Courses Enrolled
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
                              onClick={handleCancel}
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
                      <LogoutButton handleLogout={handleLogout} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div
                      className={`flex items-center gap-2 ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        isDarkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Last login{" "}
                      {formatDate(
                        profile.lastFiveLogin[profile.lastFiveLogin.length - 1],
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
              <CardTitle className={isDarkMode ? "text-stone-100" : ""}>
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileFields.map((field) => (
                  <ProfileField
                    key={field.id}
                    field={field}
                    profile={profile}
                    setProfile={setProfile}
                    isEditing={isEditing}
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
