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
import { Button } from "@/components/ui/button";

const LogoutButton = ({ isDarkMode, handleLogout }) => {
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
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white border-gray-200"
                } border-2`}
            >
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                        Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription
                        className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                    >
                        You will need to sign in again to access your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className={`${
                            isDarkMode
                                ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                                : "bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200"
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

export default LogoutButton;
