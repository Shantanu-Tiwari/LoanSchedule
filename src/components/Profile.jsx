import { useQuery } from "convex/react";
import { api} from "../../convex/_generated/api.js";
import { useUser } from "@clerk/clerk-react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
    const { user } = useUser(); // Get logged-in user from Clerk
    const userData = useQuery(api.users.getUserByClerkId, { clerkId: user?.id });

    return (
        <SettingSection icon={User} title={"Profile"}>
            <div className="flex flex-col sm:flex-row items-center mb-6">
                <img
                    src={user?.imageUrl || "https://xsgames.co/randomusers/assets/images/favicon.png"}
                    alt="Profile"
                    className="rounded-full w-20 h-20 object-cover mr-4"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                        {userData ? userData.name : "Loading..."}
                    </h3>
                    <p className="text-gray-400">{user?.emailAddresses?.[0]?.emailAddress || "No email"}</p>
                </div>
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
                Edit Profile
            </button>
        </SettingSection>
    );
};

export default Profile;
