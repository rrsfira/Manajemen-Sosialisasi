// All components mapping with path for internal routes

import { lazy } from "react";

const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const ProfileSettings = lazy(() => import("../pages/protected/ProfileSettings"));
const GettingStarted = lazy(() => import("../pages/GettingStarted"));
const Profile = lazy(() => import("../pages/protected/profile"));

const Dashboards = lazy(() => import("../pages/protected/Dashboard"));

const EducationUnits = lazy(() => import("../pages/protected/educationUnit"));
const EducationUnitsCreate = lazy(() => import("../pages/protected/educationUnitCreate"));
const EducationUnitsEdit = lazy(() => import("../pages/protected/educationUnitEdit"));
const EducationUnitsDetail = lazy(() => import("../pages/protected/educationUnitDetail"));

const HealthFacilities = lazy(() => import("../pages/protected/healthFacility"));
const HealthFacilitiesCreate = lazy(() => import("../pages/protected/healthFacilityCreate"));
const HealthFacilitiesEdit = lazy(() => import("../pages/protected/healthFacilityEdit"));
const HealthFacilitiesDetail = lazy(() => import("../pages/protected/healthFacilityDetail"));

const PublicHousing = lazy(() => import("../pages/protected/publicHousing"));
const PublicHousingCreate = lazy(() => import("../pages/protected/publicHousingCreate"));
const PublicHousingEdit = lazy(() => import("../pages/protected/publicHousingEdit"));
const PublicHousingDetail = lazy(() => import("../pages/protected/publicHousingDetail"));


const Malls = lazy(() => import("../pages/protected/mall"));
const MallsCreate = lazy(() => import("../pages/protected/mallCreate"));
const MallsEdit = lazy(() => import("../pages/protected/mallEdit"));
const MallsDetail = lazy(() => import("../pages/protected/mallDetail"));


const Hotels = lazy(() => import("../pages/protected/hotel"));
const HotelsCreate = lazy(() => import("../pages/protected/hotelCreate"));
const HotelsEdit = lazy(() => import("../pages/protected/hotelEdit"));
const HotelsDetail = lazy(() => import("../pages/protected/hotelDetail"));


const Offices = lazy(() => import("../pages/protected/office"));
const OfficesCreate = lazy(() => import("../pages/protected/officeCreate"));
const OfficesEdit = lazy(() => import("../pages/protected/officeEdit"));
const OfficesDetail = lazy(() => import("../pages/protected/officeDetail"));


const Apartements = lazy(() => import("../pages/protected/apartement"));
const ApartmentDetail = lazy(() => import("../pages/protected/apartementDetails"));
const ApartmentsCreate = lazy(() => import("../pages/protected/apartementCreate"));
const ApartmentsEdit = lazy(() => import("../pages/protected/apartementEdit"));


const UrbanVillages = lazy(() => import("../pages/protected/urbanVillage"));
const UrbanVillagesCreate = lazy(() => import("../pages/protected/urbanVillageCreate"));
const UrbanVillagesEdit = lazy(() => import("../pages/protected/urbanVillageEdit"));
const UrbanVillagesDetail = lazy(() => import("../pages/protected/urbanVillageDetail"));


const Education = lazy(() => import("../pages/protected/education"));
const EducationCreate = lazy(() => import("../pages/protected/educationCreate"));
const EducationEdit = lazy(() => import("../pages/protected/educationEdit"));
const EducationDetail = lazy(() => import("../pages/protected/educationDetails"));


const GameTK = lazy(() => import("../pages/protected/gameTK"));
const GameSD = lazy(() => import("../pages/protected/gameSD"));
const GameSMP = lazy(() => import("../pages/protected/gameSMP"));
const GameSMA = lazy(() => import("../pages/protected/gameSMA"));
const GameMasyarakat = lazy(() => import("../pages/protected/gameMasyarakat"));
const GameEdit = lazy(() => import("../pages/protected/gameEdit"));


const UserSuperAdmin = lazy(() => import("../pages/protected/DataAdminSuperAdmin"));
const AdminCreate = lazy(() => import("../pages/protected/DataAdminSuperAdminCreate"));
const AdminEdit = lazy(() => import("../pages/protected/DataAdminSuperAdminEdit"));
const AuditAdmin = lazy(() => import("../pages/protected/auditAdmin"));


const routes = [
  {
    path: "/welcome", // the url
    component: Welcome, // view rendered
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/getting-started",
    component: GettingStarted,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/Profile",
    component: Profile,
  },

  {
    path: "/Dashboard", // the url
    component: Dashboards, // view rendered
  },
  {
    path: "/EducationUnit",
    component: EducationUnits,
  },
  {
    path: "/EducationUnit/Create",
    component: EducationUnitsCreate,
  },
  {
    path: "/EducationUnit/Edit/:id",
    component: EducationUnitsEdit,
  },
  {
    path: "/EducationUnit/Detail/:id",
    component: EducationUnitsDetail,
  },


  {
    path: "/HealthFacility",
    component: HealthFacilities,
  },
  {
    path: "/HealthFacility/Create",
    component: HealthFacilitiesCreate,
  },
  {
    path: "/HealthFacility/Edit/:id",
    component: HealthFacilitiesEdit,
  },
  {
    path: "/HealthFacility/Detail/:id",
    component: HealthFacilitiesDetail,
  },


  {
    path: "/PublicHousing",
    component: PublicHousing,
  },
  {
    path: "/PublicHousing/Create",
    component: PublicHousingCreate,
  },
  {
    path: "/PublicHousing/Edit/:id",
    component: PublicHousingEdit,
  },
  {
    path: "/PublicHousing/Detail/:id",
    component: PublicHousingDetail,
  },


  {
    path: "/Mall",
    component: Malls,
  },
  {
    path: "/Mall/Create",
    component: MallsCreate,
  },
  {
    path: "/Mall/Edit/:id",
    component: MallsEdit,
  },
  {
    path: "/Mall/Detail/:id",
    component: MallsDetail,
  },


  {
    path: "/Hotel",
    component: Hotels,
  },
  {
    path: "/Hotel/Create",
    component: HotelsCreate,
  },
  {
    path: "/Hotel/Edit/:id",
    component: HotelsEdit,
  },
  {
    path: "/Hotel/Detail/:id",
    component: HotelsDetail,
  },


  {
    path: "/Office",
    component: Offices,
  },
  {
    path: "/Office/Create",
    component: OfficesCreate,
  },
  {
    path: "/Office/Edit/:id",
    component: OfficesEdit,
  },
  {
    path: "/Office/Detail/:id",
    component: OfficesDetail,
  },


  {
    path: "/Apartment",
    component: Apartements,
  },
  {
    path: "/Apartment/Detail/:id",
    component: ApartmentDetail,
  },
  {
    path: "/Apartment/Create",
    component: ApartmentsCreate,
  },
  {
    path: "/Apartment/Edit/:id",
    component: ApartmentsEdit,
  },


  {
    path: "/UrbanVillage",
    component: UrbanVillages,
  },
  {
    path: "/UrbanVillage/Create",
    component: UrbanVillagesCreate,
  },
  {
    path: "/UrbanVillage/Edit/:id",
    component: UrbanVillagesEdit,
  },
  {
    path: "/UrbanVillage/Detail/:id",
    component: UrbanVillagesDetail,
  },


  {
    path: "/Education",
    component: Education,
  },
  {
    path: "/Education/Create",
    component: EducationCreate,
  },
  {
    path: "/Education/Edit/:id",
    component: EducationEdit,
  },
  {
    path: "/Education/Details/:id",
    component: EducationDetail,
  },

  


  {
    path: "/GameTK",
    component: GameTK,
  },
  {
    path: "/GameSD",
    component: GameSD,
  },
  {
    path: "/GameSMP",
    component: GameSMP,
  },
  {
    path: "/GameSMA",
    component: GameSMA,
  },
  {
    path: "/GameMasyarakat",
    component: GameMasyarakat,
  },
  {
    path: "/Game/Edit/:id",
    component: GameEdit,
  },
  



  {
    path: "/SuperAdmin/DataAdmin",
    component: UserSuperAdmin,
  },
  {
    path: "/SuperAdmin/AdminCreate",
    component: AdminCreate,
  },
  {
    path: "/SuperAdmin/AdminEdit/:id",
    component: AdminEdit,
  },
  {
    path: "/SuperAdmin/AuditAdmin",
    component: AuditAdmin,
  },

  
];

export default routes;
