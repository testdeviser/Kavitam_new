// src/utils/utils.js
export const setActiveSidebarLink = (data) => {
    const links = document.querySelectorAll(".profile_side-ul li");
    links.forEach((link) => {
        link.classList.remove("active-sidebar");
        if (link.textContent === data) {
            link.classList.add("active-sidebar");
        }
    });
};
