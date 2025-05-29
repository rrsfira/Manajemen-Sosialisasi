/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon"; 
import PlayIcon from "@heroicons/react/24/outline/PlayIcon"; 


const iconClasses = `h-6 w-6`;

const routes = [
  {
    path: "/spr/Dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Beranda",
  },
  {
    path: "", //no url needed as this has submenu
    icon: <UserGroupIcon className={`${iconClasses} inline`} />, // icon component
    name: "Sosialisasi", // name that appear in Sidebar
    submenu: [
      {
        path: "/spr/EducationUnit",
        name: "Satuan Pendidikan",
      },
      {
        path: "/spr/HealthFacility", //url
        name: "Fasilitas Kesehatan", // name that appear in Sidebar
      },
      {
        path: "/spr/PublicHousing",
        name: "Rusun",
      },
      {
        path: "/spr/Mall",
        name: "Mall",
      },
      {
        path: "/spr/Hotel",
        name: "Hotel",
      },
      {
        path: "/spr/Office",
        name: "Perkantoran",
      },
      {
        path: "/spr/Apartment",
        name: "Apartemen",
      },
      {
        path: "/spr/UrbanVillage",
        name: "Kelurahan Tangguh",
      },
    ],
  },

  {
    path: "/spr/Education", // url
    icon: <BookOpenIcon className={iconClasses} />, // icon component
    name: "Materi", // name that appear in Sidebar
  },

  {
    path: "", //no url needed as this has submenu
    icon: <PlayIcon className={`${iconClasses} inline`} />, // icon component
    name: "Game", // name that appear in Sidebar
    submenu: [
      {
        path: "/spr/GameTK",
        name: "Game TK",
      },
      {
        path: "/spr/GameSD", //url
        name: "Game SD", // name that appear in Sidebar
      },
      {
        path: "/spr/GameSMP",
        name: "Game SMP",
      },
      {
        path: "/spr/GameSMA",
        name: "Game SMA",
      },
      {
        path: "/spr/GameMasyarakat",
        name: "Game Masyarakat",
      },
      
    ],
  },

  {
    path: "/spr/SuperAdmin/DataAdmin", // url
    icon: <UserCircleIcon  className={iconClasses} />, // icon component
    name: "Data Admin", // name that appear in Sidebar
  },
  {
    path: "/spr/SuperAdmin/AuditAdmin", // url
    icon: <ArrowPathIcon className={iconClasses} />, // icon component
    name: "Audit Admin", // name that appear in Sidebar
  },
  {
    path: "/spr/Profile", // url
    icon: <UserIcon className={iconClasses} />, // icon component
    name: "Profile", // name that appear in Sidebar
  },
];

export default routes;
