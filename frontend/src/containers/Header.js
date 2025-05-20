import { themeChange } from 'theme-change'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { openRightDrawer } from '../features/common/rightDrawerSlice'
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'
import { useNavigate } from 'react-router-dom'

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pageTitle } = useSelector(state => state.header)
    
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        themeChange(false)  // Menginisialisasi tema dengan theme-change

        // Menetapkan status login berdasarkan keberadaan token di localStorage
        const token = localStorage.getItem("token")
        setIsLoggedIn(!!token)  // Jika token ada, berarti pengguna sudah login

        if (currentTheme === null) {
            // Tentukan tema berdasarkan preferensi pengguna (dark atau light)
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setCurrentTheme("dark")
            } else {
                setCurrentTheme("light")
            }
        }
    }, [currentTheme]) // Pastikan efek ini berjalan hanya sekali saat komponen pertama kali dimuat

    const openNotification = () => {
        dispatch(openRightDrawer({ header: "Notifications", bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }))
    }

    function toggleLogin() {
        if (isLoggedIn) {
            localStorage.removeItem("token")  // Menghapus token saat logout
            setIsLoggedIn(false)  // Mengubah status login menjadi false
            navigate('/login')  // Navigasi ke halaman login
        } else {
            navigate('/login')  // Navigasi ke halaman login jika belum login
        }
    }

    const handleThemeChange = (e) => {
        const theme = e.target.checked ? "dark" : "light"
        localStorage.setItem("theme", theme)  // Simpan preferensi tema ke localStorage
        setCurrentTheme(theme)  // Perbarui state tema
    }

    return (
        <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
            <div className="flex-1">
                <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                    <Bars3Icon className="h-5 inline-block w-5" />
                </label>
                <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
            </div>

            <div className="flex-none">
                {/* Tema switch */}
                <label className="swap">
                    <input type="checkbox" checked={currentTheme === "dark"} onChange={handleThemeChange} />
                    <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "dark" ? "swap-on" : "swap-off")} />
                    <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "light" ? "swap-on" : "swap-off")} />
                </label>

                {/* Tombol Masuk/Keluar */}
                <button onClick={toggleLogin} className="btn btn-primary ml-4">
                    {isLoggedIn ? "Keluar" : "Masuk"}
                </button>
            </div>
        </div>
    )
}

export default Header
