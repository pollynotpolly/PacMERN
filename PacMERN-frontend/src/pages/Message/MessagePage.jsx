import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/user";
import { getToken } from "../../services/authentication";

const MessagePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchAllUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }
            const users = await getAllUsers(token);
            setAllUsers(users);
            setFilteredUsers(users);
            setError(null);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users. " + error.message);
            if (error.message === 'Authentication failed. Please log in again.') {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const filterUsers = useCallback(() => {
        const lowercaseQuery = searchQuery.toLowerCase();
        return allUsers.filter((user) =>
            user.name.toLowerCase().includes(lowercaseQuery)
        );
    }, [searchQuery, allUsers]);

    useEffect(() => {
        setFilteredUsers(filterUsers());
    }, [filterUsers]);

    const handleUserClick = (userId) => {
        navigate(`/message/${userId}`);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: "1rem" }}>
            <h1
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                }}
            >
                Search Users
            </h1>
            <div style={{ marginBottom: "1rem" }}>
                <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search users...'
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            </div>
            {filteredUsers.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {filteredUsers.map((user) => (
                        <li key={user._id} style={{ marginBottom: "0.5rem" }}>
                            <button
                                onClick={() => handleUserClick(user._id)}
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "0.5rem",
                                    background: "none",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {user.profileImage && (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            marginRight: "10px",
                                        }}
                                    />
                                )}
                                {user.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MessagePage;