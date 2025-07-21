// export const menus =[
//     {
//       label: "Utilization Certificate Generate ",
//       path: "/home/uc_c",
//       roles: ["A", "AC"],
//       id: 1
//     },
//     {
//       label: "Utilization Certificate",
//       path: "/home/uc",
//       roles: ["S", "AC"],
//       id: 2
//     },
//     {
//       label: "Home Page",
//       path: "/home/admin_approval",
//       roles: ["S", "AC", "A"],
//       id: 3
//     },
//     // {
//     //   label: "Utilization Certificate",
//     //   path: "uc",
//     //   roles: ["A"],
//     // },

//     // {
//     //   label: "Utilization Certificate",
//     //   path: "uc",
//     //   roles: ["AC"],
//     // }
// ]

export const menus = [
    {
      label: "Administrative Approval",
      path: "/home/admin_approval",
      roles: ["S", "A"],
      id: 1,
    },
    {
      label: "Tender Formalities",
      path: "/home/tender_formality",
      roles: ["S", "A", "F"],
      id: 2,
    },
    {
      label: "Progress Report",
      path: "/home/pr",
      roles: ["S", "A", "F"],
      id: 3,
    },
    {
      label: "Fund Release/Receipt",
      path: "/home/fund_release",
      roles: ["S"],
      id: 4,
    },
    {
      label: "Expenditure",
      path: "/home/fund_expense",
      roles: ["S", "A", "AC"],
      id: 5,
    },
    {
      label: "PCR",
      path: "/home/pcr",
      roles: ["S", "A", "AC"],
      id: 6,
    },
    {
      label: "Project Status",
      path: "/home/pro_status",
      roles: ["S"],
      id: 7,
    },
    {
      label: "Utilization Certificate List Generate ",
      path: "/home/uc_c",
      roles: ["S", "AC"],
      id: 8,
    },
    {
      label: "Utilization Certificate List",
      path: "/home/uc",
      roles: ["S", "AC"],
      id: 9,
    },
    {
      label: "Master",
      path: "/home/master",
      roles: ["S", "A"],
      id: 10,
    },
    {
      label: "Manage User",
      path: "/home/user",
      roles: ["S", "A"],
      id: 11,
    },
    {
      label: "Manage Agency",
      path: "/home/agency",
      roles: ["S"],
      id: 15,
    },
    {
      label: " Report",
      path: "/home/report",
      roles: ["S", "A", "AC"],
      id: 12,
    },
    {
      label: "Change Password",
      path: "/home/user-profile/change-password",
      roles: ["S", "A", "F", "AC"],
      id: 13,
    },
    {
      label: "User Profile",
      path: "/home/user-profile/profile",
      roles: ["S", "A", "F", "AC"],
      id: 14,
    }
]