import { Outlet } from "react-router"

function MainLayout() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full flex items-center gap-6">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout