const sideBarWidth = "10ch",
  zeroWidth = "0ch";

const slideSideBar = () => {
  const sideBar = document.getElementById("sideBarContent");
  sideBar.style.width =
    sideBar.style.width === zeroWidth ? sideBarWidth : zeroWidth;
};
