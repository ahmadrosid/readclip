<script lang="ts">
    import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
    import { onMount } from 'svelte';
    import ModeToggle from '@/components/ui/ModeToggle.svelte';

    interface User {
        photoURL: string;
        displayName: string;
    }

    let user: User | null = null;

    onMount(() => {
        // Initialize user data here
        // This is a placeholder for the useAuth hook functionality
        user = {
            photoURL: '/avatar.svg',
            displayName: ''
        };
    });

    async function handleLogout() {
        // Implement logout logic here
        // This is a placeholder for the auth.signOut() functionality
        window.localStorage.removeItem("token");
        // Instead of using navigate, we'll use window.location
        window.location.href = "/login";
    }
</script>

<div class="px-2 pb-3 relative flex justify-between items-center">
    <Popover>
        <PopoverTrigger>
            <div class="p-2 rounded-md flex gap-2 items-center cursor-pointer">
                <img
                    src={user?.photoURL || "/img/avatar.png"}
                    class="w-7 h-7 rounded-full"
                    alt={user?.displayName || ""}
                />
                <div class='hidden sm:block'>{user?.displayName || ""}</div>
            </div>
        </PopoverTrigger>
        <PopoverContent sideOffset={5} align='start' class='w-[200px] dark:bg-gray-800'>
            <ul class='text-gray-600 dark:text-gray-400 text-sm space-y-2'>
                <li class="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300">Settings</li>
                <li class="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300">Appearance</li>
                <li class="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300" on:click={handleLogout}>Logout</li>
            </ul>
        </PopoverContent>
    </Popover>
    <div class='hidden sm:block'>
        <ModeToggle />
    </div>
</div>