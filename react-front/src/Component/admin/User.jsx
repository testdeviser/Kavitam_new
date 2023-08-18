import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Datatable from 'react-data-table-component';
import EditUserForm from './EditUserForm';

function Users(props) {

    const [data, setdata] = useState();
    const [filteredUsers, setFilteredUsers] = useState();
    const [search, setSearch] = useState("");

    const [editingUser, setEditingUser] = useState(null); // Track the user being edited

    const handleEditClick = (user) => {
        setEditingUser(user);
    };

    const handleEditFormClose = () => {
        setEditingUser(null);
    };

    const handleEditFormSave = async (updatedUser) => {
        try {
            // Send API request to update the user data
            await axios.put(`/api/admin/users/${updatedUser.id}`, updatedUser);

            // Update the data state with the updated user data
            const updatedData = data.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
            setdata(updatedData);

            // Close the edit form
            setEditingUser(null);

            // Show success message
            Swal.fire('User updated', '', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error here, e.g., show an error message
        }
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const DataPerPage = useRef(5)

    const autoRefreshTimer = useRef(null);

    const fetchUsers = () => {
        try {
            axios.get(`/api/admin/users/fetch`).then(res => {
                setdata(res.data.users);
                setFilteredUsers(res.data.users);
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    // Function to start auto-refresh
    const startAutoRefresh = () => {
        autoRefreshTimer.current = setInterval(fetchUsers, 5000); // 5 seconds
    }

    // Function to stop auto-refresh
    const stopAutoRefresh = () => {
        clearInterval(autoRefreshTimer.current);
    }


    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Username",
            selector: (row) => row.username,
            sortable: true,
        },
        // {
        //     name: "Phone",
        //     selector: (row) => row.phone,
        //     sortable: true,
        // },
        {
            name: "Status",
            cell: (row) => (
                <>
                    <button className='btn btn-primary' onClick={() => handleEditClick(row)}>Edit</button>
                    <button className='btn btn-danger' onClick={() => handleStatusUpdate(row.id)}>Delete</button>
                </>
            )
        }
    ];

    useEffect(() => {
        // Initial fetch
        fetchUsers();
        // Start auto-refresh when the component mounts
        startAutoRefresh();
        // Clean up the interval when the component unmounts
        return () => stopAutoRefresh();
    }, []);

    useEffect(() => {
        if (data) {
            const result = data.filter(user => {
                const nameMatches = user.name.toLowerCase().includes(search.toLowerCase());
                const usernameMatches = user.username.toLowerCase().includes(search.toLowerCase());
                return nameMatches || usernameMatches; // Return true if either name or username matches
            });
            setFilteredUsers(result);
        }
    }, [search, data]);

    const lastIndex = currentPage * DataPerPage.current;
    const firstIndex = lastIndex - DataPerPage.current;
    const data1 = data ? data.slice(firstIndex, lastIndex) : [];

    const handleStatusUpdate = (userId, newStatus) => {
        // Show SweetAlert confirmation
        Swal.fire({
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    // Send request to delete the user
                    axios.delete(`/api/admin/users/${userId}`).then(() => {
                        // Handle successful delete, such as showing a success message
                        Swal.fire('User deleted', '', 'success');
                        // Call fetchUsers again to update the data
                        fetchUsers();
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        });
    };



    return (
        <div className="backend_payments backend_users" style={{ marginLeft: "40px", margin: "0px auto" }}>

            {editingUser ? (
                <EditUserForm
                    user={editingUser}
                    onClose={handleEditFormClose}
                    onSave={handleEditFormSave}
                />
            ) : (
                <Datatable
                    title="Users"
                    columns={columns}
                    //={data}
                    data={filteredUsers}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight='400px'
                    //selectableRows
                    selectableRowsHighlight
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                        <input type='text' placeholder='Search Here' value={search} onChange={(e) => setSearch(e.target.value)} />
                    }
                //subHeaderAlign='left'
                //actions={<button className='btn btn-sm btn-info'>Export</button>}
                />

            )}

            {/* // {editingUser && (
            //     <EditUserForm
            //         user={editingUser}
            //         onClose={handleEditFormClose}
            //         onSave={handleEditFormSave}
            //     />
            // )} */}

        </div>
    );
}

export default Users;
