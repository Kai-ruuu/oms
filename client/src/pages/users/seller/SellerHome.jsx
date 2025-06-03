import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBreakpoint, useViewport } from '../../../helpers/screen';
import { routes, navigator } from '../../../helpers/routing';
import { isUserVerified, logout } from '../../../helpers/auth';

import SellerSidebar from '../../../components/users/seller/SellerSidebar';

export default function SellerHome({ sidebarOn, setSidebarOn }) {
  const { width } = useViewport();
  const [breakpoint, setGetBreakpoint] = useState(null);

  const routeName = "dashboard";

  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);

  const [orderStats, setOrderStats] = useState({
    processing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    totalSales: 0
  });

  useEffect(() => {
    setGetBreakpoint(getBreakpoint(width));
  }, [width]);

  useEffect(() => {
    const [verified, userData] = isUserVerified();
    if (!verified) {
      navigator(routes.global.unauthorized);
      return;
    }

    setUserData(userData);

    if (userData) {
      fetchOrders(userData.user.id);
    }
  }, []);

  useEffect(() => {
    if (!orders.length) return;

    let stats = {
      processing: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
      totalSales: 0
    };

    orders.forEach(order => {
      switch (order.status) {
        case "unprepared":
          stats.processing++;
          break;
        case "for_delivery":
          stats.shipping++;
          break;
        case "delivered":
          stats.delivered++;
          stats.totalSales += (order.variantInfo.price * order.quantity) || 0;
          break;
        default:
          stats.cancelled++;
          break;
      }
    });

    setOrderStats(stats);
  }, [orders]);

  const fetchOrders = async userID => {
    try {
      const response = await fetch(`http://${location.hostname}:3000/order/seller/` + userID);
      const data = await response.json();

      if (response.status !== 200) {
        alert("Failed to fetch orders.");
        return;
      }

      setOrders(data.orders);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch orders.");
    }
  };

  return (
    <div className="w-screen h-[100dvh] bg-gray-100 text-md md:text-lg text-gray-600 flex flex-col">
      <nav className="p-4 bg-gray-900 text-gray-300 flex items-center justify-between z-50 shadow-md">
        <div className="flex items-center space-x-4">
          <span
            onClick={() => setSidebarOn(!sidebarOn)}
            className="material-symbols-outlined cursor-pointer"
          >
            {sidebarOn ? "menu_open" : "menu"}
          </span>
          <h1 className="font-bold text-xl">KZC</h1>
        </div>
        <section className="flex items-center space-x-6">
          <button onClick={logout} className="hover:underline cursor-pointer">
            Logout
          </button>
        </section>
      </nav>

      <div className="relative flex-grow flex">
        <SellerSidebar on={sidebarOn} active={routeName} handler={setSidebarOn} />

        <div className="p-6 flex flex-col items-stretch space-y-4 flex-grow h-full overflow-y-auto">
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Processing" value={orderStats.processing} />
            <StatCard title="Shipped" value={orderStats.shipping} />
            <StatCard title="Delivered" value={orderStats.delivered} />
            <StatCard title="Canceled" value={orderStats.cancelled} />
            <StatCard title="Total Sales" value={`₱ ${orderStats.totalSales.toLocaleString()}`} />
          </section>

          <div className="p-6 pl-0 bg-white rounded-sm shadow-md flex-grow flex flex-col">
            <h2 className="pl-6 text-sm font-bold mb-4">Orders Status Overview</h2>
            <div className="flex-grow text-xs overflow-x-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: 'Processing', count: orderStats.processing },
                    { name: 'Shipped', count: orderStats.shipping },
                    { name: 'Delivered', count: orderStats.delivered },
                    { name: 'Canceled', count: orderStats.cancelled }
                  ]}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Orders']} labelStyle={{ color: '#374151' }} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#111827"
                    strokeWidth={3}
                    dot={{ fill: '#111827', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#111827', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className={`w-full bg-white rounded-sm shadow-md px-5 py-3 flex flex-col items-stretch space-y-3`}>
      <span className="font-bold text-sm">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
