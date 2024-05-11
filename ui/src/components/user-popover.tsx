import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

export function UserPopover() {
  return (
    <div className="pl-2 pb-3 relative">
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
        <PopoverContent sideOffset={5} align='start' className='w-[200px]'>
            <ul className='text-gray-600 text-sm space-y-2'>
                <li className="cursor-pointer hover:underline hover:text-gray-800">Settings</li>
                <li className="cursor-pointer hover:underline hover:text-gray-800">Appearance</li>
                <li className="cursor-pointer hover:underline hover:text-gray-800">Logout</li>
            </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}
