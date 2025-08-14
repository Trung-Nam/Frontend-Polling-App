import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import UserDetailsCard from "../cards/UserDetailsCard"
import Navbar from "./Navbar"
import SlideMenu from "./SlideMenu"
import TrendingPolls from "./TrendingPolls"



const DashboardLayout = ({ children, activeMenu , stats, showStats}) => {
    const { user } = useContext(UserContext);
    // console.log(user);

    return (
        <div>
            <Navbar activeMenu={activeMenu}/>

            {user && (<div className="flex">
                <div className="max-[1080px]:hidden">
                    <SlideMenu activeMenu={activeMenu} />
                </div>

                <div className="grow mx-5">{children}</div>

                <div className="hidden md:block mr-5">
                    <UserDetailsCard
                        profileImageUrl={user && user.profileImageUrl}
                        fullName={user && user.fullName}
                        username={user && user.username}
                        totalPollsVotes={user && user.totalPollsVotes}
                        totalPollsCreated={user && user.totalPollsCreated}
                        totalPollsBookmarked={user && user.totalPollsBookmarked}
                    />

                    {showStats && stats.length > 0 && (
                       <TrendingPolls stats={stats}/>
                    )}
                </div>
            </div>
            )}

        </div>
    )
}

export default DashboardLayout