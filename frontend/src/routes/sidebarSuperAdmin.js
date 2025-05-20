/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

const iconClasses = `h-6 w-6`

const routes = [

  {
    path: '/spr/Dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Beranda',
  },
  {
    path: '/spr/SuperAdmin/DataAdmin', // url
    icon: <BookOpenIcon className={iconClasses}/>, // icon component
    name: 'Data Admin', // name that appear in Sidebar
  },
  {
    path: '/spr/SuperAdmin/AuditAdmin', // url
    icon: <ArrowPathIcon className={iconClasses}/>, // icon component
    name: 'Audit Admin', // name that appear in Sidebar
  },
  
]

export default routes


