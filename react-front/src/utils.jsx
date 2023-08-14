// utils.js
export const handleSidebarStyle = (e, data) => {
    const handleSidebar_style = (e, data) => {
        // Remove the previous active class
        const findClass = document.getElementsByClassName("active-sidebar");
        if (findClass.length > 0) {
            findClass[0].classList.remove("active-sidebar");
        }

        // Add active class to the clicked link
        if (data === "profile") {
            const profileLink = document.querySelector('li[onClick*="profile"]');
            profileLink.classList.add("active-sidebar");
        } else if (data === "wallet") {
            const walletLink = document.querySelector('li[onClick*="wallet"]');
            walletLink.classList.add("active-sidebar");
        } else if (data === "history") {
            const historyLink = document.querySelector('li[onClick*="history"]');
            historyLink.classList.add("active-sidebar");
        }
        // Add similar conditions for other links if needed
    };
};
