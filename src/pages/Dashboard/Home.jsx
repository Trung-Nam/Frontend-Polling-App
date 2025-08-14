import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layout/DashboardLayout"
import HeaderWithFilter from "../../components/layout/HeaderWithFilter";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import PollCard from "../../components/poll cards/PollCard";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from "../../components/cards/EmptyCard";
import CREATE_ICON from "../../assets/images/my-poll-icon.png";

const PAGE_SIZE = 10;

const Home = () => {
  useUserAuth();


  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  const fetchAllPolls = async (overridePage = page) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${page}&limit=${PAGE_SIZE}&type=${filterType}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prev) =>
          overridePage === 1
            ? response.data.polls
            : [...prev, ...response.data.polls]
        );
        setStats(response.data?.stats || []);
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
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
    return () => { }
  }, [page]);


  return (
    <DashboardLayout activeMenu="Dashboard" stats={stats || []} showStats={true}>
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="Polls"
          filterType={filterType}
          setFilterType={setFilterType}
          stats={stats}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="Welcome! You are the first user of the system, and you haven't created any polls yet. Create a poll to get started."
            buttonText="Create Poll"
            onClick={() => navigate("/create-poll")}
          />
        )}


        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Loading...</h4>}
          endMessage={<h4 className="info-text">No more polls to display.</h4>}
        >


          {allPolls.map((poll) => (
            <PollCard
              key={`dashboard_${poll._id}`}
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
              isMyPoll
            />
          ))}

        </InfiniteScroll>

      </div>
    </DashboardLayout>
  )
}

export default Home