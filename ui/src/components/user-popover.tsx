import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ModeToggle } from './mode-toggle'
import { useCallback } from "react";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export function UserPopover() {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    window.localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  return (
    <div className="px-2 pb-3 relative flex justify-between items-center">
      <Popover>
        <PopoverTrigger asChild>
            <div className="p-2 rounded-md flex gap-2 items-center cursor-pointer">
                <img
                  src="https://pbs.twimg.com/profile_images/1590244369919258625/ICtjIhUJ_x96.jpg"
                  className="w-7 h-7 rounded-full"
                  alt="User Avatar"
                />
                <div className='hidden sm:block'>Ahmad Rosid</div>
            </div>
        </PopoverTrigger>
        <PopoverContent sideOffset={5} align='start' className='w-[200px] dark:bg-gray-800'>
            <ul className='text-gray-600 dark:text-gray-400 text-sm space-y-2'>
                <li className="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300">Settings</li>
                <li className="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300">Appearance</li>
                <li className="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300" onClick={handleLogout}>Logout</li>
            </ul>
        </PopoverContent>
      </Popover>
      <div className='hidden sm:block'>
        <ModeToggle />
      </div>
    </div>
  )
}
