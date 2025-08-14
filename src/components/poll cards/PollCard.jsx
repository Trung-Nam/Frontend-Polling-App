import { useCallback, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getPollBookmarked } from "../../../utils/helper";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";
import { PollingResultContent } from "./PollingResultContent";


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

    const { user, onUserVote, toggleBookmarkId } = useContext(UserContext);

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


    // handle user input based on poll type
    const handleInput = (value) => {
        if (type === "rating") setRating(value);
        else if (type === "open-ended") setUserResponse(value);
        else setSelectedOptionIndex(value);
    }

    // generate the post data based on poll type
    const getPostData = useCallback(() => {
        if (type === "open-ended") {
            return { responseText: userResponse, voterId: user._id };
        }

        if (type === "rating") {
            return { optionIndex: rating - 1, voterId: user._id };
        }

        return { optionIndex: selectedOptionIndex, voterId: user._id };
    }, [type, userResponse, rating, selectedOptionIndex, user]);

    // get poll details by id
    const getPollDetail = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.POLLS.GET_BY_ID(pollId));

            if (response.data) {
                const pollDetails = response.data;
                setPollResult({
                    options: pollDetails.options || [],
                    voters: pollDetails.voters.length || 0,
                    responses: pollDetails.responses || 0,
                });
            }
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong");
        }
    }

    // handle the poll submission of votes
    const handleVoteSubmit = async () => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.VOTE(pollId),
                getPostData()
            );

            getPollDetail();
            setIsVoteComplete(true);
            onUserVote();
            toast.success("Your vote has been submitted successfully");

        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    // Toggles the bookmark status of a poll
    const toggleBookmark = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.POLLS.BOOKMARK(pollId));

            toggleBookmarkId(pollId);
            setPollBookmarked((prev) => !prev);
            toast.success(response.data.message);
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }




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
                    onVoteSubmit={handleVoteSubmit}
                    isBookmarked={pollBookmarked}
                    toggleBookmark={toggleBookmark}
                    isMyPoll={isMyPoll}
                    pollClosed={pollClosed}

                    // TODO: Add the onClosePoll and onDelete functions
                    onClosePoll={() => { }}
                    onDelete={() => { }}
                />
            </div>


            <div className="ml-14 mt-3">
                <p className="text-[15px] text-black leading-8">
                    {question}
                </p>

                <div className="mt-4">
                    {isVoteComplete || isPollClosed ? (
                        <PollingResultContent
                            type={type}
                            options={pollResult.options || []}
                            voters={pollResult.voters}
                            responses={pollResult.responses || []}
                        />
                    ) : (
                        <PollContent
                            type={type}
                            options={options}
                            selectedOptionIndex={selectedOptionIndex}
                            onOptionSelect={handleInput}
                            rating={rating}
                            onRatingChange={handleInput}
                            userResponse={userResponse}
                            onResponseChange={handleInput}
                        />
                    )}
                </div>

            </div>
        </div>
    )
}

export default PollCard