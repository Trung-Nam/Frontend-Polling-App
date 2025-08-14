import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getPollBookmarked } from "../../../utils/helper";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";


const PollCard = ({
    pollId,
    question,
    type,
    options,
    voters,
    responses,
    creatorProfileImg,
    creatorName,
    creatorUsername,
    userHasVoted,
    isMyPoll,
    isPollClosed,
    createdAt
}) => {

    const { user } = useContext(UserContext);

    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
    const [rating, setRating] = useState(0);
    const [userResponse, setUserResponse] = useState("");


    const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

    const [pollResult, setPollResult] = useState({
        options,
        voters,
        responses,
    });

    const isPollBookmarked = getPollBookmarked(
        pollId,
        user.bookmarkedPolls || []
    )

    const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
    const [pollClosed, setPollClosed] = useState(isPollClosed || false);
    const [pollDeleted, setPollDeleted] = useState(false);

    return !pollDeleted && (
        <div className="bg-slate-100/50 mx-auto my-5 p-5 rounded-lg border border-slate-50">
            <div className="flex items-start justify-between">
                <UserProfileInfo
                    imgUrl={creatorProfileImg}
                    fullName={creatorName}
                    username={creatorUsername}
                    createdAt={createdAt}
                />
                
                <PollActions
                    pollId={pollId}
                    isVoteComplete={isVoteComplete}
                    inputCaptured={
                        !!(userResponse || selectedOptionIndex >= 0 || rating)
                    }
                    onVoteSubmit={() => { }}
                    isBookmarked={pollBookmarked}
                    toggleBookmark={() => { }}
                    isMyPoll={isMyPoll}
                    pollClosed={pollClosed}
                    onClosePoll={() => { }}
                    onDelete={() => { }}
                />
            </div>
        </div>
    )
}

export default PollCard