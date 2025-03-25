import LOGO from "../Assets/Images/logo.png"
export const getPrintCommonHeader = () => {
    return `
      <div class="logo">
        <img src="${LOGO}" class="mr-3 sm:h-16" alt="Logo" style="width:80px; text-align:center;"/>
      </div>
      <h3>Paschimanchal Unnayan Affairs Department</h3>
      <h3>Government Of West Bengal</h3>
      <p>Poura Bhawan, FD 415A, 5th Floor, Sector - III, Salt Lake, Kolkata - 700106</p>
    `;
  };
  