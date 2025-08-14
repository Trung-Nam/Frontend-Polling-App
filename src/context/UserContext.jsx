import { createContext, useState } from "react"

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    console.log(user);
    // Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Function to clear user data (e.g., on logout)
    const clearUser = () => {
        setUser(null);
    };


    // Update user stats
    const updateUserStats = (key, value) => {
        setUser((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    //update total votes count locally
    const onUserVote = () => {
        const totalPollsVoted = user.totalPollsVotes || 0;
        updateUserStats("totalPollsVotes", totalPollsVoted + 1);
    }

    // Update total polls created count locally
    const onPollCreateOrDelete = (type = "create") => {
        const totalPollsCreated = user.totalPollsCreated;

        updateUserStats(
            "totalPollsCreated",
            type === "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
        )
    }

        // Add or remove the poll id from the user's bookmarked polls
        const toggleBookmarkId = (pollId) => {
            const bookmarks = user.bookmarkedPolls || [];
    
            const index = bookmarks.indexOf(pollId);
    
            if (index === -1) {
                // Add the ID if it's not in the array
                setUser((prev) => ({
                    ...prev,
                    bookmarkedPolls: [...bookmarks, pollId],
                    totalPollsBookmarked: prev.totalPollsBookmarked + 1,
                }));
            } else {
                // Remove the ID if it's in the array
                setUser((prev) => ({
                    ...prev,
                    bookmarkedPolls: bookmarks.filter((item) => item !== pollId),
                    totalPollsBookmarked: prev.totalPollsBookmarked - 1,
                }));
            }
        }

    return (
    <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
            onPollCreateOrDelete,
            onUserVote,
            toggleBookmarkId,
        }}
    >
        {children}
    </UserContext.Provider>
    )
}

export default UserProvider