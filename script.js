const sideBarWidth = "100%",
  zeroWidth = "0px";
const sideBarPadding = "0.1em";

const slideSideBar = () => {
  const sideBar = document.getElementById("sideBarContent");
  sideBar.style.maxWidth =
    sideBar.style.maxWidth === zeroWidth ? sideBarWidth : zeroWidth;
  sideBar.style.paddingLeft =
    sideBar.style.paddingLeft === zeroWidth ? sideBarPadding : zeroWidth;
  sideBar.style.paddingRight =
    sideBar.style.paddingRight === zeroWidth ? sideBarPadding : zeroWidth;
};
