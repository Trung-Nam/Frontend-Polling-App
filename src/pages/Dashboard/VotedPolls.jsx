import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layout/DashboardLayout"
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import PollCard from "../../components/poll cards/PollCard";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from "../../components/cards/EmptyCard";
import CREATE_ICON from "../../assets/images/my-poll-icon.png";

const PAGE_SIZE = 10;

const VotedPolls = () => {
  useUserAuth();


  const navigate = useNavigate();


  const [votedPolls, setVotedPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  const fetchAllPolls = async (overridePage = page) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.VOTED_POLLS}?page=${page}&limit=${PAGE_SIZE}`
      );

      if (response.data?.polls?.length > 0) {
        setVotedPolls((prev) =>
          overridePage === 1
            ? response.data.polls
            : [...prev, ...response.data.polls]
        );
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const loadMorePolls = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, []);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
  }, [page]);


  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-black">Voted Polls</h2>

        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="You haven't voted on any polls yet."
            buttonText="Explore Polls"
            onClick={() => navigate("/dashboard")}
          />
        )}


        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Loading...</h4>}
          endMessage={<h4 className="info-text">No more polls to display.</h4>}
        >
          {votedPolls.map((poll, index) => (
            <PollCard
              key={`voted_${poll._id}_${index}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters.length || 0}
              responses={poll.responses || 0}
              creatorProfileImg={poll.creator.profileImageUrl || null}
              creatorName={poll.creator.fullName}
              creatorUsername={poll.creator.username}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || false}
              isMyPoll={false}
            />
          ))}
        </InfiniteScroll>

      </div>
    </DashboardLayout>
  )
}

export default VotedPolls;