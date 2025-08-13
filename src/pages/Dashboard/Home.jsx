import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layout/DashboardLayout"
import HeaderWithFilter from "../../components/layout/HeaderWithFilter";


const Home = () => {
  useUserAuth();


  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />
      </div>
    </DashboardLayout>
  )
}

export default Home