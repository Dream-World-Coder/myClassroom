import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/ThemeContext";
import type { User } from "@/components/types";
import type { LucideProps } from "lucide-react";

export type profileFieldType = {
  profile?: User;
  setProfile: React.Dispatch<React.SetStateAction<User>>;
  isEditing: boolean;
  field: {
    id: keyof User;
    label: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    placeholder: string;
  };
};

export const ProfileField = ({
  field,
  profile,
  setProfile,
  isEditing,
}: profileFieldType) => {
  const { isDarkMode } = useDarkMode();

  const handleInputChange = (fieldId: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  return (
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
          value={profile ? (profile[field.id]?.toString() ?? "") : ""}
          placeholder={field.placeholder}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          disabled={!isEditing}
          className={
            isDarkMode
              ? "bg-[#111] border-zinc-700 text-neutral-200"
              : "border-slate-300"
          }
        />
      </div>
    </div>
  );
};

export const LogoutButton = ({
  handleLogout,
}: {
  handleLogout: () => void;
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          className={`border ${
            isDarkMode
              ? "text-red-400 border-red-400 bg-red-400/10 hover:bg-red-400/20"
              : "text-red-600 border-red-600 bg-red-600/10 hover:bg-red-600/20"
          }`}
        >
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={`${
          isDarkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-neutral-200"
        } border-2`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className={isDarkMode ? "text-white" : "text-neutral-900"}
          >
            Are you sure you want to logout?
          </AlertDialogTitle>
          <AlertDialogDescription
            className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}
          >
            You will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={`${
              isDarkMode
                ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
            }`}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className={`${
              isDarkMode
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
