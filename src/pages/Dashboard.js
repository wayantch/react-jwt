// Import hook react
import React, { useState, useEffect } from 'react';

// Import hook useNavigate dari react-router-dom (bukan useHistory di React Router v6)
import { useNavigate } from 'react-router-dom';

// Import axios
import axios from 'axios';

function Dashboard() {

    // State user
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    // Define navigate
    const navigate = useNavigate();

    // Token
    const token = localStorage.getItem("token");

    // Function "fetchData"
    const fetchData = async () => {
        // Set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Fetch user from Rest API
        await axios.get('http://localhost:8000/api/user')
        .then((response) => {
            // Set response user ke state
            setUser(response.data);
            setLoading(false);  // Stop loading once data is fetched
        })
        .catch((error) => {
            // Handle error jika diperlukan
            console.error("Error fetching user data: ", error);
            setLoading(false);
        });
    };

    // Hook useEffect
    useEffect(() => {
        // Cek token kosong
        if (!token) {
            // Redirect ke halaman login
            navigate('/');
        }

        // Call function "fetchData"
        fetchData();
    }, [token, navigate]);

    // Function logout
    const logoutHandler = async () => {
        // Set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Fetch Rest API untuk logout
        await axios.post('http://localhost:8000/api/logout')
        .then(() => {
            // Remove token dari localStorage
            localStorage.removeItem("token");

            // Redirect ke halaman login
            navigate('/');
        })
        .catch((error) => {
            // Handle error jika diperlukan
            console.error("Error during logout: ", error);
        });
    };

    return (
        <div className="container" style={{ marginTop: "50px" }}>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-primary text-white text-center py-3">
                            <h4>Welcome to the Admin Dashboard</h4>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h5>Welcome back, <strong>{user.name}</strong></h5>
                                    <p>Email: {user.email}</p>
                                    <hr />
                                    <button onClick={logoutHandler} className="btn btn-danger">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
