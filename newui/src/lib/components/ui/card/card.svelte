<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div
	class={cn("bg-card dark:bg-gray-700/45 text-card-foreground rounded-lg border dark:border-gray-700/50 shadow-sm", className)}
	{...$$restProps}
>
	<slot />
</div>
